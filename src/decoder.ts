import { ToonDecodeOptions, JsonValue, JsonObject, JsonArray } from './types';

/**
 * Decodes TOON format to JSON
 */
export class ToonDecoder {
  private options: Required<ToonDecodeOptions>;
  private lines: string[];
  private currentIndex: number;

  constructor(options: ToonDecodeOptions = {}) {
    this.options = {
      preserveNumbers: options.preserveNumbers ?? true,
      preserveBooleans: options.preserveBooleans ?? true,
    };
    this.lines = [];
    this.currentIndex = 0;
  }

  /**
   * Decode TOON format to JSON
   */
  decode(toon: string): JsonValue {
    // Keep all lines but filter empty ones for processing
    const allLines = toon.split('\n');
    this.lines = allLines.filter(line => line.trim() !== '');
    this.currentIndex = 0;
    
    if (this.lines.length === 0) {
      return null;
    }

    // Handle special cases
    const firstLine = this.lines[0].trim();
    if (firstLine === '{}') {
      return {};
    }
    if (firstLine === '[]') {
      return [];
    }

    // Check if it's a root-level table (array)
    if (this.isTableHeader(0)) {
      return this.parseTable(this.getIndent(this.lines[0]));
    }

    // Check if it's a root-level object (indented content)
    const firstIndent = this.getIndent(this.lines[0]);
    if (firstIndent > 0) {
      return this.parseObject(-2);
    }

    // Single primitive value
    return this.parsePrimitive(firstLine);
  }

  private parseObject(baseIndent: number): JsonObject {
    const obj: JsonObject = {};
    
    // Determine the expected child indentation
    // If baseIndent is -2 (root level), children should be at indent 0 or more
    // Otherwise, children should be at baseIndent + 2
    const expectedChildIndent = baseIndent < 0 ? 0 : baseIndent + 2;

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      const indent = this.getIndent(line);
      const content = line.trim();

      // End of object - line at same or lower indentation than base
      if (baseIndent >= 0 && indent <= baseIndent) {
        break;
      }

      // For root-level objects (baseIndent < 0), we need to check if we're still at the right level
      if (baseIndent < 0) {
        // All lines should have some indentation for root object
        if (indent < 2) {
          break;
        }
        // If this is the first property, set the expected indent
        if (Object.keys(obj).length === 0) {
          // Use the actual indent of the first line
        } else {
          // Check if we've moved to a different indent level (sibling ended)
          const firstKey = Object.keys(obj)[0];
          if (firstKey && indent < 2) {
            break;
          }
        }
      }

      // Skip if not at the right indentation level for this object's children
      if (baseIndent >= 0 && indent !== expectedChildIndent) {
        break;
      }

      // Check if it's a key-value pair on the same line
      const spaceIndex = content.indexOf(' ');
      if (spaceIndex > 0 && !this.isTableHeader(this.currentIndex)) {
        const key = content.substring(0, spaceIndex);
        const value = content.substring(spaceIndex + 1).trim();
        obj[key] = this.parsePrimitive(value);
        this.currentIndex++;
        continue;
      }

      // Key with value on next line(s)
      const key = content;
      this.currentIndex++;

      if (this.currentIndex >= this.lines.length) {
        obj[key] = null;
        break;
      }

      const nextLine = this.lines[this.currentIndex];
      const nextIndent = this.getIndent(nextLine);

      // Check if it's a table
      if (this.isTableHeader(this.currentIndex)) {
        obj[key] = this.parseTable(nextIndent);
      } else if (nextIndent > indent) {
        const nextContent = nextLine.trim();
        // Check if it's a list (starts with -)
        if (nextContent.startsWith('- ')) {
          obj[key] = this.parseList(nextIndent);
        } else {
          // Nested object
          obj[key] = this.parseObject(indent);
        }
      } else if (nextIndent === indent) {
        // Value on same line as key (space-separated array or single value)
        const parts = content.split(/\s+/);
        if (parts.length > 1) {
          // Space-separated array
          obj[key] = parts.slice(1).map(v => this.parsePrimitive(v));
        } else {
          obj[key] = null;
        }
        this.currentIndex++;
      } else {
        // No value, it's just a key - shouldn't happen in valid TOON
        obj[key] = null;
      }
    }

    return obj;
  }

  private parseList(baseIndent: number): JsonArray {
    const result: JsonArray = [];

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      const indent = this.getIndent(line);
      const content = line.trim();

      // End of list
      if (indent < baseIndent) {
        break;
      }

      if (indent === baseIndent && content.startsWith('- ')) {
        const value = content.substring(2).trim();
        result.push(this.parsePrimitive(value));
        this.currentIndex++;
      } else {
        break;
      }
    }

    return result;
  }

  private parseTable(baseIndent: number): JsonArray {
    const result: JsonArray = [];

    // Parse header
    const headerLine = this.lines[this.currentIndex];
    const headers = this.parseTableRow(headerLine);
    this.currentIndex++;

    // Parse data rows
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      const indent = this.getIndent(line);

      // End of table
      if (indent < baseIndent) {
        break;
      }

      if (indent === baseIndent) {
        const values = this.parseTableRow(line);
        const obj: JsonObject = {};

        for (let i = 0; i < headers.length; i++) {
          obj[headers[i]] = i < values.length ? this.parsePrimitive(values[i]) : null;
        }

        result.push(obj);
        this.currentIndex++;
      } else {
        break;
      }
    }

    return result;
  }

  private parseTableRow(line: string): string[] {
    const content = line.trim();
    // Split by 2 or more spaces to handle aligned columns
    return content.split(/\s{2,}/).map((s) => s.trim());
  }

  private isTableHeader(index: number): boolean {
    if (index >= this.lines.length || index + 1 >= this.lines.length) {
      return false;
    }

    const currentLine = this.lines[index];
    const nextLine = this.lines[index + 1];

    const currentIndent = this.getIndent(currentLine);
    const nextIndent = this.getIndent(nextLine);

    // Both lines should have the same indentation
    if (currentIndent !== nextIndent) {
      return false;
    }

    const currentContent = currentLine.trim();
    const nextContent = nextLine.trim();

    // Both should have content
    if (!currentContent || !nextContent) {
      return false;
    }

    // Check if both lines have multiple columns (2+ spaces separator)
    const currentCols = currentContent.split(/\s{2,}/).length;
    const nextCols = nextContent.split(/\s{2,}/).length;

    return currentCols > 1 && currentCols === nextCols;
  }

  private parsePrimitive(value: string): JsonValue {
    const trimmed = value.trim();

    // Handle quoted strings
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed.slice(1, -1);
      }
    }

    // Handle null
    if (trimmed === 'null') {
      return null;
    }

    // Handle booleans
    if (this.options.preserveBooleans) {
      if (trimmed === 'true') return true;
      if (trimmed === 'false') return false;
    }

    // Handle numbers
    if (this.options.preserveNumbers && !isNaN(Number(trimmed)) && trimmed !== '') {
      return Number(trimmed);
    }

    return trimmed;
  }

  private getIndent(line: string): number {
    let count = 0;
    for (const char of line) {
      if (char === ' ') {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
}

/**
 * Convenience function to decode TOON to JSON
 */
export function toonToJson(toon: string, options?: ToonDecodeOptions): JsonValue {
  const decoder = new ToonDecoder(options);
  return decoder.decode(toon);
}
