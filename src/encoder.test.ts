import { ToonEncoder, jsonToToon } from './encoder';
import { JsonValue } from './types';

describe('ToonEncoder', () => {
  let encoder: ToonEncoder;

  beforeEach(() => {
    encoder = new ToonEncoder();
  });

  describe('Primitives', () => {
    test('should encode null', () => {
      expect(encoder.encode(null)).toBe('null');
    });

    test('should encode boolean true', () => {
      expect(encoder.encode(true)).toBe('true');
    });

    test('should encode boolean false', () => {
      expect(encoder.encode(false)).toBe('false');
    });

    test('should encode numbers', () => {
      expect(encoder.encode(42)).toBe('42');
      expect(encoder.encode(3.14)).toBe('3.14');
      expect(encoder.encode(0)).toBe('0');
      expect(encoder.encode(-10)).toBe('-10');
    });

    test('should encode simple strings', () => {
      expect(encoder.encode('hello')).toBe('hello');
      expect(encoder.encode('test123')).toBe('test123');
    });

    test('should quote strings with spaces', () => {
      expect(encoder.encode('hello world')).toBe('"hello world"');
    });

    test('should quote empty strings', () => {
      expect(encoder.encode('')).toBe('""');
    });

    test('should quote strings that look like keywords', () => {
      expect(encoder.encode('null')).toBe('"null"');
      expect(encoder.encode('true')).toBe('"true"');
      expect(encoder.encode('false')).toBe('"false"');
    });

    test('should quote strings that look like numbers', () => {
      expect(encoder.encode('123')).toBe('"123"');
      expect(encoder.encode('3.14')).toBe('"3.14"');
    });
  });

  describe('Simple Objects', () => {
    test('should encode empty object', () => {
      expect(encoder.encode({})).toBe('{}');
    });

    test('should encode simple object with primitives', () => {
      const obj = {
        name: 'Alice',
        age: 30,
        active: true,
      };
      const result = encoder.encode(obj);
      expect(result).toContain('name Alice');
      expect(result).toContain('age 30');
      expect(result).toContain('active true');
    });

    test('should encode object with null value', () => {
      const obj = { value: null };
      const result = encoder.encode(obj);
      expect(result).toContain('value null');
    });

    test('should handle keys with special characters in values', () => {
      const obj = {
        message: 'Hello World',
        count: 42,
      };
      const result = encoder.encode(obj);
      expect(result).toContain('message "Hello World"');
      expect(result).toContain('count 42');
    });
  });

  describe('Nested Objects', () => {
    test('should encode nested objects', () => {
      const obj = {
        user: {
          name: 'Bob',
          age: 25,
        },
      };
      const result = encoder.encode(obj);
      expect(result).toContain('user');
      expect(result).toContain('name Bob');
      expect(result).toContain('age 25');
    });

    test('should encode deeply nested objects', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const result = encoder.encode(obj);
      expect(result).toContain('level1');
      expect(result).toContain('level2');
      expect(result).toContain('level3');
      expect(result).toContain('value deep');
    });
  });

  describe('Arrays', () => {
    test('should encode empty array', () => {
      expect(encoder.encode([])).toBe('[]');
    });

    test('should encode uniform array of objects as table', () => {
      const arr = [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ];
      const result = encoder.encode(arr);
      
      // Should have header row
      expect(result).toContain('id');
      expect(result).toContain('name');
      expect(result).toContain('role');
      
      // Should have data rows
      expect(result).toContain('1');
      expect(result).toContain('Alice');
      expect(result).toContain('admin');
      expect(result).toContain('2');
      expect(result).toContain('Bob');
      expect(result).toContain('user');
    });

    test('should encode non-uniform array with list format', () => {
      const arr = [1, 'two', true, null];
      const result = encoder.encode(arr);
      expect(result).toContain('- 1');
      expect(result).toContain('- two');
      expect(result).toContain('- true');
      expect(result).toContain('- null');
    });

    test('should not treat non-uniform objects as table', () => {
      const arr: JsonValue = [
        { id: 1, name: 'Alice' },
        { id: 2, email: 'bob@example.com' }, // different keys
      ];
      const result = encoder.encode(arr);
      // Should not be in table format
      expect(result).not.toMatch(/id\s+name/);
    });
  });

  describe('Complex Structures', () => {
    test('should encode object with array property', () => {
      const obj = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      };
      const result = encoder.encode(obj);
      expect(result).toContain('users');
      expect(result).toContain('id');
      expect(result).toContain('name');
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });

    test('should encode the example from documentation', () => {
      const obj = {
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      };
      const result = encoder.encode(obj);
      
      // Verify structure
      expect(result).toContain('users');
      expect(result).toContain('id');
      expect(result).toContain('name');
      expect(result).toContain('role');
      expect(result).toContain('1');
      expect(result).toContain('Alice');
      expect(result).toContain('admin');
      expect(result).toContain('2');
      expect(result).toContain('Bob');
      expect(result).toContain('user');
    });

    test('should handle mixed content', () => {
      const obj = {
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
      };
      const result = encoder.encode(obj);
      expect(result).toContain('title Report');
      expect(result).toContain('count 100');
      expect(result).toContain('items');
      expect(result).toContain('metadata');
      expect(result).toContain('created');
      expect(result).toContain('author System');
    });
  });

  describe('Options', () => {
    test('should respect custom indent', () => {
      const customEncoder = new ToonEncoder({ indent: 4 });
      const obj = {
        nested: {
          value: 'test',
        },
      };
      const result = customEncoder.encode(obj);
      // Should have 4 spaces for first level
      expect(result).toContain('    nested');
      expect(result).toContain('        value test');
    });

    test('should handle alignColumns option', () => {
      const alignedEncoder = new ToonEncoder({ alignColumns: true });
      const nonAlignedEncoder = new ToonEncoder({ alignColumns: false });
      
      const arr = [
        { id: 1, name: 'A' },
        { id: 100, name: 'B' },
      ];
      
      const aligned = alignedEncoder.encode(arr);
      const nonAligned = nonAlignedEncoder.encode(arr);
      
      // Both should work, but aligned should have consistent spacing
      expect(aligned).toBeTruthy();
      expect(nonAligned).toBeTruthy();
    });
  });

  describe('jsonToToon convenience function', () => {
    test('should work as convenience function', () => {
      const obj = { name: 'test', value: 42 };
      const result = jsonToToon(obj);
      expect(result).toContain('name test');
      expect(result).toContain('value 42');
    });

    test('should accept options', () => {
      const obj = { nested: { value: 'test' } };
      const result = jsonToToon(obj, { indent: 4 });
      expect(result).toContain('    nested');
      expect(result).toContain('        value test');
    });
  });

  describe('Edge Cases', () => {
    test('should handle array of arrays', () => {
      const arr = [[1, 2], [3, 4]];
      const result = encoder.encode(arr);
      expect(result).toBeTruthy();
    });

    test('should handle object with array of primitives', () => {
      const obj = {
        numbers: [1, 2, 3, 4, 5],
      };
      const result = encoder.encode(obj);
      expect(result).toContain('numbers');
      expect(result).toContain('1');
      expect(result).toContain('5');
    });

    test('should handle special characters in strings', () => {
      const obj = {
        text: 'Line 1\nLine 2',
        tab: 'A\tB',
      };
      const result = encoder.encode(obj);
      expect(result).toContain('text');
      expect(result).toContain('tab');
    });
  });
});
