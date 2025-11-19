/**
 * @toon/toon2json - JSON to TOON converter
 * 
 * A lightweight library for converting between JSON and TOON (Token-Oriented Object Notation) formats.
 * TOON is optimized for LLM token usage while maintaining human readability.
 */

// Export types
export type {
  JsonValue,
  JsonObject,
  JsonArray,
  JsonPrimitive,
  ToonEncodeOptions,
  ToonDecodeOptions,
  ToonDelimiter,
  ArrayHeader,
  ParsedLine,
} from './types';

// Export encoder
export { ToonEncoder, encode } from './encoder';

// Export decoder
export { ToonDecoder, decode } from './decoder';

// Export utilities
export {
  needsQuoting,
  escapeString,
  unescapeString,
  quoteString,
  quoteKey,
  parsePrimitive,
  parseDelimitedValues,
  isUniformArray,
  areAllPrimitives,
  areAllValuesPrimitive,
} from './utils';

// Convenience functions
import { encode, ToonEncoder as Encoder } from './encoder';
import { decode, ToonDecoder as Decoder } from './decoder';
import { JsonValue, ToonEncodeOptions, ToonDecodeOptions } from './types';

/**
 * Convert JSON to TOON format
 * @param data - JSON data to convert
 * @param options - Encoding options
 * @returns TOON formatted string
 */
export function jsonToToon(data: JsonValue, options?: ToonEncodeOptions): string {
  return encode(data, options);
}

/**
 * Convert TOON format to JSON
 * @param toon - TOON formatted string
 * @param options - Decoding options
 * @returns Parsed JSON data
 */
export function toonToJson(toon: string, options?: ToonDecodeOptions): JsonValue {
  return decode(toon, options);
}

/**
 * ToonConverter class with static methods for convenience
 */
export class ToonConverter {
  /**
   * Convert JSON to TOON format
   */
  static toToon(data: JsonValue, options?: ToonEncodeOptions): string {
    return encode(data, options);
  }

  /**
   * Convert TOON format to JSON
   */
  static toJson(toon: string, options?: ToonDecodeOptions): JsonValue {
    return decode(toon, options);
  }

  /**
   * Check if a string is valid TOON format
   */
  static isValid(toon: string): boolean {
    try {
      decode(toon, { strict: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate TOON format and return errors if any
   */
  static validate(toon: string): { valid: boolean; error?: string } {
    try {
      decode(toon, { strict: true });
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// Default export
export default {
  jsonToToon,
  toonToJson,
  ToonConverter,
  ToonEncoder: Encoder,
  ToonDecoder: Decoder,
  encode,
  decode,
};
