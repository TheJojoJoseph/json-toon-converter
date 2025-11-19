/**
 * TOON Encoder - Converts JSON to TOON format
 */

import {
  JsonValue,
  JsonObject,
  JsonArray,
  ToonEncodeOptions,
  ToonDelimiter,
} from './types';
import {
  quoteString,
  quoteKey,
  isUniformArray,
  areAllPrimitives,
  areAllValuesPrimitive,
  getDelimiterSymbol,
  normalizeNumber,
  isMultiline,
  formatMultilineString,
  escapeString,
} from './utils';

export class ToonEncoder {
  private indent: number;
  private delimiter: ToonDelimiter;
  private enableKeyFolding: boolean;
  private flattenDepth: number;

  constructor(options: ToonEncodeOptions = {}) {
    this.indent = options.indent ?? 2;
    this.delimiter = options.delimiter ?? ',';
    this.enableKeyFolding = options.enableKeyFolding ?? true;
    this.flattenDepth = options.flattenDepth ?? Infinity;
  }

  /**
   * Encode a JSON value to TOON format
   */
  encode(value: JsonValue): string {
    const lines = this.encodeValue(value, 0, '');
    return lines.join('\n');
  }

  /**
   * Encode a value at a specific depth
   */
  private encodeValue(
    value: JsonValue,
    depth: number,
    key: string = ''
  ): string[] {
    if (value === null) {
      return [this.makeLine(depth, key, 'null')];
    }

    if (typeof value === 'boolean') {
      return [this.makeLine(depth, key, value.toString())];
    }

    if (typeof value === 'number') {
      const normalized = normalizeNumber(value);
      return [this.makeLine(depth, key, normalized.toString())];
    }

    if (typeof value === 'string') {
      // Check if it's a multiline string with 3+ lines
      if (isMultiline(value)) {
        const lineCount = value.split('\n').length;
        if (lineCount >= 3) {
          const lines: string[] = [];
          const header = key ? `${quoteKey(key)}: |` : '|';
          lines.push(this.makeIndent(depth) + header);
          lines.push(...formatMultilineString(value, depth, this.indent));
          return lines;
        }
      }
      return [this.makeLine(depth, key, quoteString(value, this.delimiter))];
    }

    if (Array.isArray(value)) {
      return this.encodeArray(value, depth, key);
    }

    if (typeof value === 'object') {
      return this.encodeObject(value as JsonObject, depth, key);
    }

    throw new Error(`Unsupported value type: ${typeof value}`);
  }

  /**
   * Encode an object
   */
  private encodeObject(
    obj: JsonObject,
    depth: number,
    key: string = ''
  ): string[] {
    const lines: string[] = [];
    const entries = Object.entries(obj);

    // Empty object
    if (entries.length === 0) {
      if (key) {
        lines.push(this.makeIndent(depth) + quoteKey(key) + ': {}');
      } else {
        lines.push(this.makeIndent(depth) + '{}');
      }
      return lines;
    }

    // Check if we can use key folding
    if (this.enableKeyFolding && this.canFold(obj, 0)) {
      return this.encodeFoldedObject(obj, depth, key);
    }

    // Add key header if this is a nested object
    if (key) {
      lines.push(this.makeIndent(depth) + quoteKey(key) + ':');
      depth++;
    }

    // Encode each property
    for (const [k, v] of entries) {
      lines.push(...this.encodeValue(v, depth, k));
    }

    return lines;
  }

  /**
   * Check if an object can be folded
   */
  private canFold(obj: JsonObject, currentDepth: number): boolean {
    if (currentDepth >= this.flattenDepth) return false;

    const entries = Object.entries(obj);
    if (entries.length !== 1) return false;

    const [, value] = entries[0];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Don't fold if the nested object is empty
      if (Object.keys(value).length === 0) return false;
      return true;
    }

