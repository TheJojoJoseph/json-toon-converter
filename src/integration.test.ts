import { ToonConverter } from './index';
import { jsonToToon, toonToJson } from './index';

describe('Integration Tests', () => {
  describe('ToonConverter class', () => {
    test('should convert JSON to TOON using static method', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      };
      const toon = ToonConverter.toToon(data);
      expect(toon).toContain('users');
      expect(toon).toContain('Alice');
      expect(toon).toContain('Bob');
    });

    test('should convert TOON to JSON using static method', () => {
      const toon = `  users
    id  name   role
    1   Alice  admin
    2   Bob    user`;
      const json = ToonConverter.toJson(toon);
      expect(json).toEqual({
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
        ],
      });
    });

    test('should round-trip through ToonConverter', () => {
      const original = {
        title: 'Test',
        items: [
          { id: 1, value: 'A' },
          { id: 2, value: 'B' },
        ],
      };
      const toon = ToonConverter.toToon(original);
      const result = ToonConverter.toJson(toon);
      expect(result).toEqual(original);
    });
  });

  describe('Real-world Use Cases', () => {
    test('should handle user list efficiently', () => {
      const users = {
        users: [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
          { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
          { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' },
        ],
      };

      const toon = jsonToToon(users);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(users);
      
      // Verify TOON is more compact (fewer characters than JSON)
      const jsonStr = JSON.stringify(users);
      expect(toon.length).toBeLessThan(jsonStr.length);
    });

    test('should handle product catalog', () => {
      const catalog = {
        products: [
          { sku: 'A001', name: 'Widget', price: 19.99, stock: 100 },
          { sku: 'A002', name: 'Gadget', price: 29.99, stock: 50 },
          { sku: 'A003', name: 'Doohickey', price: 9.99, stock: 200 },
        ],
      };

      const toon = jsonToToon(catalog);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(catalog);
    });

    test('should handle configuration data', () => {
      const config = {
        app: {
          name: 'MyApp',
          version: '1.0.0',
          settings: {
            debug: true,
            timeout: 5000,
            retries: 3,
          },
        },
        database: {
          host: 'localhost',
          port: 5432,
          name: 'mydb',
        },
      };

      const toon = jsonToToon(config);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(config);
    });

    test('should handle log entries', () => {
      const logs = [
        { timestamp: '2024-01-01T10:00:00Z', level: 'INFO', message: 'Server started' },
        { timestamp: '2024-01-01T10:01:00Z', level: 'WARN', message: 'High memory usage' },
        { timestamp: '2024-01-01T10:02:00Z', level: 'ERROR', message: 'Connection failed' },
      ];

      const toon = jsonToToon(logs);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(logs);
    });

    test('should handle API response structure', () => {
      const response = {
        status: 'success',
        code: 200,
        data: [
          { id: 1, title: 'Post 1', views: 1500 },
          { id: 2, title: 'Post 2', views: 2300 },
        ],
        meta: {
          page: 1,
          total: 2,
          hasMore: false,
        },
      };

      const toon = jsonToToon(response);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(response);
    });
  });

  describe('Token Efficiency', () => {
    test('should be more compact than JSON for flat arrays', () => {
      const data = {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: (i + 1) * 10,
        })),
      };

      const jsonStr = JSON.stringify(data);
      const toonStr = jsonToToon(data);

      // TOON should be more compact
      expect(toonStr.length).toBeLessThan(jsonStr.length);
      
      // Verify correctness
      expect(toonToJson(toonStr)).toEqual(data);
    });

    test('should handle large uniform datasets efficiently', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User${i + 1}`,
        score: Math.floor(Math.random() * 100),
        active: i % 2 === 0,
      }));

      const jsonStr = JSON.stringify(data);
      const toonStr = jsonToToon(data);

      // TOON should be significantly more compact for this uniform data
      const savings = ((jsonStr.length - toonStr.length) / jsonStr.length) * 100;
      expect(savings).toBeGreaterThan(20); // At least 20% savings

      // Verify correctness
      expect(toonToJson(toonStr)).toEqual(data);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed TOON gracefully', () => {
      const malformed = 'not valid toon';
      const result = toonToJson(malformed);
      // Should return something without throwing
      expect(result).toBeDefined();
    });

    test('should handle empty input', () => {
      expect(toonToJson('')).toBeDefined();
    });
  });

  describe('Special Characters', () => {
    test('should handle strings with special characters', () => {
      const data = {
        text: 'Hello, World!',
        emoji: '😀 🎉',
        unicode: 'Héllo Wörld',
      };

      const toon = jsonToToon(data);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(data);
    });

    test('should handle multiline strings', () => {
      const data = {
        description: 'Line 1\nLine 2\nLine 3',
      };

      const toon = jsonToToon(data);
      const decoded = toonToJson(toon);

      expect(decoded).toEqual(data);
    });
  });
});
