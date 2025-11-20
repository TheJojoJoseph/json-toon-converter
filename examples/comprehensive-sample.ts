/**
 * Comprehensive Sample Code for @jojojoseph/toon-json-converter
 * 
 * This file demonstrates all major features of the TOON JSON converter package.
 * TOON (Token-Oriented Object Notation) reduces LLM token usage by 30-60% compared to JSON.
 */

import {
  jsonToToon,
  toonToJson,
  ToonConverter,
  ToonEncoder,
  ToonDecoder,
} from '../src/index';

// ============================================================================
// 1. BASIC CONVERSIONS
// ============================================================================

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  1. BASIC CONVERSIONS                                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Simple object
const person = {
  name: 'Alice Johnson',
  age: 30,
  email: 'alice@example.com',
  active: true,
};

console.log('Original JSON:');
console.log(JSON.stringify(person, null, 2));

const personToon = jsonToToon(person);
console.log('\nTOON format:');
console.log(personToon);

const personBack = toonToJson(personToon);
console.log('\nConverted back to JSON:');
console.log(JSON.stringify(personBack, null, 2));

// ============================================================================
// 2. ARRAY OF OBJECTS (TABLE FORMAT)
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  2. ARRAY OF OBJECTS - TABLE FORMAT                           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const employees = {
  company: 'TechCorp',
  employees: [
    { id: 1, name: 'Alice', department: 'Engineering', salary: 95000 },
    { id: 2, name: 'Bob', department: 'Marketing', salary: 75000 },
    { id: 3, name: 'Carol', department: 'Engineering', salary: 105000 },
    { id: 4, name: 'David', department: 'Sales', salary: 85000 },
  ],
};

const employeesToon = jsonToToon(employees);
console.log('TOON format (notice the compact table):');
console.log(employeesToon);

console.log('\nJSON size:', JSON.stringify(employees).length, 'chars');
console.log('TOON size:', employeesToon.length, 'chars');
console.log('Savings:', ((JSON.stringify(employees).length - employeesToon.length) / JSON.stringify(employees).length * 100).toFixed(1) + '%');

// ============================================================================
// 3. NESTED OBJECTS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  3. NESTED OBJECTS                                            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const config = {
  application: {
    name: 'MyApp',
    version: '2.1.0',
    server: {
      host: 'localhost',
      port: 8080,
      ssl: {
        enabled: true,
        certPath: '/etc/ssl/cert.pem',
      },
    },
    database: {
      host: 'db.example.com',
      port: 5432,
      name: 'myapp_db',
    },
  },
};

const configToon = jsonToToon(config);
console.log('TOON format:');
console.log(configToon);

// ============================================================================
// 4. ARRAYS OF PRIMITIVES
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  4. ARRAYS OF PRIMITIVES                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const tags = {
  title: 'My Blog Post',
  tags: ['javascript', 'typescript', 'ai', 'llm', 'optimization'],
  scores: [95, 87, 92, 88, 91],
  flags: [true, false, true, true, false],
};

const tagsToon = jsonToToon(tags);
console.log('TOON format:');
console.log(tagsToon);

// ============================================================================
// 5. MIXED ARRAYS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  5. MIXED ARRAYS                                              ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const mixedData = {
  items: [
    'string value',
    42,
    { id: 1, name: 'Object item' },
    true,
    ['nested', 'array'],
  ],
};

const mixedToon = jsonToToon(mixedData);
console.log('TOON format:');
console.log(mixedToon);

// ============================================================================
// 6. MULTILINE STRINGS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  6. MULTILINE STRINGS                                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const document = {
  title: 'Sample Document',
  description: 'This is a long description\nthat spans multiple lines\nand preserves formatting.',
  content: `Line 1 of content
Line 2 of content
Line 3 of content`,
};

const docToon = jsonToToon(document);
console.log('TOON format:');
console.log(docToon);

// ============================================================================
// 7. SPECIAL CHARACTERS AND QUOTING
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  7. SPECIAL CHARACTERS AND QUOTING                            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const specialChars = {
  quote: 'He said "Hello"',
  comma: 'value1, value2, value3',
  colon: 'key: value',
  brackets: '{object}: [array]',
  escaped: 'Line 1\\nLine 2',
};

const specialToon = jsonToToon(specialChars);
console.log('TOON format:');
console.log(specialToon);

