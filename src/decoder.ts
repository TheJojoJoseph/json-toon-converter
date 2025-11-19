/**
 * TOON Decoder - Converts TOON format to JSON
 */

import {
  JsonValue,
  JsonObject,
  JsonArray,
  ToonDecodeOptions,
  ToonDelimiter,
  ParsedLine,
  ArrayHeader,
} from './types';
import {
  parsePrimitive,
  parseDelimitedValues,
  detectDelimiter,
  unescapeString,
} from './utils';

export class ToonDecoder {
  private preserveNumbers: boolean;
  private preserveBooleans: boolean;
  private expandPaths: boolean | 'safe';
  private strict: boolean;
  private lines: ParsedLine[];
  private currentIndex: number;
  private indentSize: number;

  constructor(options: ToonDecodeOptions = {}) {
    this.preserveNumbers = options.preserveNumbers ?? true;
    this.preserveBooleans = options.preserveBooleans ?? true;
    this.expandPaths = options.expandPaths ?? true;
    this.strict = options.strict ?? true;
    this.lines = [];
    this.currentIndex = 0;
    this.indentSize = 0;
  }

  /**
   * Decode a TOON string to JSON
   */
  decode(toon: string): JsonValue {
    this.lines = this.parseLines(toon);
    this.currentIndex = 0;
    
    if (this.lines.length === 0) {
      return null;
    }

    // Detect indent size from first indented line
    this.indentSize = this.detectIndentSize();
    
    // Determine root form
    const rootForm = this.determineRootForm();
    
    if (rootForm === 'object') {
      const obj = this.decodeObject(0);
      return this.expandPaths ? this.expandPathsInObject(obj) : obj;
    } else if (rootForm === 'array') {
      return this.decodeArray(0);
    } else {
      // Single primitive value
      const line = this.lines[0];
      return this.parsePrimitiveValue(line.content);
    }
  }

  /**
   * Parse input into lines with depth information
   */
  private parseLines(toon: string): ParsedLine[] {
    const rawLines = toon.split('\n');
    const parsed: ParsedLine[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trimEnd();
      
      // Calculate depth from leading spaces
      const leadingSpaces = line.length - line.trimStart().length;
      const depth = this.indentSize > 0 ? Math.floor(leadingSpaces / this.indentSize) : 0;
      
      parsed.push({
        content: trimmed,
        depth,
        lineNumber: i + 1,
        isBlank: trimmed.length === 0,
      });
    }

    return parsed;
  }

  /**
   * Detect indent size from first indented line
   */
  private detectIndentSize(): number {
    for (const line of this.lines) {
      if (line.isBlank) continue;
      const leadingSpaces = line.content.length - line.content.trimStart().length;
      if (leadingSpaces > 0) {
        return leadingSpaces;
      }
    }
    return 2; // Default
  }

  /**
   * Determine root form (object, array, or primitive)
   */
  private determineRootForm(): 'object' | 'array' | 'primitive' {
    const firstNonBlank = this.lines.find((l) => !l.isBlank);
    if (!firstNonBlank) return 'object';

    const content = firstNonBlank.content.trim();
    
    // Check if it starts with array header
    if (content.startsWith('[') || content.match(/^"[^"]*"\[/)) {
      return 'array';
    }
    
    // Check if it has a colon (key-value pair)
    if (content.includes(':')) {
      return 'object';
    }
    
    // Check if it starts with hyphen (list item)
    if (content.startsWith('- ')) {
      return 'array';
    }
    
    return 'primitive';
  }

