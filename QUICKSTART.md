# Quick Start Guide

## Installation

```bash
npm install @toon-json/converter
```

## Basic Usage

```javascript
const { jsonToToon, toonToJson } = require('@toon-json/converter');

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

// Convert back to JSON
const json = toonToJson(toon);
console.log(json); // Original data
```

## Publishing to NPM

### Prerequisites

1. **Create NPM Account**: Sign up at [npmjs.com](https://www.npmjs.com/signup)
2. **Login to NPM**:
   ```bash
   npm login
   ```

### Steps to Publish

1. **Update package.json** with your information:
   - Change `author` to your name
   - Update `repository` URL with your GitHub repo
   - Package name is set to `@toon-json/converter`

2. **Test everything works**:
   ```bash
   npm install
   npm test
   npm run build
   ```

3. **Publish to NPM**:
   ```bash
   npm publish
   ```

   For scoped packages (like `@toon-json/converter`), you need to specify public access:
   ```bash
   npm publish --access public
   ```

4. **Verify publication**:
   - Visit: `https://www.npmjs.com/package/@toon-json/converter`
   - Test install: `npm install @toon-json/converter`

### Publishing Updates

```bash
# Update version (patch/minor/major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Update CHANGELOG.md with changes

# Publish
npm publish
```

## Features

✅ **Complete Implementation**
- JSON to TOON encoder
- TOON to JSON decoder
- Full TypeScript support
- 75 unit tests with >90% coverage

✅ **Supported Features**
- Primitives (string, number, boolean, null)
- Objects and nested objects
- Arrays with table formatting
- Arrays of primitives with list formatting
- Configurable indentation and formatting
- Lossless round-trip conversion

✅ **Documentation**
- Comprehensive README
- API documentation
- Usage examples
- Contributing guidelines
- Publishing guide

## Next Steps

1. **Customize**: Update `package.json` with your details
2. **Test**: Run `npm test` to verify everything works
3. **Publish**: Follow the publishing steps above
4. **Share**: Add badges to README, share on social media

## Support

For detailed documentation, see:
- [README.md](README.md) - Full documentation
- [PUBLISHING.md](PUBLISHING.md) - Detailed publishing guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## License

MIT License - See [LICENSE](LICENSE) file for details
