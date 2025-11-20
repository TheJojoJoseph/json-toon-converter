# Sample Code Guide for @jojojoseph/toon-json-converter

This guide provides comprehensive sample code for using the TOON JSON Converter package.

## 📦 Installation

```bash
npm install @jojojoseph/toon-json-converter
```

## 🚀 Quick Start (30 seconds)

```typescript
import { jsonToToon, toonToJson } from '@jojojoseph/toon-json-converter';

// Convert JSON to TOON
const data = { name: 'Alice', age: 30, active: true };
const toon = jsonToToon(data);
console.log(toon);
// Output:
// name: Alice
// age: 30
// active: true

// Convert TOON back to JSON
const json = toonToJson(toon);
console.log(json); // { name: 'Alice', age: 30, active: true }
```

## 📚 Available Examples

### 1. **quick-start.ts** - For Beginners
Perfect for getting started quickly with 5 essential examples.

**Run it:**
```bash
npm run example:quick
```

**What it covers:**
- Basic JSON ↔ TOON conversion
- Array of objects (table format)
- Token savings calculation
- LLM prompt optimization
- Nested objects

### 2. **comprehensive-sample.ts** - For Advanced Users
Complete showcase of all features with 15 detailed examples.

**Run it:**
```bash
npm run example:comprehensive
```

**What it covers:**
1. Basic conversions
2. Array of objects (table format)
3. Nested objects
4. Arrays of primitives
5. Mixed arrays
6. Multiline strings
7. Special characters and quoting
8. Using ToonConverter class
9. Custom encoding options
10. Custom decoding options
11. Real-world use case: LLM prompt optimization
12. Empty structures
13. Complex nested structures
14. Performance comparison
15. Error handling

### 3. **nodejs-app-example.ts** - For Real-World Applications
Shows integration into Node.js applications.

**Run it:**
```bash
npm run example:nodejs
```

**What it covers:**
- REST API with TOON support
- File storage and caching
- LLM integration
- Data validation and processing
- Configuration management
- Logging and monitoring
- Data export

### 4. **basic-usage.ts** - Original Examples
Core functionality examples.

**Run it:**
```bash
npm run example:basic
```

## 💡 Common Use Cases

### Use Case 1: Optimize LLM Prompts (Save 30-60% Tokens)

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';

const customerData = {
  customers: [
    { id: 1, name: 'TechCorp', revenue: 50000, active: true },
    { id: 2, name: 'DataInc', revenue: 75000, active: true },
  ]
};

// ❌ Don't do this (verbose, expensive)
const jsonPrompt = `Analyze:\n${JSON.stringify(customerData, null, 2)}`;

// ✅ Do this (compact, cheaper)
const toonPrompt = `Analyze:\n${jsonToToon(customerData)}`;

// Result: 30-60% fewer tokens = lower API costs!
```

### Use Case 2: API Response Format Negotiation

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';

// Express.js example
app.get('/api/data', (req, res) => {
  const data = getData();
  
  if (req.query.format === 'toon') {
    res.type('text/plain').send(jsonToToon(data));
  } else {
    res.json(data);
  }
});
```

### Use Case 3: Compact Data Storage

```typescript
import { jsonToToon, toonToJson } from '@jojojoseph/toon-json-converter';
import fs from 'fs';

// Save data in TOON format (smaller files)
const data = { /* your data */ };
fs.writeFileSync('data.toon', jsonToToon(data));

// Load data
const toonData = fs.readFileSync('data.toon', 'utf-8');
const loadedData = toonToJson(toonData);
```

### Use Case 4: Configuration Files

```typescript
import { jsonToToon, toonToJson } from '@jojojoseph/toon-json-converter';

// config.toon (more readable than JSON)
const configToon = `
app:
  name: MyApp
  version: 1.0.0
server:
  host: localhost
  port: 8080
`;

const config = toonToJson(configToon);
```

### Use Case 5: Data Validation