// ============================================================================
// 8. USING ToonConverter CLASS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  8. USING ToonConverter CLASS                                 ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const apiData = {
  status: 'success',
  data: [
    { id: 1, product: 'Laptop', price: 999.99, inStock: true },
    { id: 2, product: 'Mouse', price: 29.99, inStock: true },
    { id: 3, product: 'Keyboard', price: 79.99, inStock: false },
  ],
  timestamp: '2024-01-15T10:30:00Z',
};

// Using static methods
const apiToon = ToonConverter.toToon(apiData);
console.log('TOON format:');
console.log(apiToon);

const apiJson = ToonConverter.toJson(apiToon);
console.log('\nConverted back:');
console.log(JSON.stringify(apiJson, null, 2));

// Validation
console.log('\nValidation:');
console.log('Is valid TOON?', ToonConverter.isValid(apiToon));
console.log('Validation result:', ToonConverter.validate(apiToon));

// ============================================================================
// 9. CUSTOM ENCODING OPTIONS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  9. CUSTOM ENCODING OPTIONS                                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const data = {
  users: [
    { id: 1, username: 'alice', score: 95 },
    { id: 2, username: 'bob', score: 87 },
  ],
};

// Custom encoder with 4-space indentation
const customEncoder = new ToonEncoder({
  indent: 4,
  delimiter: ',',
});

const customToon = customEncoder.encode(data);
console.log('TOON with 4-space indent:');
console.log(customToon);

// Default encoder (2-space indent)
const defaultToon = jsonToToon(data);
console.log('\nTOON with default 2-space indent:');
console.log(defaultToon);

