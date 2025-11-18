# Contributing to json-toon-converter

First off, thank you for considering contributing to json-toon-converter! It's people like you that make this library better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, test cases)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (Node version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Provide examples of how it would work**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for any new functionality
5. **Ensure all tests pass**: `npm test`
6. **Update documentation** if needed
7. **Commit your changes** with clear commit messages
8. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/json-toon-converter.git
cd json-toon-converter

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run tests in watch mode during development
npm run test:watch
```

## Coding Standards

- **TypeScript**: All code should be written in TypeScript
- **Formatting**: Use Prettier for code formatting (`npm run format`)
- **Linting**: Follow ESLint rules (`npm run lint`)
- **Testing**: Maintain >80% code coverage
- **Documentation**: Update README and JSDoc comments

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing patterns in the codebase

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests when relevant

Examples:
```
Add support for custom delimiters
Fix decoder handling of empty arrays
Update documentation for encoding options
```

## Testing Guidelines

- Write unit tests for all new functionality
- Ensure tests are clear and well-documented
- Test edge cases and error conditions
- Maintain high code coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments to all public APIs
- Include code examples for new features
- Update CHANGELOG.md following Keep a Changelog format

## Release Process

1. Update version in package.json following Semantic Versioning
2. Update CHANGELOG.md with changes
3. Create a pull request for review
4. After merge, create a GitHub release
5. Publish to NPM: `npm publish`

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
