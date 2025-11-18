import { ToonEncodeOptions, JsonValue, JsonObject, JsonArray } from './types';

/**
 * Encodes a JSON value to TOON format
 */
export class ToonEncoder {
  private options: Required<ToonEncodeOptions>;

  constructor(options: ToonEncodeOptions = {}) {
    this.options = {
      indent: options.indent ?? 2,
      alignColumns: options.alignColumns ?? true,
      minColumnWidth: options.minColumnWidth ?? 1,
      compactArrays: options.compactArrays ?? false,
    };
  }

  /**
   * Encode JSON to TOON format
   */
  encode(data: JsonValue): string {
    return this.encodeValue(data, 0);
  }

  private encodeValue(value: JsonValue, depth: number): string {
    if (value === null) {
      return 'null';
    }

    if (typeof value === 'string') {
      return this.encodeString(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return this.encodeArray(value, depth);
    }

    if (typeof value === 'object') {
      return this.encodeObject(value as JsonObject, depth);
    }

    return String(value);
  }

  private encodeString(str: string): string {
    // If string contains spaces, newlines, or special chars, keep it quoted
    if (
      str.includes(' ') ||
      str.includes('\n') ||
      str.includes('\t') ||
      str === '' ||
      str === 'null' ||
      str === 'true' ||
      str === 'false' ||
      !isNaN(Number(str))
    ) {
      return JSON.stringify(str);
    }
    return str;
  }

  private encodeObject(obj: JsonObject, depth: number): string {
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return '{}';
    }

    const childIndent = ' '.repeat((depth + 1) * this.options.indent);

    const lines: string[] = [];

    for (const [key, value] of entries) {
      if (Array.isArray(value) && this.isUniformArray(value)) {
        // Handle uniform arrays as tables
        lines.push(`${childIndent}${key}`);
        lines.push(this.encodeTableArray(value, depth + 1));
      } else if (Array.isArray(value)) {
        // Handle non-uniform arrays
        lines.push(`${childIndent}${key}`);
        lines.push(this.encodeArray(value, depth + 1));
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        lines.push(`${childIndent}${key}`);
        lines.push(this.encodeObject(value as JsonObject, depth + 1));
      } else {
        // Handle primitives
        lines.push(`${childIndent}${key} ${this.encodeValue(value, depth + 1)}`);
      }
    }

    return lines.join('\n');
  }

  private encodeArray(arr: JsonArray, depth: number): string {
    if (arr.length === 0) {
      return '[]';
    }

    // Check if it's a uniform array of objects (table format)
    if (this.isUniformArray(arr)) {
      return this.encodeTableArray(arr, depth);
    }

    // Check if we can use compact format for simple primitives
    if (this.options.compactArrays && this.isSimplePrimitiveArray(arr)) {
      return arr.map(item => this.encodeValue(item, 0)).join(' ');
    }

    // Non-uniform array - encode each item on its own line
    const childIndent = ' '.repeat((depth + 1) * this.options.indent);
    const lines: string[] = [];

    for (const item of arr) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        lines.push(this.encodeObject(item as JsonObject, depth + 1));
      } else if (Array.isArray(item)) {
        lines.push(this.encodeArray(item, depth + 1));
      } else {
        lines.push(`${childIndent}- ${this.encodeValue(item, depth + 1)}`);
      }
    }

    return lines.join('\n');
  }

  private isSimplePrimitiveArray(arr: JsonArray): boolean {
    return arr.every(item => {
      if (item === null || typeof item === 'boolean' || typeof item === 'number') {
        return true;
      }
      if (typeof item === 'string') {
        // Only simple strings without spaces or special characters
        return !item.includes(' ') && !item.includes('\n') && !item.includes('\t');
      }
      return false;
    });
  }

  private isUniformArray(arr: JsonArray): boolean {
    if (arr.length === 0) return false;

    // Check if all items are objects
    const allObjects = arr.every(
      (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
    );

    if (!allObjects) return false;

    // Check if all objects have the same keys
    const firstKeys = Object.keys(arr[0] as JsonObject).sort();
    return arr.every((item) => {
      const keys = Object.keys(item as JsonObject).sort();
      return keys.length === firstKeys.length && keys.every((k, i) => k === firstKeys[i]);
    });
  }

  private encodeTableArray(arr: JsonArray, depth: number): string {
    if (arr.length === 0) return '[]';

    const objects = arr as JsonObject[];
    const keys = Object.keys(objects[0]);
    const childIndent = ' '.repeat((depth + 1) * this.options.indent);

    // Calculate column widths
    const columnWidths = keys.map((key) => {
      const maxValueWidth = Math.max(
        ...objects.map((obj) => String(this.encodeValue(obj[key], 0)).length)
      );
      return Math.max(key.length, maxValueWidth, this.options.minColumnWidth);
    });

    const lines: string[] = [];

    // Header row
    const header = keys
      .map((key, i) =>
        this.options.alignColumns ? key.padEnd(columnWidths[i]) : key
      )
      .join('  ');
    lines.push(`${childIndent}${header}`);

    // Data rows
    for (const obj of objects) {
      const row = keys
        .map((key, i) => {
          const value = this.encodeValue(obj[key], 0);
          return this.options.alignColumns ? value.padEnd(columnWidths[i]) : value;
        })
        .join('  ');
      lines.push(`${childIndent}${row}`);
    }

    return lines.join('\n');
  }
}

/**
 * Convenience function to encode JSON to TOON
 */
export function jsonToToon(data: JsonValue, options?: ToonEncodeOptions): string {
  const encoder = new ToonEncoder(options);
  return encoder.encode(data);
}