```typescript
import { ToonConverter } from '@jojojoseph/toon-json-converter';

const toonString = 'name: Alice\nage: 30';

// Check if valid
if (ToonConverter.isValid(toonString)) {
  const data = ToonConverter.toJson(toonString);
  // Process data
}

// Get detailed validation
const validation = ToonConverter.validate(toonString);
if (!validation.valid) {
  console.error('Invalid TOON:', validation.error);
}
```

## 🎯 API Reference

### Functions

```typescript
// Convert JSON to TOON
jsonToToon(data: JsonValue, options?: ToonEncodeOptions): string

// Convert TOON to JSON
toonToJson(toon: string, options?: ToonDecodeOptions): JsonValue
```

### Classes

```typescript
// ToonConverter - Static methods
ToonConverter.toToon(data, options)
ToonConverter.toJson(toon, options)
ToonConverter.isValid(toon)
ToonConverter.validate(toon)

// ToonEncoder - Custom encoding
const encoder = new ToonEncoder({ indent: 4 });
const toon = encoder.encode(data);

// ToonDecoder - Custom decoding
const decoder = new ToonDecoder({ preserveNumbers: true });
const json = decoder.decode(toon);
```

### Options

**ToonEncodeOptions:**
```typescript
{
  indent?: number;              // Spaces for indentation (default: 2)
  delimiter?: ',' | '\t' | '|'; // Array delimiter (default: ',')
  enableKeyFolding?: boolean;   // Enable key folding (default: false)
  flattenDepth?: number;        // Max depth for folding (default: Infinity)
}
```

**ToonDecodeOptions:**
```typescript
{
  preserveNumbers?: boolean;    // Parse numbers (default: true)
  preserveBooleans?: boolean;   // Parse booleans (default: true)
  expandPaths?: boolean;        // Expand folded keys (default: false)
  strict?: boolean;             // Throw on errors (default: true)
}
```

## 📊 Format Examples

### Simple Object
```typescript
// JSON
{ "name": "Alice", "age": 30 }

// TOON
name: Alice
age: 30
```

### Array of Objects (Table Format)
```typescript
// JSON
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}

// TOON (much more compact!)
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

### Nested Objects
```typescript
// JSON
{
  "app": {
    "name": "MyApp",
    "server": {
      "host": "localhost",
      "port": 8080
    }
  }
}

// TOON
app:
  name: MyApp
  server:
    host: localhost
    port: 8080
```

### Arrays of Primitives
```typescript
// JSON
{ "tags": ["ai", "ml", "data"] }

// TOON
tags[3]: ai,ml,data
```

## 🔧 Running Examples

```bash
# Run quick start example
npm run example:quick

# Run comprehensive examples
npm run example:comprehensive

# Run Node.js application example
npm run example:nodejs

# Run basic usage examples
npm run example:basic

# Run all examples (quick start by default)
npm run examples
```

## 📈 Performance Benefits

### Token Reduction
- **Simple objects**: 30% fewer tokens
- **Arrays of objects**: 50% fewer tokens
- **Complex nested data**: 55% fewer tokens

### File Size Reduction
- **100 records**: 46% smaller
- **1000 records**: 46% smaller

### Real-World Impact
- **Lower LLM API costs**: Pay for fewer tokens
- **Faster data transfer**: Smaller payloads
- **Reduced storage**: Compact file format
- **Better readability**: Human-friendly format

## 🔗 Resources

- **NPM Package**: https://www.npmjs.com/package/@jojojoseph/toon-json-converter
- **GitHub Repository**: https://github.com/TheJojoJoseph/json-toon-converter
- **TOON Format Spec**: https://github.com/toon-format/toon
- **Examples Folder**: `/examples` directory in this repository

## 💬 Support

- **Issues**: https://github.com/TheJojoJoseph/json-toon-converter/issues
- **Discussions**: https://github.com/TheJojoJoseph/json-toon-converter/discussions

## 📝 License

MIT

---

**Happy coding with TOON! 🎉**

Save tokens, save money, save time.
