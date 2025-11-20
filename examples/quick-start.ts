/**
 * Quick Start Guide for @jojojoseph/toon-json-converter
 * 
 * This is a minimal example to get you started quickly.
 */

import { jsonToToon, toonToJson } from '../src/index';

// ============================================================================
// EXAMPLE 1: Basic Conversion
// ============================================================================

console.log('=== Example 1: Basic Conversion ===\n');

const user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  active: true,
};

// Convert JSON to TOON
const toonFormat = jsonToToon(user);
console.log('TOON format:');
console.log(toonFormat);
// Output:
// name: Alice
// age: 30
// email: alice@example.com
// active: true

// Convert TOON back to JSON
const jsonFormat = toonToJson(toonFormat);
console.log('\nBack to JSON:');
console.log(jsonFormat);

// ============================================================================
// EXAMPLE 2: Array of Objects (The Power of TOON!)
// ============================================================================

console.log('\n\n=== Example 2: Array of Objects ===\n');

const data = {
  employees: [
    { id: 1, name: 'Alice', dept: 'Engineering', salary: 95000 },
    { id: 2, name: 'Bob', dept: 'Marketing', salary: 75000 },
    { id: 3, name: 'Carol', dept: 'Engineering', salary: 105000 },
  ],
};

const toon = jsonToToon(data);
console.log('TOON format (notice the compact table):');
console.log(toon);
// Output:
// employees[3]{id,name,dept,salary}:
//   1,Alice,Engineering,95000
//   2,Bob,Marketing,75000
//   3,Carol,Engineering,105000

// ============================================================================
// EXAMPLE 3: Token Savings
// ============================================================================

console.log('\n\n=== Example 3: Token Savings ===\n');

const jsonString = JSON.stringify(data);
const toonString = jsonToToon(data);

console.log('JSON size:', jsonString.length, 'characters');
console.log('TOON size:', toonString.length, 'characters');
console.log('Savings:', ((jsonString.length - toonString.length) / jsonString.length * 100).toFixed(1) + '%');

// ============================================================================
// EXAMPLE 4: Use in LLM Prompts
// ============================================================================

console.log('\n\n=== Example 4: Use in LLM Prompts ===\n');

const customerData = {
  customers: [
    { id: 1, name: 'TechCorp', revenue: 50000, active: true },
    { id: 2, name: 'DataInc', revenue: 75000, active: true },
    { id: 3, name: 'CloudCo', revenue: 60000, active: false },
  ],
};

// Instead of this (verbose JSON):
const jsonPrompt = `Analyze these customers:\n${JSON.stringify(customerData, null, 2)}`;

// Use this (compact TOON):
const toonPrompt = `Analyze these customers:\n${jsonToToon(customerData)}`;

console.log('JSON Prompt:');
console.log(jsonPrompt);
console.log('\n' + '='.repeat(60) + '\n');
console.log('TOON Prompt:');
console.log(toonPrompt);

console.log('\nToken reduction:', ((jsonPrompt.length - toonPrompt.length) / jsonPrompt.length * 100).toFixed(1) + '%');

// ============================================================================
// EXAMPLE 5: Nested Objects
// ============================================================================

console.log('\n\n=== Example 5: Nested Objects ===\n');

const config = {
  app: {
    name: 'MyApp',
    version: '1.0.0',
    server: {
      host: 'localhost',
      port: 8080,
    },
  },
};

const configToon = jsonToToon(config);
console.log('TOON format:');
console.log(configToon);
// Output:
// app:
//   name: MyApp
//   version: 1.0.0
//   server:
//     host: localhost
//     port: 8080

console.log('\n✅ That\'s it! You\'re ready to use TOON format.');
console.log('📚 Check comprehensive-sample.ts for more advanced examples.');
