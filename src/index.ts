/**
 * json-toon-converter
 * A lightweight library for converting between JSON and TOON (Token-Oriented Object Notation) formats
 */

export { ToonEncoder, jsonToToon } from './encoder';
export { ToonDecoder, toonToJson } from './decoder';
export type {
  ToonEncodeOptions,
  ToonDecodeOptions,
  JsonValue,
  JsonObject,
  JsonArray,
} from './types';

import { ToonEncoder } from './encoder';
import { ToonDecoder } from './decoder';
import { ToonEncodeOptions, ToonDecodeOptions, JsonValue } from './types';

/**
 * Main converter class with both encoding and decoding capabilities
 */
export class ToonConverter {
  /**
   * Convert JSON to TOON format
   */
  static toToon(data: JsonValue, options?: ToonEncodeOptions): string {
    const encoder = new ToonEncoder(options);
    return encoder.encode(data);
  }

  /**
   * Convert TOON to JSON format
   */
  static toJson(toon: string, options?: ToonDecodeOptions): JsonValue {
    const decoder = new ToonDecoder(options);
    return decoder.decode(toon);
  }
}
