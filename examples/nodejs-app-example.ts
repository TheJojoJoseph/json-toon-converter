/**
 * Node.js Application Example
 * 
 * This example shows how to integrate TOON format into a real Node.js application
 * for API responses, file storage, and LLM interactions.
 */

import { jsonToToon, toonToJson, ToonConverter } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// SCENARIO 1: REST API with TOON Support
// ============================================================================

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 1: REST API with TOON Support                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Simulated database
const database = {
  users: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', active: true },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user', active: false },
  ],
  products: [
    { sku: 'PROD-001', name: 'Laptop', price: 999.99, stock: 15 },
    { sku: 'PROD-002', name: 'Mouse', price: 29.99, stock: 50 },
    { sku: 'PROD-003', name: 'Keyboard', price: 79.99, stock: 30 },
  ],
};

// Simulated API endpoint handler
function handleApiRequest(endpoint: string, format: 'json' | 'toon' = 'json') {
  let data;
  
  if (endpoint === '/api/users') {
    data = { users: database.users };
  } else if (endpoint === '/api/products') {
    data = { products: database.products };
  } else {
    return { error: 'Not found' };
  }
  
  if (format === 'toon') {
    return {
      contentType: 'text/plain',
      body: jsonToToon(data),
    };
  } else {
    return {
      contentType: 'application/json',
      body: JSON.stringify(data, null, 2),
    };
  }
}

// Example API calls
console.log('GET /api/users?format=toon');
console.log('-'.repeat(60));
const toonResponse = handleApiRequest('/api/users', 'toon');
console.log(toonResponse.body);

console.log('\nGET /api/products?format=json');
console.log('-'.repeat(60));
const jsonResponse = handleApiRequest('/api/products', 'json');
console.log(jsonResponse.body);

// ============================================================================
// SCENARIO 2: File Storage and Caching
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 2: File Storage and Caching                        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Create a cache directory (in memory for this example)
const cacheDir = path.join(__dirname, '../.cache');

// Function to save data to cache
function saveToCache(key: string, data: unknown): void {
  const toonData = jsonToToon(data);
  console.log(`Saving to cache: ${key}`);
  console.log(`Size: ${toonData.length} bytes (TOON) vs ${JSON.stringify(data).length} bytes (JSON)`);
  console.log(`Savings: ${((JSON.stringify(data).length - toonData.length) / JSON.stringify(data).length * 100).toFixed(1)}%`);
  
  // In a real app, you would write to file:
  // fs.writeFileSync(path.join(cacheDir, `${key}.toon`), toonData);
}

// Function to load data from cache
function loadFromCache(key: string, toonData: string): unknown {
  console.log(`Loading from cache: ${key}`);
  const data = toonToJson(toonData);
  return data;
}

// Example usage
const cacheData = {
  timestamp: new Date().toISOString(),
  data: database.users,
};

saveToCache('users', cacheData);

// Simulate loading
const cachedToon = jsonToToon(cacheData);
const loadedData = loadFromCache('users', cachedToon);
console.log('Loaded data:', loadedData);

// ============================================================================
// SCENARIO 3: LLM Integration
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 3: LLM Integration                                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Function to create an LLM prompt with data
function createLLMPrompt(task: string, data: unknown, format: 'json' | 'toon' = 'toon'): string {
  const dataString = format === 'toon' 
    ? jsonToToon(data)
    : JSON.stringify(data, null, 2);
  
  return `Task: ${task}\n\nData:\n${dataString}\n\nPlease analyze the data and provide insights.`;
}

const analysisData = {
  sales: [
    { month: 'Jan', revenue: 45000, customers: 120 },
    { month: 'Feb', revenue: 52000, customers: 135 },
    { month: 'Mar', revenue: 48000, customers: 128 },
  ],
};

const toonPrompt = createLLMPrompt('Analyze monthly sales trends', analysisData, 'toon');
const jsonPrompt = createLLMPrompt('Analyze monthly sales trends', analysisData, 'json');

console.log('TOON Prompt:');
console.log(toonPrompt);
console.log('\nPrompt size comparison:');
console.log(`TOON: ${toonPrompt.length} characters`);
console.log(`JSON: ${jsonPrompt.length} characters`);
console.log(`Token savings: ${((jsonPrompt.length - toonPrompt.length) / jsonPrompt.length * 100).toFixed(1)}%`);

// ============================================================================
// SCENARIO 4: Data Validation and Processing
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 4: Data Validation and Processing                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Function to validate and process incoming TOON data
function processIncomingData(toonString: string): { success: boolean; data?: unknown; error?: string } {
  // Validate TOON format
  const validation = ToonConverter.validate(toonString);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }
  
  // Parse TOON data
  const data = toonToJson(toonString);
  
  return {
    success: true,
    data,
  };
}