  /**
   * Decode an object starting at the given depth
   */
  private decodeObject(depth: number): JsonObject {
    const obj: JsonObject = {};

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      
      // Skip blank lines
      if (line.isBlank) {
        this.currentIndex++;
        continue;
      }

      // Calculate actual depth
      const actualDepth = this.calculateDepth(line);
      
      // If we've gone to a shallower depth, we're done with this object
      if (actualDepth < depth) {
        break;
      }
      
      // If we're deeper, skip (handled by nested structures)
      if (actualDepth > depth) {
        this.currentIndex++;
        continue;
      }

      // Parse key-value pair
      const content = line.content.trim();
      
      // Check for array header
      if (this.isArrayHeader(content)) {
        const header = this.parseArrayHeader(content);
        this.currentIndex++;
        const arr = this.decodeArrayWithHeader(header, depth);
        if (header.key) {
          obj[header.key] = arr;
        }
        continue;
      }

      // Parse key-value
      const colonIndex = this.findUnquotedColon(content);
      if (colonIndex === -1) {
        if (this.strict) {
          throw new Error(`Missing colon in line ${line.lineNumber}: ${content}`);
        }
        this.currentIndex++;
        continue;
      }

      const keyPart = content.substring(0, colonIndex).trim();
      const valuePart = content.substring(colonIndex + 1).trim();
      
      const key = this.parseKey(keyPart);

      // Check for empty structures
      if (valuePart === '{}') {
        obj[key] = {};
        this.currentIndex++;
        continue;
      }
      
      if (valuePart === '[]') {
        obj[key] = [];
        this.currentIndex++;
        continue;
      }
      
      // Check for multiline string with pipe syntax
      if (valuePart === '|') {
        this.currentIndex++;
        obj[key] = this.decodeMultilineString(depth + 1);
        continue;
      }

      if (valuePart === '') {
        // Check if next line is a list item
        this.currentIndex++;
        if (this.currentIndex < this.lines.length) {
          const nextLine = this.lines[this.currentIndex];
          const nextContent = nextLine.content.trim();
          const nextDepth = this.calculateDepth(nextLine);
          
          if (nextDepth === depth + 1 && nextContent.startsWith('- ')) {
            // This is a list array without count notation
            obj[key] = this.decodeListArrayWithoutHeader(depth + 1);
            continue;
          }
        }
        // Nested object
        obj[key] = this.decodeObject(depth + 1);
      } else {
        // Primitive value
        obj[key] = this.parsePrimitiveValue(valuePart);
        this.currentIndex++;
      }
    }

