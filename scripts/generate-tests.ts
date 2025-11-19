/**
 * Script to parse test.yaml and generate test cases
 */

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

interface TestCase {
  input_json: string;
  expected_toon: string;
}

interface TestData {
  test_cases: Record<string, TestCase>;
}

// Read and parse the YAML file
const yamlPath = path.join(__dirname, '../src/test.yaml');
const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const testData = yaml.load(yamlContent) as TestData;

// Generate test file content
let testContent = `/**
 * Generated tests from test.yaml
 */

import { jsonToToon, toonToJson } from '../src/index';

describe('TOON Format Tests from test.yaml', () => {
`;

// Generate a test for each case
for (const [testName, testCase] of Object.entries(testData.test_cases)) {
  const inputJson = testCase.input_json.trim();
  const expectedToon = testCase.expected_toon.trim();
  
  // Create a readable test name
  const readableName = testName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  testContent += `
  describe('${readableName}', () => {
    const inputJson = ${JSON.stringify(inputJson)};
    const expectedToon = ${JSON.stringify(expectedToon)};

    test('encode: ${testName}', () => {
      const data = JSON.parse(inputJson);
      const toon = jsonToToon(data);
      
      // Normalize whitespace for comparison
      const normalizedToon = toon.trim().replace(/\\s+/g, ' ');
      const normalizedExpected = expectedToon.trim().replace(/\\s+/g, ' ');
      
      expect(normalizedToon).toBe(normalizedExpected);
    });

    test('decode: ${testName}', () => {
      const json = toonToJson(expectedToon);
      const originalData = JSON.parse(inputJson);
      
      expect(json).toEqual(originalData);
    });

    test('round-trip: ${testName}', () => {
      const originalData = JSON.parse(inputJson);
      const toon = jsonToToon(originalData);
      const decoded = toonToJson(toon);
      
      expect(decoded).toEqual(originalData);
    });
  });
`;
}

testContent += `});
`;

// Write the test file
const outputPath = path.join(__dirname, '../__tests__/yaml-tests.test.ts');
fs.writeFileSync(outputPath, testContent);

console.log(`Generated test file: ${outputPath}`);
console.log(`Total test cases: ${Object.keys(testData.test_cases).length}`);
console.log(`Total tests: ${Object.keys(testData.test_cases).length * 3}`);
