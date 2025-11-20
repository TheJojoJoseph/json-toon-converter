# Publishing Guide for @toon-json/converter

This guide will help you publish the `@toon-json/converter` package to NPM.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup) if you don't have one
2. **NPM CLI**: Ensure you have npm installed (comes with Node.js)
3. **Authentication**: Log in to NPM via CLI

## Step-by-Step Publishing Process

### 1. Prepare Your Package

Before publishing, ensure everything is ready:

```bash
# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Build the package
npm run build

# Check for any linting issues
npm run lint
```

### 2. Update Package Information

Edit `package.json` and update:

- **name**: Choose a unique name (check availability on npmjs.com)
- **version**: Follow semantic versioning (start with 1.0.0)
- **author**: Add your name and email
- **repository**: Add your GitHub repository URL
- **homepage**: Add your project homepage URL
- **bugs**: Add your issues URL

Example:
```json
{
  "name": "@toon-json/converter",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/TheJojoJoseph/json-toon-converter.git"
  }
}
```

### 3. Check Package Name Availability

```bash
# Check if the package name is available
npm search @toon-json/converter

# Or visit: https://www.npmjs.com/package/@toon-json/converter
```

Scoped packages (like `@toon-json/converter`) require the `--access public` flag when publishing.

### 4. Login to NPM

```bash
# Login to your NPM account
npm login

# Verify you're logged in
npm whoami
```

### 5. Test the Package Locally

Before publishing, test the package locally:

```bash
# Create a tarball
npm pack

# This creates a .tgz file that you can test in another project
# In another directory:
npm install /path/to/json-toon-converter-1.0.0.tgz
```

### 6. Publish to NPM

```bash
# Dry run to see what will be published
npm publish --dry-run

# Review the output, then publish for real
# For scoped packages like @toon-json/converter, use --access public
npm publish --access public
```

### 7. Verify Publication

After publishing:

1. Visit your package page: `https://www.npmjs.com/package/@toon-json/converter`
2. Test installation: `npm install @toon-json/converter`
3. Check the documentation renders correctly

## Publishing Updates

When you need to publish updates:

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Major** (1.0.0 → 2.0.0): Breaking changes

```bash
# Patch release
npm version patch

# Minor release
npm version minor

# Major release
npm version major
```

### 2. Update CHANGELOG.md

Document all changes following the Keep a Changelog format.

### 3. Publish the Update

```bash
npm publish
```

## Best Practices

### Before Publishing

- ✅ All tests pass
- ✅ Code is linted and formatted
- ✅ Documentation is up to date
- ✅ CHANGELOG.md is updated
- ✅ Version number is correct
- ✅ Package builds successfully
- ✅ No sensitive information in code

### Package Quality

- Add badges to README (npm version, license, build status)
- Include comprehensive examples
- Write clear API documentation
- Maintain good test coverage
- Respond to issues and PRs promptly

### Security

- Never commit `.env` files or secrets
- Use `.npmignore` to exclude unnecessary files
- Review dependencies regularly
- Enable 2FA on your NPM account

## NPM Scripts Reference

```bash
# Build the package
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Prepare for publishing (runs automatically before publish)
npm run prepublishOnly
```

## Troubleshooting

### "Package name already exists"

Choose a different name or use a scoped package:
```bash
npm publish --access public
```

### "You must verify your email"

Check your email and verify your NPM account.

### "You do not have permission to publish"

Ensure you're logged in with the correct account:
```bash
npm whoami
npm logout
npm login
```

### "Package size too large"

Check what's being included:
```bash
npm pack --dry-run
```

Update `.npmignore` to exclude unnecessary files.

## Useful Commands

```bash
# View package info
npm view @jojojoseph/toon-json-converter

# View all versions
npm view @jojojoseph/toon-json-converter versions

# Deprecate a version
npm deprecate @jojojoseph/toon-json-converter@1.0.0 "Use version 1.0.1 instead"

# Unpublish (only within 72 hours)
npm unpublish @jojojoseph/toon-json-converter@1.0.0
```

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [NPM Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## Support

If you encounter issues:

1. Check [NPM Status](https://status.npmjs.org/)
2. Review [NPM Documentation](https://docs.npmjs.com/)
3. Ask in [NPM Community](https://github.com/npm/feedback)

---

Good luck with your publication! 🚀
