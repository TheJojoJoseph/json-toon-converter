import { ToonDecoder, toonToJson } from './decoder';
import { jsonToToon } from './encoder';

describe('ToonDecoder', () => {
  let decoder: ToonDecoder;

  beforeEach(() => {
    decoder = new ToonDecoder();
  });

  describe('Primitives', () => {
    test('should decode null', () => {
      expect(decoder.decode('null')).toBe(null);
    });

    test('should decode boolean true', () => {
      expect(decoder.decode('true')).toBe(true);
    });

    test('should decode boolean false', () => {
      expect(decoder.decode('false')).toBe(false);
    });

    test('should decode numbers', () => {
      expect(decoder.decode('42')).toBe(42);
      expect(decoder.decode('3.14')).toBe(3.14);
      expect(decoder.decode('0')).toBe(0);
      expect(decoder.decode('-10')).toBe(-10);
    });

    test('should decode simple strings', () => {
      expect(decoder.decode('hello')).toBe('hello');
      expect(decoder.decode('test123')).toBe('test123');
    });

    test('should decode quoted strings', () => {
      expect(decoder.decode('"hello world"')).toBe('hello world');
      expect(decoder.decode('""')).toBe('');
    });

    test('should decode quoted keywords as strings', () => {
      expect(decoder.decode('"null"')).toBe('null');
      expect(decoder.decode('"true"')).toBe('true');
      expect(decoder.decode('"false"')).toBe('false');
    });

    test('should decode quoted numbers as strings', () => {
      expect(decoder.decode('"123"')).toBe('123');
      expect(decoder.decode('"3.14"')).toBe('3.14');
    });
  });

  describe('Simple Objects', () => {
    test('should decode empty object', () => {
      expect(decoder.decode('{}')).toEqual({});
    });

    test('should decode simple object with primitives', () => {
      const toon = `  name Alice
  age 30
  active true`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        name: 'Alice',
        age: 30,
        active: true,
      });
    });

    test('should decode object with null value', () => {
      const toon = `  value null`;
      const result = decoder.decode(toon);
      expect(result).toEqual({ value: null });
    });

    test('should decode object with quoted strings', () => {
      const toon = `  message "Hello World"
  count 42`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        message: 'Hello World',
        count: 42,
      });
    });
  });

  describe('Nested Objects', () => {
    test('should decode nested objects', () => {
      const toon = `  user
    name Bob
    age 25`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        user: {
          name: 'Bob',
          age: 25,
        },
      });
    });

    test('should decode deeply nested objects', () => {
      const toon = `  level1
    level2
      level3
        value deep`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      });
    });
  });

  describe('Tables', () => {
    test('should decode table format to array of objects', () => {
      const toon = `  id  name   role
  1   Alice  admin
  2   Bob    user`;
      const result = decoder.decode(toon);
      expect(result).toEqual([
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ]);
    });

    test('should decode table with various data types', () => {
      const toon = `  id  active  score
  1   true    95.5
  2   false   87.3`;
      const result = decoder.decode(toon);
      expect(result).toEqual([
        { id: 1, active: true, score: 95.5 },
        { id: 2, active: false, score: 87.3 },
      ]);
    });

    test('should decode table with quoted strings', () => {
      const toon = `  id  message
  1   "Hello World"
  2   "Test Message"`;
      const result = decoder.decode(toon);
      expect(result).toEqual([
        { id: 1, message: 'Hello World' },
        { id: 2, message: 'Test Message' },
      ]);
    });
  });

  describe('Complex Structures', () => {
    test('should decode object with table array property', () => {
      const toon = `  users
    id  name
    1   Alice
    2   Bob`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      });
    });

    test('should decode the example from documentation', () => {
      const toon = `  users
    id  name   role
    1   Alice  admin
    2   Bob    user`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      });
    });

    test('should decode mixed content', () => {
      const toon = `  title Report
  count 100
  items
    id  value
    1   A
    2   B
  metadata
    created 2024-01-01
    author System`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        title: 'Report',
        count: 100,
        items: [
          { id: 1, value: 'A' },
          { id: 2, value: 'B' },
        ],
        metadata: {
          created: '2024-01-01',
          author: 'System',
        },
      });
    });
  });

  describe('Options', () => {
    test('should respect preserveNumbers option', () => {
      const toon = `  value 42`;
      
      const withNumbers = new ToonDecoder({ preserveNumbers: true });
      expect(withNumbers.decode(toon)).toEqual({ value: 42 });
      
      const withoutNumbers = new ToonDecoder({ preserveNumbers: false });
      expect(withoutNumbers.decode(toon)).toEqual({ value: '42' });
    });

    test('should respect preserveBooleans option', () => {
      const toon = `  active true`;
      
      const withBooleans = new ToonDecoder({ preserveBooleans: true });
      expect(withBooleans.decode(toon)).toEqual({ active: true });
      
      const withoutBooleans = new ToonDecoder({ preserveBooleans: false });
      expect(withoutBooleans.decode(toon)).toEqual({ active: 'true' });
    });
  });

  describe('toonToJson convenience function', () => {
    test('should work as convenience function', () => {
      const toon = `  name test
  value 42`;
      const result = toonToJson(toon);
      expect(result).toEqual({
        name: 'test',
        value: 42,
      });
    });

    test('should accept options', () => {
      const toon = `  value 42`;
      const result = toonToJson(toon, { preserveNumbers: false });
      expect(result).toEqual({ value: '42' });
    });
  });

  describe('Round-trip Conversion', () => {
    test('should round-trip simple object', () => {
      const original = {
        name: 'Alice',
        age: 30,
        active: true,
      };
      const toon = jsonToToon(original);
      const decoded = toonToJson(toon);
      expect(decoded).toEqual(original);
    });

    test('should round-trip nested object', () => {
      const original = {
        user: {
          name: 'Bob',
          profile: {
            age: 25,
            city: 'NYC',
          },
        },
      };
      const toon = jsonToToon(original);
      const decoded = toonToJson(toon);
      expect(decoded).toEqual(original);
    });

    test('should round-trip array of objects', () => {
      const original = [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ];
      const toon = jsonToToon(original);
      const decoded = toonToJson(toon);
      expect(decoded).toEqual(original);
    });

    test('should round-trip complex structure', () => {
      const original = {
        title: 'Report',
        count: 100,
        items: [
          { id: 1, value: 'A', score: 95.5 },
          { id: 2, value: 'B', score: 87.3 },
        ],
        metadata: {
          created: '2024-01-01',
          author: 'System',
          tags: ['important', 'urgent'],
        },
      };
      const toon = jsonToToon(original);
      const decoded = toonToJson(toon);
      expect(decoded).toEqual(original);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty lines', () => {
      const toon = `  name test

  value 42`;
      const result = decoder.decode(toon);
      expect(result).toEqual({
        name: 'test',
        value: 42,
      });
    });

    test('should handle empty array', () => {
      expect(decoder.decode('[]')).toEqual([]);
    });

    test('should handle empty object', () => {
      expect(decoder.decode('{}')).toEqual({});
    });

    test('should handle single item table', () => {
      const toon = `  id  name
  1   Alice`;
      const result = decoder.decode(toon);
      expect(result).toEqual([{ id: 1, name: 'Alice' }]);
    });
  });
});
