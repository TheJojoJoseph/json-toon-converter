/**
 * Generated tests from test.yaml
 */

import { jsonToToon, toonToJson } from '../src/index';

describe('TOON Format Tests from test.yaml', () => {

  describe('Empty Structures', () => {
    const inputJson = "{ \"emptyObj\": {}, \"emptyArr\": [] }";
    const expectedToon = "emptyObj: {}\nemptyArr: []";

    test('encode: empty_structures', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: empty_structures', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: empty_structures', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Mixed Primitives Array', () => {
    const inputJson = "{ \"values\": [\"yes\", 10, true, null, 5.5] }";
    const expectedToon = "values[5]: \"yes\",10,true,null,5.5";

    test('encode: mixed_primitives_array', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: mixed_primitives_array', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: mixed_primitives_array', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Mixed Object Array', () => {
    const inputJson = "{\n  \"items\": [\n    \"red\",\n    { \"id\": 1, \"label\": \"blue\" },\n    42\n  ]\n}";
    const expectedToon = "items:\n  - \"red\"\n  - id: 1\n    label: blue\n  - 42";

    test('encode: mixed_object_array', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: mixed_object_array', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: mixed_object_array', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Special Chars', () => {
    const inputJson = "{\n  \"quote\": \"He said \\\"Hi\\\"\",\n  \"newline\": \"Line1\\nLine2\",\n  \"tab\": \"A\\tB\",\n  \"jsonChars\": \"{value}: [1,2]\"\n}";
    const expectedToon = "quote: \"He said \\\"Hi\\\"\"\nnewline: \"Line1\\nLine2\"\ntab: \"A\\tB\"\njsonChars: \"{value}: [1,2]\"";

    test('encode: special_chars', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: special_chars', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: special_chars', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Multiline String', () => {
    const inputJson = "{ \"bio\": \"Line1\\nLine2\\nLine3\" }";
    const expectedToon = "bio: |\n  Line1\n  Line2\n  Line3";

    test('encode: multiline_string', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: multiline_string', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: multiline_string', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Number Formats', () => {
    const inputJson = "{\n  \"neg\": -42,\n  \"floatNeg\": -12.50,\n  \"floatZero\": 10.000,\n  \"sci\": 9.9e-4\n}";
    const expectedToon = "neg: -42\nfloatNeg: -12.50\nfloatZero: 10.000\nsci: 9.9e-4";

    test('encode: number_formats', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: number_formats', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: number_formats', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Long Tabular Array', () => {
    const inputJson = "{\n  \"scores\": [\n    { \"id\": 1, \"score\": 10 },\n    { \"id\": 2, \"score\": 20 },\n    { \"id\": 3, \"score\": 30 },\n    { \"id\": 4, \"score\": 40 },\n    { \"id\": 5, \"score\": 50 }\n  ]\n}";
    const expectedToon = "scores[5]{id,score}:\n  1,10\n  2,20\n  3,30\n  4,40\n  5,50";

    test('encode: long_tabular_array', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: long_tabular_array', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: long_tabular_array', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Sparse Array', () => {
    const inputJson = "{ \"arr\": [1, null, 3, null, 5] }";
    const expectedToon = "arr[5]: 1,null,3,null,5";

    test('encode: sparse_array', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: sparse_array', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: sparse_array', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Optional Fields', () => {
    const inputJson = "{\n  \"users\": [\n    { \"id\": 1, \"name\": \"A\" },\n    { \"id\": 2 }\n  ]\n}";
    const expectedToon = "users:\n  - id: 1\n    name: A\n  - id: 2";

    test('encode: optional_fields', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: optional_fields', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: optional_fields', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Map Object', () => {
    const inputJson = "{\n  \"translations\": {\n    \"en\": \"hello\",\n    \"fr\": \"bonjour\",\n    \"es\": \"hola\"\n  }\n}";
    const expectedToon = "translations:\n  en: hello\n  fr: bonjour\n  es: hola";

    test('encode: map_object', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: map_object', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: map_object', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Deep Key Folding', () => {
    const inputJson = "{\n  \"a\": {\n    \"b\": {\n      \"c\": {\n        \"items\": [\n          { \"v\": 1 },\n          { \"v\": 2 }\n        ]\n      }\n    }\n  }\n}";
    const expectedToon = "a.b.c.items[2]{v}:\n  1\n  2";

    test('encode: deep_key_folding', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: deep_key_folding', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: deep_key_folding', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Matrix Example', () => {
    const inputJson = "{\n  \"matrix\": [\n    [1, 2, 3],\n    [4, 5, 6]\n  ]\n}";
    const expectedToon = "matrix:\n  - [1,2,3]\n  - [4,5,6]";

    test('encode: matrix_example', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: matrix_example', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: matrix_example', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Complex Mixed', () => {
    const inputJson = "{\n  \"id\": 99,\n  \"flags\": [true, false, null],\n  \"meta\": {\n    \"tags\": [\"ai\", \"ml\"],\n    \"scores\": [1, { \"a\":2 }, 3],\n    \"notes\": \"ok\"\n  }\n}";
    const expectedToon = "id: 99\nflags[3]: true,false,null\nmeta:\n  tags[2]: ai,ml\n  scores:\n    - 1\n    - a: 2\n    - 3\n  notes: ok";

    test('encode: complex_mixed', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: complex_mixed', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: complex_mixed', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Hybrid Tabular Mixed', () => {
    const inputJson = "{\n  \"entries\": [\n    { \"id\": 1, \"name\": \"A\" },\n    \"invalid\",\n    { \"id\": 2, \"name\": \"B\" }\n  ]\n}";
    const expectedToon = "entries:\n  - id: 1\n    name: A\n  - \"invalid\"\n  - id: 2\n    name: B";

    test('encode: hybrid_tabular_mixed', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: hybrid_tabular_mixed', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: hybrid_tabular_mixed', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });

  describe('Full Realistic', () => {
    const inputJson = "{\n  \"session\": {\n    \"id\": \"xyz99\",\n    \"user\": {\n      \"id\": 1,\n      \"name\": \"Alpha\",\n      \"roles\": [\"admin\", \"editor\"]\n    },\n    \"activity\": [\n      { \"type\": \"login\", \"time\": 12345 },\n      { \"type\": \"edit\", \"time\": 12367, \"changes\": [\"title\", \"body\"] }\n    ],\n    \"config\": {\n      \"retry\": 3,\n      \"debug\": false\n    }\n  }\n}";
    const expectedToon = "session:\n  id: xyz99\n  user:\n    id: 1\n    name: Alpha\n    roles[2]: admin,editor\n  activity:\n    - type: login\n      time: 12345\n    - type: edit\n      time: 12367\n      changes[2]: title,body\n  config:\n    retry: 3\n    debug: false";

    test('encode: full_realistic', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: full_realistic', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: full_realistic', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });
});