    return obj;
  }

  /**
   * Decode an array starting at the given depth
   */
  private decodeArray(depth: number): JsonArray {
    const line = this.lines[this.currentIndex];
    const content = line.content.trim();
    
    const header = this.parseArrayHeader(content);
    this.currentIndex++;
    
    return this.decodeArrayWithHeader(header, depth);
  }

  /**
   * Decode an array with a parsed header
   */
  private decodeArrayWithHeader(header: ArrayHeader, depth: number): JsonArray {
    const arr: JsonArray = [];

    if (header.length === 0) {
      return arr;
    }

    if (header.isTabular && header.fields) {
      // Tabular array
      return this.decodeTabularArray(header, depth);
    }

    // Check if there's inline content (primitive array)
    const currentLine = this.lines[this.currentIndex - 1];
    const colonIndex = this.findUnquotedColon(currentLine.content);
    if (colonIndex !== -1) {
      const afterColon = currentLine.content.substring(colonIndex + 1).trim();
      if (afterColon) {
        // Inline primitive array
        const values = parseDelimitedValues(afterColon, header.delimiter);
        
        if (this.strict && values.length !== header.length) {
          throw new Error(
            `Array declared ${header.length} items but found ${values.length}`
          );
        }
        
        return values.map((v) => this.parsePrimitiveValue(v));
      }
    }

    // List format array
    return this.decodeListArray(header, depth);
  }

  /**
   * Decode a tabular array
   */
  private decodeTabularArray(header: ArrayHeader, depth: number): JsonArray {
    const arr: JsonArray = [];
    const fields = header.fields!;
    let rowCount = 0;

    while (this.currentIndex < this.lines.length && rowCount < header.length) {
      const line = this.lines[this.currentIndex];
      
      if (line.isBlank) {
        if (this.strict && rowCount > 0 && rowCount < header.length) {
          throw new Error(`Blank line in tabular array at line ${line.lineNumber}`);
        }
        this.currentIndex++;
        continue;
      }

      const actualDepth = this.calculateDepth(line);
      
      if (actualDepth < depth + 1) {
        break;
      }
      
      if (actualDepth > depth + 1) {
        this.currentIndex++;
        continue;
      }

      // Parse row
      const content = line.content.trim();
      const values = parseDelimitedValues(content, header.delimiter);
      
      if (values.length !== fields.length) {
        if (this.strict) {
          throw new Error(
            `Row at line ${line.lineNumber} has ${values.length} values, expected ${fields.length}`
          );
        }
      }

      const obj: JsonObject = {};
      for (let i = 0; i < fields.length; i++) {
        obj[fields[i]] = this.parsePrimitiveValue(values[i] || '');
      }
      
      arr.push(obj);
      rowCount++;
      this.currentIndex++;
    }

    if (this.strict && rowCount !== header.length) {
      throw new Error(`Array declared ${header.length} items but found ${rowCount}`);
    }

    return arr;
  }

  /**
   * Decode a list format array without a header (dynamic length)
   */
  private decodeListArrayWithoutHeader(depth: number): JsonArray {
    const arr: JsonArray = [];

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      
      if (line.isBlank) {
        this.currentIndex++;
        continue;
      }

      const actualDepth = this.calculateDepth(line);
      
      if (actualDepth < depth) {
        break;
      }
      
      if (actualDepth > depth) {
        this.currentIndex++;
        continue;
      }

      const content = line.content.trim();
      
      if (!content.startsWith('- ')) {
        break;
      }

      const afterHyphen = content.substring(2);
      
      // Check if it's an inline bracketed array like [1,2,3]
      if (afterHyphen.startsWith('[') && afterHyphen.includes(']')) {
        const closeBracket = afterHyphen.indexOf(']');
        const bracketContent = afterHyphen.substring(1, closeBracket);
        // For inline arrays, default to comma delimiter
        const delimiter = ',';
        const values = parseDelimitedValues(bracketContent, delimiter);
        arr.push(values.map((v) => this.parsePrimitiveValue(v)));
        this.currentIndex++;
        continue;
      }
      
      // Check if it's an inline array header like [3]: 1,2,3
      if (this.isArrayHeader(afterHyphen)) {
        const itemHeader = this.parseArrayHeader(afterHyphen);
        this.currentIndex++;
        arr.push(this.decodeArrayWithHeader(itemHeader, depth));
        continue;
      }

      // Check if it's an object (has colon)
      const colonIndex = this.findUnquotedColon(afterHyphen);
      if (colonIndex !== -1) {
        // Object item
        this.currentIndex++; // Move past the current line before parsing additional fields
        const obj = this.decodeListObject(afterHyphen, depth);
        arr.push(obj);
        continue;
      }

      // Primitive item
      arr.push(this.parsePrimitiveValue(afterHyphen));
      this.currentIndex++;
    }

    return arr;
  }

  /**
   * Decode a list format array
   */
  private decodeListArray(header: ArrayHeader, depth: number): JsonArray {
    const arr: JsonArray = [];
    let itemCount = 0;
    const maxItems = header.length || Infinity;

    while (this.currentIndex < this.lines.length && itemCount < maxItems) {
      const line = this.lines[this.currentIndex];
      
      if (line.isBlank) {
        if (this.strict && itemCount > 0 && itemCount < header.length) {
          throw new Error(`Blank line in list array at line ${line.lineNumber}`);
        }
        this.currentIndex++;
        continue;
      }

      const actualDepth = this.calculateDepth(line);
      
      if (actualDepth < depth + 1) {
        break;
      }
      
      if (actualDepth > depth + 1) {
        this.currentIndex++;
        continue;
      }

      const content = line.content.trim();
      
      if (!content.startsWith('- ')) {
        if (this.strict) {
          throw new Error(`Expected list item marker '- ' at line ${line.lineNumber}`);
        }
        this.currentIndex++;
        continue;
      }

      const afterHyphen = content.substring(2);
      
      // Check if it's an inline bracketed array like [1,2,3]
      if (afterHyphen.startsWith('[') && afterHyphen.includes(']')) {
        const closeBracket = afterHyphen.indexOf(']');
        const bracketContent = afterHyphen.substring(1, closeBracket);
        // For inline arrays, default to comma delimiter
        const delimiter = ',';
        const values = parseDelimitedValues(bracketContent, delimiter);
        arr.push(values.map((v) => this.parsePrimitiveValue(v)));
        this.currentIndex++;
        itemCount++;
        continue;
      }
      
      // Check if it's an inline array header like [3]: 1,2,3
      if (this.isArrayHeader(afterHyphen)) {
        const itemHeader = this.parseArrayHeader(afterHyphen);
        this.currentIndex++;
        arr.push(this.decodeArrayWithHeader(itemHeader, depth));
        itemCount++;
        continue;
      }

      // Check if it's an object (has colon)
      const colonIndex = this.findUnquotedColon(afterHyphen);
      if (colonIndex !== -1) {
        // Object item
        this.currentIndex++; // Move past the current line before parsing additional fields
        const obj = this.decodeListObject(afterHyphen, depth);
        arr.push(obj);
        itemCount++;
        continue;
      }

      // Primitive item
      arr.push(this.parsePrimitiveValue(afterHyphen));
      itemCount++;
      this.currentIndex++;
    }

    if (this.strict && header.length && itemCount !== header.length) {
      throw new Error(`Array declared ${header.length} items but found ${itemCount}`);
    }

    return arr;
  }

  /**
   * Decode an object that starts on a list item line
   */
  private decodeListObject(firstLine: string, depth: number): JsonObject {
    const obj: JsonObject = {};
    
    // Parse first field
    const colonIndex = this.findUnquotedColon(firstLine);
    if (colonIndex !== -1) {
      const keyPart = firstLine.substring(0, colonIndex).trim();
      const valuePart = firstLine.substring(colonIndex + 1).trim();
      const key = this.parseKey(keyPart);
      
      if (valuePart === '') {
        // First field is nested
        obj[key] = this.decodeObject(depth + 1);
      } else {
        obj[key] = this.parsePrimitiveValue(valuePart);
      }
    }

    // Parse remaining fields at depth + 1
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      
      if (line.isBlank) {
        this.currentIndex++;
        continue;
      }

      const actualDepth = this.calculateDepth(line);
      
      if (actualDepth < depth + 1) {
        break;
      }
      
      if (actualDepth > depth + 1) {
        this.currentIndex++;
        continue;
      }

      const content = line.content.trim();
      
      // Check for array header
      if (this.isArrayHeader(content)) {
        const header = this.parseArrayHeader(content);
        this.currentIndex++;
        const arr = this.decodeArrayWithHeader(header, depth + 1);
        if (header.key) {
          obj[header.key] = arr;
        }
        continue;
      }

      // Parse key-value
      const colonIdx = this.findUnquotedColon(content);
      if (colonIdx === -1) {
        break;
      }

      const keyPart = content.substring(0, colonIdx).trim();
      const valuePart = content.substring(colonIdx + 1).trim();
      const key = this.parseKey(keyPart);

      if (valuePart === '') {
        this.currentIndex++;
        obj[key] = this.decodeObject(depth + 2);
      } else {
        obj[key] = this.parsePrimitiveValue(valuePart);
        this.currentIndex++;
      }
    }

    return obj;
  }

  /**
   * Check if a line contains an array header
   */
  private isArrayHeader(content: string): boolean {
    return /\[[0-9]+[\t|]?\]/.test(content);
  }

  /**
   * Parse an array header
   */
  private parseArrayHeader(content: string): ArrayHeader {
    let key: string | undefined;
    
    // Check if there's a key before the bracket
    const bracketIndex = content.indexOf('[');
    if (bracketIndex > 0) {
      const keyPart = content.substring(0, bracketIndex).trim();
      key = this.parseKey(keyPart);
    }

    // Extract bracket content
    const bracketMatch = content.match(/\[([0-9]+)([\t|])?\]/);
    if (!bracketMatch) {
      throw new Error(`Invalid array header: ${content}`);
    }

    const length = parseInt(bracketMatch[1], 10);
    const delimiterSymbol = bracketMatch[2] || '';
    const delimiter = detectDelimiter(bracketMatch[1] + delimiterSymbol);

    // Check for fields (tabular format)
    let fields: string[] | undefined;
    let isTabular = false;
    
    const afterBracket = content.substring(bracketMatch.index! + bracketMatch[0].length);
    const fieldsMatch = afterBracket.match(/^\{([^}]+)\}/);
    
    if (fieldsMatch) {
      const fieldsStr = fieldsMatch[1];
      fields = parseDelimitedValues(fieldsStr, delimiter).map((f) => this.parseKey(f));
      isTabular = true;
    }

    return {
      key,
      length,
      delimiter,
      fields,
      isTabular,
    };
  }

  /**
   * Parse a key (handle quoted keys)
   */
  private parseKey(keyStr: string): string {
    const trimmed = keyStr.trim();
    
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      const content = trimmed.slice(1, -1);
      return unescapeString(content);
    }
    
    return trimmed;
  }

  /**
   * Parse a primitive value
   */
  private parsePrimitiveValue(value: string): string | number | boolean | null {
    return parsePrimitive(value, this.preserveNumbers, this.preserveBooleans);
  }

  /**
   * Decode a multiline string (pipe syntax)
   */
  private decodeMultilineString(depth: number): string {
    const lines: string[] = [];

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      
      if (line.isBlank) {
        this.currentIndex++;
        continue;
      }

      const actualDepth = this.calculateDepth(line);
      
      if (actualDepth < depth) {
        break;
      }
      
      if (actualDepth === depth) {
        lines.push(line.content.trim());
        this.currentIndex++;
      } else {
        this.currentIndex++;
      }
    }

    return lines.join('\n');
  }

  /**
   * Find the first unquoted colon in a string
   */
  private findUnquotedColon(str: string): number {
    let inQuotes = false;
    let i = 0;

    while (i < str.length) {
      if (str[i] === '"') {
        inQuotes = !inQuotes;
      } else if (str[i] === '\\' && inQuotes && i + 1 < str.length) {
        i++; // Skip next character
      } else if (str[i] === ':' && !inQuotes) {
        return i;
      }
      i++;
    }

    return -1;
  }

  /**
   * Calculate the actual depth of a line
   */
  private calculateDepth(line: ParsedLine): number {
    const leadingSpaces = line.content.length - line.content.trimStart().length;
    return this.indentSize > 0 ? Math.floor(leadingSpaces / this.indentSize) : 0;
  }

  /**
   * Expand dotted paths in an object (for key folding)
   */
  private expandPathsInObject(obj: JsonObject): JsonObject {
    const result: JsonObject = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key.includes('.')) {
        // Expand the path
        const parts = key.split('.').map((part) => {
          // Handle quoted parts
          if (part.startsWith('"') && part.endsWith('"')) {
            return unescapeString(part.slice(1, -1));
          }
          return part;
        });

        let current: JsonObject = result;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!(part in current)) {
            current[part] = {};
          }
          
          if (typeof current[part] !== 'object' || current[part] === null || Array.isArray(current[part])) {
            if (this.strict) {
              throw new Error(`Path expansion conflict at '${parts.slice(0, i + 1).join('.')}'`);
            }
            // In non-strict mode, overwrite with object
            current[part] = {};
          }
          
          current = current[part] as JsonObject;
        }

        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}

/**
 * Convenience function to decode TOON to JSON
 */
export function decode(toon: string, options?: ToonDecodeOptions): JsonValue {
  const decoder = new ToonDecoder(options);
  return decoder.decode(toon);
}
