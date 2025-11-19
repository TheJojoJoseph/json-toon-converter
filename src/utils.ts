/**
 * Utility functions for TOON format processing
 */

import { ToonDelimiter } from './types';

/**
 * Check if a string needs quoting in TOON format
 */
export function needsQuoting(str: string, delimiter: ToonDelimiter = ','): boolean {
  if (str === '') return true;
  
  // Check for special characters that require quoting
  if (str.includes(delimiter)) return true;
  if (str.includes('"')) return true;
  if (str.includes('\\')) return true;
  if (str.includes('\n')) return true;
  if (str.includes('\r')) return true;
  if (str.includes('\t') && delimiter !== '\t') return true;
  if (str.includes(':')) return true;
  if (str.includes('{')) return true;
  if (str.includes('}')) return true;
  if (str.includes('[')) return true;
  if (str.includes(']')) return true;
  if (str.includes('-') && str.startsWith('-')) return true;
  
  // Check if it looks like a number, boolean, or null
  if (str === 'true' || str === 'false' || str === 'null') return true;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(str)) return true;
  
  // Check for leading/trailing whitespace
  if (str !== str.trim()) return true;
  
  return false;
}

/**
 * Escape a string for TOON format
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Unescape a TOON string
 */
export function unescapeString(str: string): string {
  let result = '';
  let i = 0;
  
  while (i < str.length) {
    if (str[i] === '\\' && i + 1 < str.length) {
      const next = str[i + 1];
      switch (next) {
        case '\\':
          result += '\\';
          break;
        case '"':
          result += '"';
          break;
        case 'n':
          result += '\n';
          break;
        case 'r':
          result += '\r';
          break;
        case 't':
          result += '\t';
          break;
        default:
          throw new Error(`Invalid escape sequence: \\${next}`);
      }
      i += 2;
    } else {
      result += str[i];
      i++;
    }
  }
  
  return result;
}

/**
 * Quote a string for TOON format if needed
 */
export function quoteString(str: string, delimiter: ToonDelimiter = ','): string {
  if (needsQuoting(str, delimiter)) {
    return `"${escapeString(str)}"`;
  }
  return str;
}

/**
 * Check if a key needs quoting
 */
export function needsKeyQuoting(key: string): boolean {
  // Keys need quoting if they contain special characters
  if (key.includes(':')) return true;
  if (key.includes('[')) return true;
  if (key.includes('{')) return true;
  if (key.includes('"')) return true;
  if (key.includes('\\')) return true;
  if (key.includes('\n')) return true;
  if (key.includes('\r')) return true;
  if (key.includes('\t')) return true;
  if (key !== key.trim()) return true;
  if (key.startsWith('-')) return true;
  
  return false;
}

/**
 * Quote a key for TOON format if needed
 */
export function quoteKey(key: string): string {
  if (needsKeyQuoting(key)) {
    return `"${escapeString(key)}"`;
  }
  return key;
}

/**
 * Parse a primitive value from a string
 */
export function parsePrimitive(
  token: string,
  preserveNumbers: boolean = true,
  preserveBooleans: boolean = true
): string | number | boolean | null {
  const trimmed = token.trim();
  
  // Handle quoted strings
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    if (trimmed.length < 2) {
      throw new Error('Invalid quoted string');
    }
    const content = trimmed.slice(1, -1);
    return unescapeString(content);
  }
  
  // Handle booleans
  if (preserveBooleans) {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
  }
  
  // Handle null
  if (trimmed === 'null') return null;
  
  // Handle numbers
  if (preserveNumbers && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (isFinite(num)) {
      return num;
    }
  }
  
  // Return as string
  return trimmed;
}

/**
 * Parse delimited values from a string
 */
export function parseDelimitedValues(
  line: string,
  delimiter: ToonDelimiter = ','
): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
      i++;
    } else if (char === '\\' && inQuotes && i + 1 < line.length) {
      // Handle escape sequences inside quotes
      current += char + line[i + 1];
      i += 2;
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last value
  if (current || values.length > 0) {
    values.push(current.trim());
  }
  
  return values;
}

/**
 * Check if an array of objects is uniform (all have same keys)
 */
export function isUniformArray(arr: unknown[]): boolean {
  if (arr.length === 0) return false;
  
  const firstKeys = Object.keys(arr[0] || {}).sort();
  
  for (let i = 1; i < arr.length; i++) {
    const keys = Object.keys(arr[i] || {}).sort();
    if (keys.length !== firstKeys.length) return false;
    if (!keys.every((k, idx) => k === firstKeys[idx])) return false;
  }
  
  return true;
}

/**
 * Check if all values in an array are primitives
 */
export function areAllPrimitives(arr: unknown[]): boolean {
  return arr.every(
    (item) =>
      typeof item === 'string' ||
      typeof item === 'number' ||
      typeof item === 'boolean' ||
      item === null
  );
}

/**
 * Check if all values in an object are primitives
 */
export function areAllValuesPrimitive(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every(
    (val) =>
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean' ||
      val === null
  );
}

/**
 * Get the delimiter symbol for TOON format
 */
export function getDelimiterSymbol(delimiter: ToonDelimiter): string {
  switch (delimiter) {
    case '\t':
      return '\t';
    case '|':
      return '|';
    default:
      return '';
  }
}

/**
 * Detect delimiter from bracket notation
 */
export function detectDelimiter(bracketContent: string): ToonDelimiter {
  if (bracketContent.endsWith('\t')) return '\t';
  if (bracketContent.endsWith('|')) return '|';
  return ',';
}

/**
 * Normalize number to avoid -0 and use consistent representation
 */
export function normalizeNumber(num: number): number {
  if (Object.is(num, -0)) return 0;
  return num;
}

/**
 * Format number preserving original format (trailing zeros, scientific notation)
 */
export function formatNumber(num: number, originalStr?: string): string {
  // If we have the original string representation, use it
  if (originalStr !== undefined) {
    return originalStr;
  }
  
  // Otherwise convert to string
  const normalized = normalizeNumber(num);
  return normalized.toString();
}

/**
 * Check if a string contains multiline content
 */
export function isMultiline(str: string): boolean {
  return str.includes('\n');
}

/**
 * Format multiline string with pipe syntax
 */
export function formatMultilineString(str: string, depth: number, indent: number): string[] {
  const lines = str.split('\n');
  const indentStr = ' '.repeat((depth + 1) * indent);
  return lines.map(line => indentStr + line);
}
