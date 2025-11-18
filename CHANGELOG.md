# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of json-toon-converter
- `ToonEncoder` class for JSON to TOON conversion
- `ToonDecoder` class for TOON to JSON conversion
- `ToonConverter` utility class with static methods
- `jsonToToon()` convenience function
- `toonToJson()` convenience function
- Support for primitives (string, number, boolean, null)
- Support for objects and nested objects
- Support for arrays with table formatting for uniform data
- Configurable encoding options (indent, alignColumns, minColumnWidth)
- Configurable decoding options (preserveNumbers, preserveBooleans)
- Comprehensive unit tests with >80% coverage
- Full TypeScript support with type definitions
- Complete documentation and examples
- MIT License

### Features
- 30-60% token reduction for flat, uniform data structures
- Lossless round-trip conversion between JSON and TOON
- Human-readable and LLM-friendly format
- Optimized for AI workflows and LLM prompts

## [Unreleased]

### Planned
- CLI tool for command-line conversion
- Streaming support for large files
- Additional formatting options
- Performance optimizations
- Browser bundle
