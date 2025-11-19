/**
 * Tests for TOON converter
 */

import {
  jsonToToon,
  toonToJson,
  ToonConverter,
  ToonEncoder,
  ToonDecoder,
} from '../src/index';

describe('TOON Converter', () => {
  describe('Simple Objects', () => {
    test('encode simple object', () => {
      const data = {
        name: 'Alice',
        age: 30,
        active: true,
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('name: Alice');
      expect(toon).toContain('age: 30');
      expect(toon).toContain('active: true');
    });

    test('decode simple object', () => {
      const toon = `name: Alice
age: 30
active: true`;

      const json = toonToJson(toon);
      expect(json).toEqual({
        name: 'Alice',
        age: 30,
        active: true,
      });
    });

    test('round-trip simple object', () => {
      const data = {
        name: 'Bob',
        score: 95.5,
        verified: false,
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });

  describe('Nested Objects', () => {
    test('encode nested object', () => {
      const data = {
        user: {
          name: 'Charlie',
          profile: {
            age: 25,
            city: 'NYC',
          },
        },
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('user:');
      expect(toon).toContain('name: Charlie');
      expect(toon).toContain('profile:');
      expect(toon).toContain('age: 25');
      expect(toon).toContain('city: NYC');
    });

    test('decode nested object', () => {
      const toon = `user:
  name: Charlie
  profile:
    age: 25
    city: NYC`;

      const json = toonToJson(toon);
      expect(json).toEqual({
        user: {
          name: 'Charlie',
          profile: {
            age: 25,
            city: 'NYC',
          },
        },
      });
    });

    test('round-trip nested object', () => {
      const data = {
        company: {
          name: 'TechCorp',
          address: {
            street: '123 Main St',
            city: 'Boston',
          },
        },
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });

  describe('Primitive Arrays', () => {
    test('encode primitive array', () => {
      const data = {
        tags: ['admin', 'ops', 'dev'],
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('tags[3]:');
      expect(toon).toContain('admin,ops,dev');
    });

    test('decode primitive array', () => {
      const toon = 'tags[3]: admin,ops,dev';

      const json = toonToJson(toon);
      expect(json).toEqual({
        tags: ['admin', 'ops', 'dev'],
      });
    });

    test('round-trip primitive array', () => {
      const data = {
        numbers: [1, 2, 3, 4, 5],
        booleans: [true, false, true],
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });

  describe('Tabular Arrays', () => {
    test('encode tabular array', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('users[2]{id,name,role}:');
      expect(toon).toContain('1,Alice,admin');
      expect(toon).toContain('2,Bob,user');
    });

    test('decode tabular array', () => {
      const toon = `users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user`;

      const json = toonToJson(toon);
      expect(json).toEqual({
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      });
    });

    test('round-trip tabular array', () => {
      const data = {
        products: [
          { sku: 'A001', name: 'Widget', price: 19.99 },
          { sku: 'A002', name: 'Gadget', price: 29.99 },
        ],
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });

  describe('Mixed Arrays', () => {
    test('encode mixed array', () => {
      const data = {
        items: [1, 'text', { id: 1 }],
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('items[3]:');
      expect(toon).toContain('- 1');
      expect(toon).toContain('- text');
      expect(toon).toContain('- id: 1');
    });

    test('decode mixed array', () => {
      const toon = `items[3]:
  - 1
  - text
  - id: 1`;

      const json = toonToJson(toon);
      expect(json).toEqual({
        items: [1, 'text', { id: 1 }],
      });
    });
  });

  describe('Empty Values', () => {
    test('encode empty array', () => {
      const data = {
        items: [],
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('items[0]:');
    });

    test('decode empty array', () => {
      const toon = 'items[0]:';

      const json = toonToJson(toon);
      expect(json).toEqual({
        items: [],
      });
    });

    test('encode empty object', () => {
      const data = {
        config: {},
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('config:');
    });

    test('decode empty object', () => {
      const toon = 'config:';

      const json = toonToJson(toon);
      expect(json).toEqual({
        config: {},
      });
    });
  });

  describe('Special Characters', () => {
    test('encode strings with quotes', () => {
      const data = {
        message: 'Hello "World"',
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('"Hello \\"World\\""');
    });

    test('decode strings with quotes', () => {
      const toon = 'message: "Hello \\"World\\""';

      const json = toonToJson(toon);
      expect(json).toEqual({
        message: 'Hello "World"',
      });
    });

    test('encode strings with commas', () => {
      const data = {
        tags: ['a,b', 'c', 'd,e,f'],
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('"a,b"');
    });

    test('decode strings with commas', () => {
      const toon = 'tags[3]: "a,b",c,"d,e,f"';

      const json = toonToJson(toon);
      expect(json).toEqual({
        tags: ['a,b', 'c', 'd,e,f'],
      });
    });

    test('encode strings with colons', () => {
      const data = {
        url: 'http://example.com',
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('"http://example.com"');
    });

    test('decode strings with colons', () => {
      const toon = 'url: "http://example.com"';

      const json = toonToJson(toon);
      expect(json).toEqual({
        url: 'http://example.com',
      });
    });
  });

  describe('Null Values', () => {
    test('encode null', () => {
      const data = {
        value: null,
      };

      const toon = jsonToToon(data);
      expect(toon).toContain('value: null');
    });

    test('decode null', () => {
      const toon = 'value: null';

      const json = toonToJson(toon);
      expect(json).toEqual({
        value: null,
      });
    });
  });

  describe('ToonConverter Class', () => {
    test('toToon method', () => {
      const data = { name: 'Test' };
      const toon = ToonConverter.toToon(data);
      expect(toon).toContain('name: Test');
    });

    test('toJson method', () => {
      const toon = 'name: Test';
      const json = ToonConverter.toJson(toon);
      expect(json).toEqual({ name: 'Test' });
    });

    test('isValid method - valid TOON', () => {
      const toon = 'name: Test';
      expect(ToonConverter.isValid(toon)).toBe(true);
    });

    test('isValid method - invalid TOON', () => {
      const toon = 'invalid[5]: a,b'; // Declares 5 but only has 2
      expect(ToonConverter.isValid(toon)).toBe(false);
    });

    test('validate method - valid TOON', () => {
      const toon = 'name: Test';
      const result = ToonConverter.validate(toon);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('validate method - invalid TOON', () => {
      const toon = 'items[2]: a'; // Declares 2 but only has 1
      const result = ToonConverter.validate(toon);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Encoder Options', () => {
    test('custom indent', () => {
      const data = {
        user: {
          name: 'Test',
        },
      };

      const encoder = new ToonEncoder({ indent: 4 });
      const toon = encoder.encode(data);
      expect(toon).toContain('    name: Test');
    });

    test('tab delimiter', () => {
      const data = {
        items: ['a', 'b', 'c'],
      };

      const encoder = new ToonEncoder({ delimiter: '\t' });
      const toon = encoder.encode(data);
      expect(toon).toContain('items[3\t]:');
      expect(toon).toContain('a\tb\tc');
    });

    test('pipe delimiter', () => {
      const data = {
        tags: ['x', 'y', 'z'],
      };

      const encoder = new ToonEncoder({ delimiter: '|' });
      const toon = encoder.encode(data);
      expect(toon).toContain('tags[3|]:');
      expect(toon).toContain('x|y|z');
    });
  });

  describe('Decoder Options', () => {
    test('preserveNumbers false', () => {
      const toon = 'age: 30';
      const decoder = new ToonDecoder({ preserveNumbers: false });
      const json = decoder.decode(toon);
      expect(json).toEqual({ age: '30' });
    });

    test('preserveBooleans false', () => {
      const toon = 'active: true';
      const decoder = new ToonDecoder({ preserveBooleans: false });
      const json = decoder.decode(toon);
      expect(json).toEqual({ active: 'true' });
    });

    test('strict mode false', () => {
      const toon = 'items[3]: a,b'; // Declares 3 but only has 2
      const decoder = new ToonDecoder({ strict: false });
      const json = decoder.decode(toon);
      expect(json).toHaveProperty('items');
      expect((json as any).items).toHaveLength(2);
    });
  });

  describe('Complex Structures', () => {
    test('complex nested structure', () => {
      const data = {
        status: 'success',
        data: [
          { id: 1, title: 'Post 1', views: 1500 },
          { id: 2, title: 'Post 2', views: 2300 },
        ],
        meta: {
          page: 1,
          total: 2,
        },
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('deeply nested objects', () => {
      const data = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('arrays of arrays', () => {
      const data = {
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
        ],
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });

  describe('Edge Cases', () => {
    test('empty string value', () => {
      const data = {
        name: '',
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('number zero', () => {
      const data = {
        count: 0,
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('negative numbers', () => {
      const data = {
        temperature: -5,
        balance: -100.50,
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('scientific notation', () => {
      const data = {
        value: 1.5e10,
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });

    test('unicode characters', () => {
      const data = {
        message: 'Hello 世界 👋',
        tags: ['🎉', '🎊', '🎈'],
      };

      const toon = jsonToToon(data);
      const result = toonToJson(toon);
      expect(result).toEqual(data);
    });
  });
});
