# @toon-json/converter

A lightweight library for converting between JSON and TOON (Token-Oriented Object Notation) - a compact format that uses **30-60% fewer tokens** for LLMs.

## Installation

```bash
npm install @toon-json/converter
```

## Basic Usage

```typescript
import { jsonToToon, toonToJson } from '@toon-json/converter';

const data = { name: 'Alice', age: 30, active: true };

const toon = jsonToToon(data);
// name: Alice
// age: 30
// active: true

const json = toonToJson(toon);
// { name: 'Alice', age: 30, active: true }
```

## Examples

### Simple Object

```typescript
jsonToToon({ name: 'Bob', city: 'NYC' });
```
```
name: Bob
city: NYC
```

### Nested Object

```typescript
jsonToToon({
  user: {
    profile: { age: 25, city: 'NYC' }
  }
});
```
```
user:
  profile:
    age: 25
    city: NYC
```

### Array of Objects (Tables)

```typescript
jsonToToon({
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ]
});
```
```
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

### Arrays

```typescript
jsonToToon({ tags: ['ai', 'ml', 'data'] });
```
```
tags[3]: ai,ml,data
```

### Mixed Arrays

```typescript
jsonToToon({
  items: [
    'red',
    { id: 1, label: 'blue' },
    42
  ]
});
```
```
items:
  - "red"
  - id: 1
    label: blue
  - 42
```

### Complex Structure

```typescript
jsonToToon({
  status: 'success',
  data: [
    { id: 1, title: 'Post 1', views: 1500 },
    { id: 2, title: 'Post 2', views: 2300 }
  ],
  meta: { page: 1, total: 2 }
});
```
```
status: success
data[2]{id,title,views}:
  1,"Post 1",1500
  2,"Post 2",2300
meta:
  page: 1
  total: 2
```

### Multiline Strings

```typescript
jsonToToon({ bio: 'Line1\nLine2\nLine3' });
```
```
bio: |
  Line1
  Line2
  Line3
```

### Empty Structures

```typescript
jsonToToon({ emptyObj: {}, emptyArr: [] });
```
```
emptyObj: {}
emptyArr: []
```

### Special Characters

```typescript
jsonToToon({
  quote: 'He said "Hi"',
  jsonChars: '{value}: [1,2]'
});
```
```
quote: "He said \"Hi\""
jsonChars: "{value}: [1,2]"
```

## Advanced Usage

### Custom Options

```typescript
import { ToonEncoder, ToonDecoder } from '@toon-json/converter';

// Encoding options
const encoder = new ToonEncoder({
  indent: 4,           // spaces for indentation (default: 2)
  alignColumns: true,  // align table columns (default: true)
  minColumnWidth: 1    // minimum column width (default: 1)
});

const toon = encoder.encode(data);

// Decoding options
const decoder = new ToonDecoder({
  preserveNumbers: true,   // parse numbers as numbers (default: true)
  preserveBooleans: true   // parse booleans as booleans (default: true)
});

const json = decoder.decode(toon);
```

## Use Cases

**LLM Prompts** - Reduce tokens by up to 60%:
```typescript
const prompt = `Analyze this data:\n${jsonToToon(userData)}`;
```

**API Responses** - Optimize for AI applications:
```typescript
app.get('/api/data', (req, res) => {
  if (req.query.format === 'toon') {
    res.type('text/plain').send(jsonToToon(data));
  } else {
    res.json(data);
  }
});
```

**Training Data** - Smaller, faster datasets:
```typescript
fs.writeFileSync('data.toon', jsonToToon(trainingData));
```

## When to Use TOON

✅ **Best for:**
- LLM prompts with structured data
- Uniform arrays (tables, logs, catalogs)
- Training datasets
- AI-focused APIs

❌ **Not ideal for:**
- Deeply nested hierarchies
- Highly varied data structures
- When JSON compatibility is required

## Token Savings

| Data Type | JSON | TOON | Savings |
|-----------|------|------|---------|
| 100 user records | 5.2 KB | 2.8 KB | 46% |
| 1000 log entries | 52 KB | 28 KB | 46% |

## API Reference

```typescript
// Convert JSON to TOON
jsonToToon(data: JsonValue, options?: ToonEncodeOptions): string

// Convert TOON to JSON
toonToJson(toon: string, options?: ToonDecodeOptions): JsonValue

// Class-based API
ToonConverter.toToon(data, options)
ToonConverter.toJson(toon, options)
```

## Links

- [NPM Package](https://www.npmjs.com/package/@toon-json/converter)
- [GitHub Repository](https://github.com/TheJojoJoseph/json-toon-converter)
- [TOON Format Spec](https://github.com/toon-format/toon)

## License

MIT