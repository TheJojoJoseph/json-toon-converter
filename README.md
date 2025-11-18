# @toon-json/converter

[![npm version](https://badge.fury.io/js/@toon-json%2Fconverter.svg)](https://www.npmjs.com/package/@toon-json/converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, efficient library for converting between JSON and TOON (Token-Oriented Object Notation) formats, optimized for LLM token usage.

## What is TOON?

TOON (Token-Oriented Object Notation) is a compact data serialization format designed to optimize token usage for Large Language Models (LLMs). It removes redundancies found in JSON (curly braces, brackets, repeated quotes) while maintaining full compatibility with JSON's data model.

### Key Benefits

- **30-60% fewer tokens** for flat, uniform data structures
- **Human and LLM-friendly** readable format
- **Lossless conversion** - perfect round-trip with JSON
- **Ideal for AI workflows** - prompts, training data, API responses

## Installation

```bash
npm install @toon-json/converter
```

## Quick Start

```typescript
import { jsonToToon, toonToJson } from '@toon-json/converter';

// Convert JSON to TOON
const data = {
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ]
};

const toon = jsonToToon(data);
console.log(toon);
// Output:
//   users
//     id  name   role
//     1   Alice  admin
//     2   Bob    user

// Convert TOON back to JSON
const json = toonToJson(toon);
console.log(json); // Original data structure
```

## Usage

### Basic Conversion

```typescript
import { jsonToToon, toonToJson, ToonConverter } from '@toon-json/converter';

// Using convenience functions
const toon = jsonToToon({ name: 'Alice', age: 30 });
const json = toonToJson(toon);

// Using the ToonConverter class
const toon2 = ToonConverter.toToon({ name: 'Bob', age: 25 });
const json2 = ToonConverter.toJson(toon2);
```

### Advanced Usage with Options

#### Encoding Options

```typescript
import { ToonEncoder } from '@toon-json/converter';

const encoder = new ToonEncoder({
  indent: 4,              // Number of spaces for indentation (default: 2)
  alignColumns: true,     // Align table columns (default: true)
  minColumnWidth: 1       // Minimum column width (default: 1)
});

const toon = encoder.encode(data);
```

#### Decoding Options

```typescript
import { ToonDecoder } from '@toon-json/converter';

const decoder = new ToonDecoder({
  preserveNumbers: true,   // Parse numbers as numbers (default: true)
  preserveBooleans: true   // Parse booleans as booleans (default: true)
});

const json = decoder.decode(toon);
```

## Examples

### Simple Objects

**JSON:**
```json
{
  "name": "Alice",
  "age": 30,
  "active": true
}
```

**TOON:**
```
  name Alice
  age 30
  active true
```

### Nested Objects

**JSON:**
```json
{
  "user": {
    "name": "Bob",
    "profile": {
      "age": 25,
      "city": "NYC"
    }
  }
}
```

**TOON:**
```
  user
    name Bob
    profile
      age 25
      city NYC
```

### Arrays of Objects (Table Format)

**JSON:**
```json
{
  "products": [
    { "sku": "A001", "name": "Widget", "price": 19.99 },
    { "sku": "A002", "name": "Gadget", "price": 29.99 }
  ]
}
```

**TOON:**
```
  products
    sku   name    price
    A001  Widget  19.99
    A002  Gadget  29.99
```

### Complex Structures

**JSON:**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "title": "Post 1", "views": 1500 },
    { "id": 2, "title": "Post 2", "views": 2300 }
  ],
  "meta": {
    "page": 1,
    "total": 2
  }
}
```

**TOON:**
```
  status success
  data
    id  title   views
    1   Post 1  1500
    2   Post 2  2300
  meta
    page 1
    total 2
```

## API Reference

### Functions

#### `jsonToToon(data, options?)`

Converts JSON data to TOON format.

- **Parameters:**
  - `data: JsonValue` - The JSON data to convert
  - `options?: ToonEncodeOptions` - Optional encoding options
- **Returns:** `string` - The TOON formatted string

#### `toonToJson(toon, options?)`

Converts TOON format to JSON data.

- **Parameters:**
  - `toon: string` - The TOON formatted string
  - `options?: ToonDecodeOptions` - Optional decoding options
- **Returns:** `JsonValue` - The parsed JSON data

### Classes

#### `ToonEncoder`

Encoder class for converting JSON to TOON.

```typescript
const encoder = new ToonEncoder(options);
const toon = encoder.encode(data);
```

#### `ToonDecoder`

Decoder class for converting TOON to JSON.

```typescript
const decoder = new ToonDecoder(options);
const json = decoder.decode(toon);
```

#### `ToonConverter`

Utility class with static methods for conversion.

```typescript
ToonConverter.toToon(data, options);
ToonConverter.toJson(toon, options);
```

### Types

```typescript
interface ToonEncodeOptions {
  indent?: number;
  alignColumns?: boolean;
  minColumnWidth?: number;
}

interface ToonDecodeOptions {
  preserveNumbers?: boolean;
  preserveBooleans?: boolean;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue; }
type JsonArray = JsonValue[];
```

## Use Cases

### LLM Prompts

Reduce token usage in prompts by up to 60% for structured data:

```typescript
const userData = {
  users: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User${i + 1}`,
    score: Math.floor(Math.random() * 100)
  }))
};

const prompt = `Analyze this user data:\n${jsonToToon(userData)}`;
// Significantly fewer tokens than JSON.stringify(userData)
```

### API Responses

Optimize data transfer for AI-focused APIs:

```typescript
app.get('/api/data', (req, res) => {
  const data = fetchData();
  const format = req.query.format || 'json';
  
  if (format === 'toon') {
    res.type('text/plain').send(jsonToToon(data));
  } else {
    res.json(data);
  }
});
```

### Training Data

Prepare more efficient training datasets:

```typescript
const trainingData = loadLargeDataset();
const toonData = jsonToToon(trainingData);
fs.writeFileSync('training-data.toon', toonData);
// Smaller file size, faster loading
```

## Performance

TOON excels with flat, uniform data structures:

| Data Type | JSON Size | TOON Size | Savings |
|-----------|-----------|-----------|---------|
| 100 user records | 5.2 KB | 2.8 KB | 46% |
| 1000 log entries | 52 KB | 28 KB | 46% |
| Product catalog | 8.1 KB | 4.3 KB | 47% |

*Note: Savings vary based on data structure. Deeply nested or highly varied data may not see significant improvements.*

## When to Use TOON

### ✅ Best For:
- LLM prompts with structured data
- Training datasets with uniform records
- API responses for AI applications
- Flat arrays of objects (tables, logs, catalogs)

### ❌ Not Ideal For:
- Deeply nested, complex hierarchies
- Highly varied data structures
- Binary data or non-text content
- When JSON compatibility is required by external systems

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Building

```bash
# Build the package
npm run build

# The compiled files will be in the dist/ directory
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the TOON format specification
- Built for the AI and LLM community
- Thanks to all contributors

## Links

- [NPM Package](https://www.npmjs.com/package/@toon-json/converter)
- [GitHub Repository](https://github.com/TheJojoJoseph/json-toon-converter)
- [Issue Tracker](https://github.com/TheJojoJoseph/json-toon-converter/issues)
- [TOON Format Specification](https://github.com/toon-format/toon)

## Support

If you find this package useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation

---