// Example: Valid TOON data
const validToon = `name: John Doe
age: 35
email: john@example.com`;

console.log('Processing valid TOON data:');
const result1 = processIncomingData(validToon);
console.log('Result:', result1);

// Example: Invalid TOON data
const invalidToon = `name: John
age: [unclosed`;

console.log('\nProcessing invalid TOON data:');
const result2 = processIncomingData(invalidToon);
console.log('Result:', result2);

// ============================================================================
// SCENARIO 5: Configuration Management
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 5: Configuration Management                        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Application configuration
const appConfig = {
  app: {
    name: 'MyApp',
    version: '2.0.0',
    environment: 'production',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    ssl: true,
  },
  database: {
    host: 'db.example.com',
    port: 5432,
    name: 'myapp_db',
    pool: {
      min: 2,
      max: 10,
    },
  },
  features: {
    authentication: true,
    analytics: true,
    caching: true,
  },
  limits: {
    maxRequestSize: 10485760, // 10MB
    rateLimit: 100,
    timeout: 30000,
  },
};

// Save config in TOON format (more readable than JSON)
const configToon = jsonToToon(appConfig);
console.log('Configuration in TOON format:');
console.log(configToon);

// Function to load and merge configs
function loadConfig(defaultConfig: unknown, userConfigToon?: string): unknown {
  if (!userConfigToon) {
    return defaultConfig;
  }
  
  const userConfig = toonToJson(userConfigToon);
  // In a real app, you would merge configs here
  return { ...defaultConfig, ...userConfig };
}

// ============================================================================
// SCENARIO 6: Logging and Monitoring
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 6: Logging and Monitoring                          ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Log entry structure
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
}

const logs: LogEntry[] = [
  {
    timestamp: '2024-01-15T10:30:00Z',
    level: 'info',
    message: 'Server started',
    metadata: { port: 3000, pid: 12345 },
  },
  {
    timestamp: '2024-01-15T10:31:00Z',
    level: 'warn',
    message: 'High memory usage',
    metadata: { usage: 85, threshold: 80 },
  },
  {
    timestamp: '2024-01-15T10:32:00Z',
    level: 'error',
    message: 'Database connection failed',
    metadata: { host: 'db.example.com', attempts: 3 },
  },
];

// Store logs in TOON format (more compact)
const logsToon = jsonToToon({ logs });
console.log('Logs in TOON format:');
console.log(logsToon);

console.log('\nStorage comparison:');
console.log(`JSON: ${JSON.stringify({ logs }).length} bytes`);
console.log(`TOON: ${logsToon.length} bytes`);
console.log(`Savings: ${((JSON.stringify({ logs }).length - logsToon.length) / JSON.stringify({ logs }).length * 100).toFixed(1)}%`);

// ============================================================================
// SCENARIO 7: Data Export
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SCENARIO 7: Data Export                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Function to export data in multiple formats
function exportData(data: unknown, format: 'json' | 'toon' | 'both' = 'both'): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  if (format === 'json' || format === 'both') {
    const jsonData = JSON.stringify(data, null, 2);
    const filename = `export-${timestamp}.json`;
    console.log(`Exporting to ${filename} (${jsonData.length} bytes)`);
    // fs.writeFileSync(filename, jsonData);
  }
  
  if (format === 'toon' || format === 'both') {
    const toonData = jsonToToon(data);
    const filename = `export-${timestamp}.toon`;
    console.log(`Exporting to ${filename} (${toonData.length} bytes)`);
    // fs.writeFileSync(filename, toonData);
  }
}

const exportData1 = {
  report: 'Monthly Sales',
  period: '2024-01',
  data: database.products,
};

exportData(exportData1, 'both');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  SUMMARY                                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('✅ Use Cases Demonstrated:');
console.log('   1. REST API with format negotiation (JSON/TOON)');
console.log('   2. File storage and caching (smaller files)');
console.log('   3. LLM integration (30-60% token reduction)');
console.log('   4. Data validation and processing');
console.log('   5. Configuration management (readable format)');
console.log('   6. Logging and monitoring (compact storage)');
console.log('   7. Data export (multiple format support)');
console.log('\n💡 Key Benefits:');
console.log('   • Reduced storage costs');
console.log('   • Faster data transfer');
console.log('   • Lower LLM API costs');
console.log('   • Human-readable format');
console.log('   • Easy integration');
console.log('\n📦 Package: @jojojoseph/toon-json-converter');
console.log('🔗 GitHub: https://github.com/TheJojoJoseph/json-toon-converter\n');
