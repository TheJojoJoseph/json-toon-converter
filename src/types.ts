/**
 * Core type definitions for TOON format converter
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

/**
 * Delimiter options for TOON format
 */
export type ToonDelimiter = ',' | '\t' | '|';

/**
 * Options for encoding JSON to TOON
 */
export interface ToonEncodeOptions {
  /** Number of spaces for indentation (default: 2) */
  indent?: number;
  /** Default delimiter for arrays (default: ',') */
  delimiter?: ToonDelimiter;
  /** Enable key folding for nested objects (default: false) */
  enableKeyFolding?: boolean;
  /** Maximum depth for key folding (default: Infinity) */
  flattenDepth?: number;
}

/**
 * Options for decoding TOON to JSON
 */
export interface ToonDecodeOptions {
  /** Parse numbers as numbers instead of strings (default: true) */
  preserveNumbers?: boolean;
  /** Parse booleans as booleans instead of strings (default: true) */
  preserveBooleans?: boolean;
  /** Enable path expansion for folded keys (default: false) */
  expandPaths?: boolean | 'safe';
  /** Throw errors on invalid TOON (default: true) */
  strict?: boolean;
}

/**
 * Parsed array header information
 */
export interface ArrayHeader {
  key?: string;
  length: number;
  delimiter: ToonDelimiter;
  fields?: string[];
  isTabular: boolean;
}

/**
 * Internal line representation during parsing
 */
export interface ParsedLine {
  content: string;
  depth: number;
  lineNumber: number;
  isBlank: boolean;
}
