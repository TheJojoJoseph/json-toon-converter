/**
 * Basic usage examples for json-toon-converter
 */

import { jsonToToon, toonToJson, ToonConverter } from '../src/index';

// Example 1: Simple object conversion
console.log('=== Example 1: Simple Object ===');
const simpleData = {
  name: 'Alice',
  age: 30,
  active: true,
};

const simpleToon = jsonToToon(simpleData);
console.log('TOON format:');
console.log(simpleToon);
console.log('\nConverted back to JSON:');
console.log(toonToJson(simpleToon));

// Example 2: Array of objects (table format)
console.log('\n=== Example 2: Array of Objects ===');
const users = {
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Carol', role: 'user' },
  ],
};

const usersToon = jsonToToon(users);
console.log('TOON format:');
console.log(usersToon);
console.log('\nConverted back to JSON:');
console.log(JSON.stringify(toonToJson(usersToon), null, 2));

// Example 3: Nested objects
console.log('\n=== Example 3: Nested Objects ===');
const config = {
  app: {
    name: 'MyApp',
    version: '1.0.0',
    settings: {
      debug: true,
      timeout: 5000,
    },
  },
};

const configToon = jsonToToon(config);
console.log('TOON format:');
console.log(configToon);
console.log('\nConverted back to JSON:');
console.log(JSON.stringify(toonToJson(configToon), null, 2));

// Example 4: Using ToonConverter class
console.log('\n=== Example 4: ToonConverter Class ===');
const data = {
  products: [
    { sku: 'A001', name: 'Widget', price: 19.99 },
    { sku: 'A002', name: 'Gadget', price: 29.99 },
  ],
};

const toon = ToonConverter.toToon(data);
console.log('TOON format:');
console.log(toon);

const json = ToonConverter.toJson(toon);
console.log('\nJSON format:');
console.log(JSON.stringify(json, null, 2));

// Example 5: Token savings comparison
console.log('\n=== Example 5: Token Savings ===');
const largeData = {
  items: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: (i + 1) * 10,
    active: i % 2 === 0,
  })),
};

const jsonStr = JSON.stringify(largeData);
const toonStr = jsonToToon(largeData);

console.log(`JSON size: ${jsonStr.length} characters`);
console.log(`TOON size: ${toonStr.length} characters`);
console.log(`Savings: ${((jsonStr.length - toonStr.length) / jsonStr.length * 100).toFixed(1)}%`);

// Example 6: Custom options
console.log('\n=== Example 6: Custom Options ===');
import { ToonEncoder, ToonDecoder } from '../src/index';

const customEncoder = new ToonEncoder({
  indent: 4,
  alignColumns: true,
});

const customToon = customEncoder.encode(users);
console.log('TOON with custom indent (4 spaces):');
console.log(customToon);

const customDecoder = new ToonDecoder({
  preserveNumbers: false,
  preserveBooleans: false,
});

const customJson = customDecoder.decode('  value 42\n  active true');
console.log('\nDecoded with type preservation disabled:');
console.log(customJson); // { value: '42', active: 'true' }