// ============================================================================
// 10. CUSTOM DECODING OPTIONS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  10. CUSTOM DECODING OPTIONS                                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const toonString = `value: 42
active: true
name: Alice`;

// Decode with type preservation (default)
const decoderPreserve = new ToonDecoder({
  preserveNumbers: true,
  preserveBooleans: true,
});

const resultPreserve = decoderPreserve.decode(toonString);
console.log('With type preservation:');
console.log(resultPreserve);
console.log('Types:', {
  value: typeof (resultPreserve as Record<string, unknown>).value,
  active: typeof (resultPreserve as Record<string, unknown>).active,
  name: typeof (resultPreserve as Record<string, unknown>).name,
});

// Decode without type preservation
const decoderNoPreserve = new ToonDecoder({
  preserveNumbers: false,
  preserveBooleans: false,
});

const resultNoPreserve = decoderNoPreserve.decode(toonString);
console.log('\nWithout type preservation:');
console.log(resultNoPreserve);
console.log('Types:', {
  value: typeof (resultNoPreserve as Record<string, unknown>).value,
  active: typeof (resultNoPreserve as Record<string, unknown>).active,
  name: typeof (resultNoPreserve as Record<string, unknown>).name,
});

// ============================================================================
// 11. REAL-WORLD USE CASE: LLM PROMPT OPTIMIZATION
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  11. REAL-WORLD USE CASE: LLM PROMPT OPTIMIZATION             ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const customerData = {
  context: {
    task: 'Analyze customer purchase patterns',
    period: 'Q1 2024',
  },
  customers: [
    { id: 'C001', name: 'Alice Corp', purchases: 15, revenue: 45000, region: 'North' },
    { id: 'C002', name: 'Bob Industries', purchases: 23, revenue: 67000, region: 'South' },
    { id: 'C003', name: 'Carol LLC', purchases: 8, revenue: 21000, region: 'East' },
    { id: 'C004', name: 'David & Co', purchases: 31, revenue: 89000, region: 'West' },
    { id: 'C005', name: 'Eve Enterprises', purchases: 19, revenue: 54000, region: 'North' },
  ],
};

const jsonPrompt = `Analyze this customer data:\n${JSON.stringify(customerData, null, 2)}`;
const toonPrompt = `Analyze this customer data:\n${jsonToToon(customerData)}`;

console.log('JSON Prompt length:', jsonPrompt.length, 'characters');
console.log('TOON Prompt length:', toonPrompt.length, 'characters');
console.log('Token savings:', ((jsonPrompt.length - toonPrompt.length) / jsonPrompt.length * 100).toFixed(1) + '%');

console.log('\nTOON Prompt:');
console.log(toonPrompt);

// ============================================================================
// 12. EMPTY STRUCTURES
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  12. EMPTY STRUCTURES                                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const emptyData = {
  emptyObject: {},
  emptyArray: [],
  nullValue: null,
  normalValue: 'test',
};

const emptyToon = jsonToToon(emptyData);
console.log('TOON format:');
console.log(emptyToon);

const emptyBack = toonToJson(emptyToon);
console.log('\nConverted back:');
console.log(JSON.stringify(emptyBack, null, 2));

// ============================================================================
// 13. COMPLEX NESTED STRUCTURE
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  13. COMPLEX NESTED STRUCTURE                                 ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const complexData = {
  project: {
    name: 'TOON Converter',
    version: '2.0.2',
    metadata: {
      author: 'JoJo Joseph',
      license: 'MIT',
      tags: ['json', 'toon', 'llm', 'optimization'],
    },
    stats: {
      downloads: 1500,
      stars: 42,
      forks: 8,
    },
    releases: [
      { version: '1.0.0', date: '2024-01-01', features: ['Basic conversion'] },
      { version: '2.0.0', date: '2024-02-01', features: ['Table format', 'Optimization'] },
      { version: '2.0.2', date: '2024-03-01', features: ['Bug fixes', 'Performance'] },
    ],
  },
};

const complexToon = jsonToToon(complexData);
console.log('TOON format:');
console.log(complexToon);

console.log('\nSize comparison:');
console.log('JSON:', JSON.stringify(complexData).length, 'chars');
console.log('TOON:', complexToon.length, 'chars');
console.log('Savings:', ((JSON.stringify(complexData).length - complexToon.length) / JSON.stringify(complexData).length * 100).toFixed(1) + '%');

// ============================================================================
// 14. PERFORMANCE COMPARISON
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  14. PERFORMANCE COMPARISON                                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Generate large dataset
const largeDataset = {
  records: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: Math.random() * 1000,
    active: i % 2 === 0,
    category: ['A', 'B', 'C', 'D'][i % 4],
  })),
};

const jsonStr = JSON.stringify(largeDataset);
const toonStr = jsonToToon(largeDataset);

console.log('Dataset with 100 records:');
console.log('JSON size:', jsonStr.length, 'characters');
console.log('TOON size:', toonStr.length, 'characters');
console.log('Compression ratio:', (toonStr.length / jsonStr.length * 100).toFixed(1) + '%');
console.log('Savings:', ((jsonStr.length - toonStr.length) / jsonStr.length * 100).toFixed(1) + '%');

// Encoding performance
const encodeStart = Date.now();
for (let i = 0; i < 100; i++) {
  jsonToToon(largeDataset);
}
const encodeTime = Date.now() - encodeStart;

// Decoding performance
const decodeStart = Date.now();
for (let i = 0; i < 100; i++) {
  toonToJson(toonStr);
}
const decodeTime = Date.now() - decodeStart;

console.log('\nPerformance (100 iterations):');
console.log('Encoding time:', encodeTime, 'ms');
console.log('Decoding time:', decodeTime, 'ms');

// ============================================================================
// 15. ERROR HANDLING
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  15. ERROR HANDLING                                           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Invalid TOON format
const invalidToon = 'invalid: [unclosed';

try {
  toonToJson(invalidToon);
} catch (error) {
  console.log('Error caught:', error instanceof Error ? error.message : error);
}

// Using validation
const validation = ToonConverter.validate(invalidToon);
console.log('\nValidation result:', validation);

// Valid TOON
const validToon = 'name: Alice\nage: 30';
const validValidation = ToonConverter.validate(validToon);
console.log('Valid TOON validation:', validValidation);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SUMMARY                                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('✅ TOON format benefits:');
console.log('   • 30-60% token reduction for LLM prompts');
console.log('   • Human-readable format');
console.log('   • Compact table representation for arrays');
console.log('   • Preserves data types (numbers, booleans, null)');
console.log('   • Supports nested structures');
console.log('   • Fast encoding/decoding');
console.log('\n📦 Package: @jojojoseph/toon-json-converter');
console.log('🔗 GitHub: https://github.com/TheJojoJoseph/json-toon-converter');
console.log('📚 NPM: https://www.npmjs.com/package/@jojojoseph/toon-json-converter\n');
