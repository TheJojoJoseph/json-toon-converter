# Pre-Publishing Checklist

Use this checklist before publishing your package to NPM.

## ✅ Package Configuration

- [ ] Update `package.json`:
  - [ ] Set unique package `name` (check availability on npmjs.com)
  - [ ] Update `author` with your name and email
  - [ ] Update `repository.url` with your GitHub repository
  - [ ] Update `bugs.url` with your issues page
  - [ ] Update `homepage` with your project homepage
  - [ ] Verify `version` is correct (start with 1.0.0)
  - [ ] Review `keywords` for discoverability

## ✅ Code Quality

- [x] All tests pass: `npm test`
- [x] Code builds successfully: `npm run build`
- [x] Test coverage >80%: `npm run test:coverage`
- [x] No linting errors: `npm run lint`
- [x] Code is formatted: `npm run format`

## ✅ Documentation

- [x] README.md is complete and accurate
- [x] LICENSE file is present
- [x] CHANGELOG.md is up to date
- [x] Examples are provided
- [x] API documentation is clear

## ✅ Files

- [x] `.npmignore` excludes unnecessary files
- [x] `dist/` folder contains compiled code
- [x] Type definitions (`.d.ts`) are generated
- [x] Source maps are included

## ✅ NPM Account

- [ ] Create NPM account at https://npmjs.com/signup
- [ ] Verify email address
- [ ] Enable 2FA (recommended for security)
- [ ] Login via CLI: `npm login`
- [ ] Verify login: `npm whoami`

## ✅ Pre-Publish Tests

- [ ] Test package locally:
  ```bash
  npm pack
  # Creates json-toon-converter-1.0.0.tgz
  ```

- [ ] Install in test project:
  ```bash
  cd /path/to/test-project
  npm install /path/to/json-toon-converter-1.0.0.tgz
  ```

- [ ] Verify it works in test project

## ✅ Publishing

- [ ] Dry run to check what will be published:
  ```bash
  npm publish --dry-run
  ```

- [ ] Review the output carefully

- [ ] Publish to NPM:
  ```bash
  npm publish
  # or for scoped packages:
  npm publish --access public
  ```

## ✅ Post-Publishing

- [ ] Verify package page: https://www.npmjs.com/package/json-toon-converter
- [ ] Test installation: `npm install json-toon-converter`
- [ ] Create GitHub release with tag `v1.0.0`
- [ ] Add badges to README:
  - [ ] NPM version badge
  - [ ] License badge
  - [ ] Build status (if using CI)
  - [ ] Coverage badge (if using coverage service)

## ✅ Promotion

- [ ] Share on social media (Twitter, LinkedIn, Reddit)
- [ ] Post on relevant communities (Dev.to, Hashnode, etc.)
- [ ] Add to awesome lists if applicable
- [ ] Update your portfolio/website

## 🎯 Quick Commands Reference

```bash
# Build and test
npm run build
npm test
npm run test:coverage

# Check package contents
npm pack --dry-run

# Publish
npm login
npm publish

# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 📝 Notes

- Package name must be unique on NPM
- Use semantic versioning (MAJOR.MINOR.PATCH)
- You can unpublish within 72 hours if needed
- Consider using `npm version` to auto-update version and create git tags

## 🆘 Troubleshooting

### "Package name already exists"
- Choose a different name
- Use a scoped package: `@yourusername/json-toon-converter`

### "You must verify your email"
- Check your email and click the verification link

### "You do not have permission"
- Ensure you're logged in: `npm whoami`
- Check package name ownership

### "Package size too large"
- Review `.npmignore` to exclude unnecessary files
- Check what's being included: `npm pack --dry-run`

## ✨ Success!

Once published, your package will be available at:
- NPM: https://www.npmjs.com/package/json-toon-converter
- Install: `npm install json-toon-converter`

Congratulations! 🎉
