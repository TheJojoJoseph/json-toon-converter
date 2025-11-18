/**
 * Options for encoding JSON to TOON format
 */
export interface ToonEncodeOptions {
  /** Number of spaces for indentation (default: 2) */
  indent?: number;
  /** Whether to align table columns (default: true) */
  alignColumns?: boolean;
  /** Minimum column width for table formatting (default: 1) */
  minColumnWidth?: number;
  /** Use compact space-separated format for simple arrays (default: false) */
  compactArrays?: boolean;
}

/**
 * Options for decoding TOON to JSON format
 */
export interface ToonDecodeOptions {
  /** Whether to preserve number types (default: true) */
  preserveNumbers?: boolean;
  /** Whether to preserve boolean types (default: true) */
  preserveBooleans?: boolean;
}

/**
 * Represents a JSON value type
 */
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

/**
 * Represents a JSON object
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Represents a JSON array
 */
export type JsonArray = JsonValue[];
