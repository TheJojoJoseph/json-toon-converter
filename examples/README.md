# TOON JSON Converter - Examples

This folder contains example code demonstrating how to use the `@jojojoseph/toon-json-converter` package.

## 📁 Files

### `quick-start.ts`
**Best for: Beginners**

A minimal quick-start guide with 5 essential examples:
- Basic JSON ↔ TOON conversion
- Array of objects (table format)
- Token savings calculation
- LLM prompt optimization
- Nested objects

**Run it:**
```bash
npm run build
npx ts-node examples/quick-start.ts
```

### `comprehensive-sample.ts`
**Best for: Advanced users**

A complete showcase of all features with 15 detailed examples:
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

**Run it:**
```bash
npm run build
npx ts-node examples/comprehensive-sample.ts
```

### `basic-usage.ts`
**Best for: Package developers**

Original examples showing core functionality.

**Run it:**
```bash
npm run build
npx ts-node examples/basic-usage.ts
```

## 🚀 Quick Examples

### Convert JSON to TOON

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';

const data = {
  name: 'Alice',
  age: 30,
  active: true
};

const toon = jsonToToon(data);
console.log(toon);
// Output:
// name: Alice
// age: 30
// active: true
```

### Convert TOON to JSON

```typescript
import { toonToJson } from '@jojojoseph/toon-json-converter';

const toon = `name: Alice
age: 30
active: true`;

const json = toonToJson(toon);
console.log(json);
// Output: { name: 'Alice', age: 30, active: true }
```

### Array of Objects (The Power of TOON!)

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';

const data = {
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
  ]
};

const toon = jsonToToon(data);
console.log(toon);
// Output:
// users[2]{id,name,role}:
//   1,Alice,admin
//   2,Bob,user
```

**Notice how compact this is compared to JSON!**

## 💡 Use Cases

### 1. LLM Prompt Optimization

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';

const customerData = { /* your data */ };

// Instead of verbose JSON
const prompt = `Analyze this data:\n${JSON.stringify(customerData, null, 2)}`;

// Use compact TOON (30-60% fewer tokens!)
const toonPrompt = `Analyze this data:\n${jsonToToon(customerData)}`;
```

### 2. API Responses for AI Applications

```typescript
app.get('/api/data', (req, res) => {
  const data = getData();
  
  if (req.query.format === 'toon') {
    res.type('text/plain').send(jsonToToon(data));
  } else {
    res.json(data);
  }
});
```

### 3. Training Data Storage

```typescript
import { jsonToToon } from '@jojojoseph/toon-json-converter';
import fs from 'fs';

const trainingData = loadTrainingData();
fs.writeFileSync('data.toon', jsonToToon(trainingData));
```

## 🎯 Key Features Demonstrated

- ✅ **Simple conversions** - Basic JSON ↔ TOON
- ✅ **Table format** - Compact representation of uniform arrays
- ✅ **Nested objects** - Deep hierarchical structures
- ✅ **Type preservation** - Numbers, booleans, null
- ✅ **Custom options** - Indentation, delimiters, etc.
- ✅ **Validation** - Check TOON format validity
- ✅ **Error handling** - Graceful error management
- ✅ **Performance** - Fast encoding/decoding

## 📊 Token Savings

TOON format typically saves **30-60% tokens** compared to JSON:

| Data Type | JSON Size | TOON Size | Savings |
|-----------|-----------|-----------|---------|
| Simple object | 100 chars | 70 chars | 30% |
| Array of 10 objects | 500 chars | 250 chars | 50% |
| Complex nested | 1000 chars | 450 chars | 55% |

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/@jojojoseph/toon-json-converter
- **GitHub**: https://github.com/TheJojoJoseph/json-toon-converter
- **TOON Format Spec**: https://github.com/toon-format/toon

## 📝 License

MIT
