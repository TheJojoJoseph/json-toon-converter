# GitHub Actions Setup for npm Publishing

This workflow automatically publishes your package to npm when you create a release or push a version tag.

## Setup Instructions

### 1. Create an npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type (recommended for CI/CD)
5. Copy the generated token

### 2. Add the Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### 3. Publishing Your Package

The workflow triggers automatically when you:

#### Option A: Create a GitHub Release
1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Create a new tag (e.g., `v2.0.4`)
4. Fill in release title and description
5. Click **Publish release**

#### Option B: Push a Version Tag
```bash
# Update version in package.json
npm version patch  # or minor, or major

# Push the tag
git push origin v2.0.4
```

## Workflow Features

- ✅ Runs tests before publishing
- ✅ Builds the package
- ✅ Publishes with provenance (supply chain security)
- ✅ Public access (for scoped packages)
- ✅ Uses npm ci for consistent installs

## Troubleshooting

### Authentication Failed
- Verify `NPM_TOKEN` is correctly set in GitHub Secrets
- Ensure the token has **Automation** or **Publish** permissions
- Check that the token hasn't expired

### Tests Failing
- The workflow will not publish if tests fail
- Check the Actions tab for detailed error logs

### Package Already Published
- You cannot republish the same version
- Update the version in `package.json` before creating a new release

## Manual Publishing

If you prefer to publish manually:
```bash
npm run build
npm test
npm publish --access public
```