    return false;
  }

  /**
   * Encode an object with key folding
   */
  private encodeFoldedObject(
    obj: JsonObject,
    depth: number,
    parentKey: string = ''
  ): string[] {
    const lines: string[] = [];
    let currentObj = obj;
    const path: string[] = parentKey ? [parentKey] : [];
    let currentDepth = 0;

    // Fold as deep as possible
    while (this.canFold(currentObj, currentDepth)) {
      const [key, value] = Object.entries(currentObj)[0];
      path.push(key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        currentObj = value as JsonObject;
        currentDepth++;
      } else {
        break;
      }
    }

    // Now encode the final value
    const entries = Object.entries(currentObj);
    if (entries.length === 0) {
      // Empty object - don't fold
      if (parentKey) {
        lines.push(this.makeIndent(depth) + quoteKey(parentKey) + ': {}');
      } else {
        lines.push(this.makeIndent(depth) + '{}');
      }
      return lines;
    }
    
    // Check if we have a single key with an array value - continue folding
    if (entries.length === 1) {
      const [finalKey, finalValue] = entries[0];
      const fullPath = [...path, finalKey].map(quoteKey).join('.');
      lines.push(...this.encodeValue(finalValue, depth, fullPath));
    } else {
      // Multiple keys - encode normally
      if (path.length > (parentKey ? 1 : 0)) {
        // We folded at least one level
        const fullPath = path.map(quoteKey).join('.');
        lines.push(this.makeIndent(depth) + fullPath + ':');
        for (const [k, v] of entries) {
          lines.push(...this.encodeValue(v, depth + 1, k));
        }
      } else {
        // No folding happened
        lines.push(...this.encodeValue(currentObj, depth, parentKey));
      }
    }

    return lines;
  }

  /**
   * Encode an array
   */
  private encodeArray(
    arr: JsonArray,
    depth: number,
    key: string = ''
  ): string[] {
    const lines: string[] = [];
    const length = arr.length;

    // Empty array - use compact syntax
    if (length === 0) {
      const delimSymbol = getDelimiterSymbol(this.delimiter);
      if (key) {
        lines.push(this.makeIndent(depth) + quoteKey(key) + `[0${delimSymbol}]:`);
      } else {
        lines.push(this.makeIndent(depth) + `[0${delimSymbol}]:`);
      }
      return lines;
    }

    // Primitive array (inline)
    if (areAllPrimitives(arr)) {
      return this.encodePrimitiveArray(arr, depth, key);
    }

    // Uniform array of objects (tabular)
    if (this.isTabularArray(arr)) {
      return this.encodeTabularArray(arr, depth, key);
    }

    // Mixed or non-uniform array (list format)
    return this.encodeListArray(arr, depth, key);
  }

  /**
   * Check if a primitive array has mixed types
   */
  private hasMixedPrimitiveTypes(arr: JsonArray): boolean {
    if (arr.length === 0) return false;
    
    const types = new Set(arr.map(v => {
      if (v === null) return 'null';
      return typeof v;
    }));
    
    return types.size > 1;
  }

  /**
   * Check if a list array has mixed types (primitives and objects/arrays)
   */
  private hasListMixedTypes(arr: JsonArray): boolean {
    if (arr.length === 0) return false;
    
    let hasPrimitives = false;
    let hasComplex = false;
    
    for (const item of arr) {
      if (item === null || typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
        hasPrimitives = true;
      } else {
        hasComplex = true;
      }
      
      if (hasPrimitives && hasComplex) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check if an array can be encoded in tabular format
   */
  private isTabularArray(arr: JsonArray): boolean {
    if (arr.length === 0) return false;
    if (!arr.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item))) {
      return false;
    }
    
    // Check if all objects have the same keys and all values are primitives
    if (!isUniformArray(arr)) return false;
    
    return arr.every((item) => 
      typeof item === 'object' && item !== null && !Array.isArray(item) && 
      areAllValuesPrimitive(item as Record<string, unknown>)
    );
  }

  /**
   * Encode a primitive array
   */
  private encodePrimitiveArray(
    arr: JsonArray,
    depth: number,
    key: string = ''
  ): string[] {
    const delimSymbol = getDelimiterSymbol(this.delimiter);
    const header = key
      ? `${quoteKey(key)}[${arr.length}${delimSymbol}]:`
      : `[${arr.length}${delimSymbol}]:`;

    // Check if array has mixed types
    const hasMixedTypes = this.hasMixedPrimitiveTypes(arr);

    const values = arr.map((v) => {
      if (v === null) return 'null';
      if (typeof v === 'boolean') return v.toString();
      if (typeof v === 'number') return normalizeNumber(v).toString();
      // Quote strings if array has mixed types, otherwise use quoteString logic
      if (hasMixedTypes) {
        return `"${escapeString(v as string)}"`;
      }
      return quoteString(v as string, this.delimiter);
    });

    const line = this.makeIndent(depth) + header + ' ' + values.join(this.delimiter);
    return [line];
  }

  /**
   * Encode a tabular array
   */
  private encodeTabularArray(
    arr: JsonArray,
    depth: number,
    key: string = ''
  ): string[] {
    const lines: string[] = [];
    const length = arr.length;
    
    // Get field names from first object
    const firstObj = arr[0] as JsonObject;
    const fields = Object.keys(firstObj);
    
    // Build header
    const delimSymbol = getDelimiterSymbol(this.delimiter);
    const fieldsStr = fields.map(quoteKey).join(this.delimiter);
    const header = key
      ? `${quoteKey(key)}[${length}${delimSymbol}]{${fieldsStr}}:`
      : `[${length}${delimSymbol}]{${fieldsStr}}:`;
    
    lines.push(this.makeIndent(depth) + header);
    
    // Encode each row
    for (const item of arr) {
      const obj = item as JsonObject;
      const values = fields.map((field) => {
        const val = obj[field];
        if (val === null) return 'null';
        if (typeof val === 'boolean') return val.toString();
        if (typeof val === 'number') return normalizeNumber(val).toString();
        return quoteString(val as string, this.delimiter);
      });
      
      lines.push(this.makeIndent(depth + 1) + values.join(this.delimiter));
    }
    
    return lines;
  }

  /**
   * Encode a mixed/non-uniform array (list format)
   */
  private encodeListArray(
    arr: JsonArray,
    depth: number,
    key: string = ''
  ): string[] {
    const lines: string[] = [];
    
    // Add array header (without count for list arrays)
    const header = key ? `${quoteKey(key)}:` : ':';
    lines.push(this.makeIndent(depth) + header);
    
    // Check if array has mixed types (primitives and objects/arrays)
    const hasMixedTypes = this.hasListMixedTypes(arr);
    
    // Encode each item
    for (const item of arr) {
      if (item === null || typeof item === 'boolean' || typeof item === 'number' || typeof item === 'string') {
        // Primitive item
        let value: string;
        if (item === null) value = 'null';
        else if (typeof item === 'boolean') value = item.toString();
        else if (typeof item === 'number') value = normalizeNumber(item).toString();
        // Quote strings if array has mixed types (primitives and objects/arrays) for disambiguation
        else if (hasMixedTypes) value = `"${escapeString(item)}"`;
        else value = quoteString(item, this.delimiter);
        
        lines.push(this.makeIndent(depth + 1) + '- ' + value);
      } else if (Array.isArray(item)) {
        // Array item
        if (areAllPrimitives(item)) {
          // Inline primitive array - check if it has mixed types
          const itemHasMixedTypes = this.hasMixedPrimitiveTypes(item);
          const values = item.map((v) => {
            if (v === null) return 'null';
            if (typeof v === 'boolean') return v.toString();
            if (typeof v === 'number') return normalizeNumber(v).toString();
            // Quote strings if nested array has mixed types
            if (itemHasMixedTypes) {
              return `"${escapeString(v as string)}"`;
            }
            return quoteString(v as string, this.delimiter);
          });
          lines.push(this.makeIndent(depth + 1) + '- [' + values.join(this.delimiter) + ']');
        } else {
          // Complex array
          const itemLines = this.encodeArray(item, depth + 1, '');
          if (itemLines.length > 0) {
            // Prefix first line with hyphen
            const firstLine = itemLines[0].trim();
            lines.push(this.makeIndent(depth + 1) + '- ' + firstLine);
            // Add remaining lines
            for (let i = 1; i < itemLines.length; i++) {
              lines.push(itemLines[i]);
            }
          }
        }
      } else {
        // Object item
        const obj = item as JsonObject;
        const entries = Object.entries(obj);
        
        if (entries.length === 0) {
          lines.push(this.makeIndent(depth + 1) + '-');
        } else {
          // First field on hyphen line
          const [firstKey, firstValue] = entries[0];
          
          if (typeof firstValue === 'object' && firstValue !== null) {
            // First field is nested
            lines.push(this.makeIndent(depth + 1) + '- ' + quoteKey(firstKey) + ':');
            lines.push(...this.encodeValue(firstValue, depth + 2, ''));
          } else {
            // First field is primitive
            const valueLines = this.encodeValue(firstValue, 0, firstKey);
            const valueLine = valueLines[0].trim();
            lines.push(this.makeIndent(depth + 1) + '- ' + valueLine);
          }
          
          // Remaining fields
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            lines.push(...this.encodeValue(v, depth + 2, k));
          }
        }
      }
    }
    
    return lines;
  }

  /**
   * Create a line with key and value
   */
  private makeLine(depth: number, key: string, value: string): string {
    const indent = this.makeIndent(depth);
    if (key) {
      return `${indent}${quoteKey(key)}: ${value}`;
    }
    return `${indent}${value}`;
  }

  /**
   * Create indentation string
   */
  private makeIndent(depth: number): string {
    return ' '.repeat(depth * this.indent);
  }
}

/**
 * Convenience function to encode JSON to TOON
 */
export function encode(value: JsonValue, options?: ToonEncodeOptions): string {
  const encoder = new ToonEncoder(options);
  return encoder.encode(value);
}
