# TOON Format Examples

This document shows examples of JSON to TOON conversion using this package.

## Basic Examples

### Simple Object
```json
{ "name": "Alice", "age": 30, "active": true }
```
```toon
name: Alice
age: 30
active: true
```

### Nested Object
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
```toon
user:
  name: Bob
  profile:
    age: 25
    city: NYC
```

## Array Examples

### Primitive Array
```json
{ "tags": ["admin", "ops", "dev"] }
```
```toon
tags[3]: admin,ops,dev
```

### Tabular Array (Uniform Objects)
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}
```
```toon
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

### Mixed Array
```json
{
  "items": [
    "red",
    { "id": 1, "label": "blue" },
    42
  ]
}
```
```toon
items[3]:
  - red
  - id: 1
    label: blue
  - 42
```

### Array of Arrays
```json
{
  "matrix": [
    [1, 2, 3],
    [4, 5, 6]
  ]
}
```
```toon
matrix[2]:
  - [3]: 1,2,3
  - [3]: 4,5,6
```

## Special Cases

### Empty Structures
```json
{ "emptyObj": {}, "emptyArr": [] }
```
```toon
emptyObj:
emptyArr[0]:
```

### Null Values
```json
{ "value": null, "items": [1, null, 3] }
```
```toon
value: null
items[3]: 1,null,3
```

### Special Characters
```json
{
  "quote": "He said \"Hi\"",
  "comma": "a,b,c",
  "colon": "http://example.com"
}
```
```toon
quote: "He said \"Hi\""
comma: "a,b,c"
colon: "http://example.com"
```

### Numbers
```json
{
  "int": 42,
  "float": 3.14,
  "negative": -10,
  "scientific": 1.5e10
}
```
```toon
int: 42
float: 3.14
negative: -10
scientific: 15000000000
```

## Complex Example

### Realistic API Response
```json
{
  "status": "success",
  "data": [
    { "id": 1, "title": "Post 1", "views": 1500 },
    { "id": 2, "title": "Post 2", "views": 2300 }
  ],
  "meta": {
    "page": 1,
    "total": 2,
    "tags": ["tech", "ai"]
  }
}
```
```toon
status: success
data[2]{id,title,views}:
  1,Post 1,1500
  2,Post 2,2300
meta:
  page: 1
  total: 2
  tags[2]: tech,ai
```

## Delimiter Options

### Tab Delimiter
```typescript
const encoder = new ToonEncoder({ delimiter: '\t' });
const toon = encoder.encode({ items: ['a', 'b', 'c'] });
// Output: items[3\t]: a\tb\tc
```

### Pipe Delimiter
```typescript
const encoder = new ToonEncoder({ delimiter: '|' });
const toon = encoder.encode({ tags: ['x', 'y', 'z'] });
// Output: tags[3|]: x|y|z
```

## Key Folding (Optional)

### Without Key Folding (Default)
```json
{
  "a": {
    "b": {
      "c": {
        "value": 42
      }
    }
  }
}
```
```toon
a:
  b:
    c:
      value: 42
```

### With Key Folding
```typescript
const encoder = new ToonEncoder({ 
  enableKeyFolding: true,
  flattenDepth: Infinity 
});
```
```toon
a.b.c.value: 42
```

## Token Savings Example

### JSON (87 tokens)
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin", "active": true },
    { "id": 2, "name": "Bob", "role": "user", "active": true },
    { "id": 3, "name": "Charlie", "role": "user", "active": false }
  ]
}
```

### TOON (52 tokens - 40% reduction)
```toon
users[3]{id,name,role,active}:
  1,Alice,admin,true
  2,Bob,user,true
  3,Charlie,user,false
```

## Usage in Code

```typescript
import { jsonToToon, toonToJson } from '@toon/toon2json';

// Encode
const data = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
};
const toon = jsonToToon(data);
console.log(toon);

// Decode
const json = toonToJson(toon);
console.log(json);

// Round-trip (lossless)
const original = { score: 95.5, verified: true };
const encoded = jsonToToon(original);
const decoded = toonToJson(encoded);
console.assert(JSON.stringify(decoded) === JSON.stringify(original));
```

## Best Practices

1. **Use TOON for uniform data**: Arrays of objects with the same structure benefit most
2. **Preserve types**: Enable `preserveNumbers` and `preserveBooleans` for accurate decoding
3. **Validate input**: Use `ToonConverter.validate()` to check TOON format before decoding
4. **Choose delimiters wisely**: Use tab delimiters for data containing commas
5. **Enable key folding**: For deeply nested single-child objects to save more tokens
