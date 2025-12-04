# How to Use CI/CD Pipeline in Real Life

## Table of Contents
1. [Local Development Workflow](#local-development-workflow)
2. [Creating Pull Requests](#creating-pull-requests)
3. [Merging and Deployment](#merging-and-deployment)
4. [Release Management](#release-management)
5. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
6. [Day-in-the-Life Scenarios](#day-in-the-life-scenarios)

---

## Local Development Workflow

### First Time Setup

```bash
# Clone the repository
git clone https://github.com/TEJSARISA/ci-cd-pipeline-demo.git
cd ci-cd-pipeline-demo

# Install dependencies
npm install

# Verify everything works
npm test
npm run build
```

### Starting a New Feature

```bash
# Update your local develop branch
git checkout develop
git pull origin develop

# Create a feature branch from develop
git checkout -b feature/add-user-authentication

# Make your code changes
# Example: Edit src/index.js to add authentication middleware

# Test your changes locally
npm test              # Run unit tests
npm run lint          # Check code quality
npm run build         # Build the application

# If all tests pass, commit your changes
git add .
git commit -m "feat: Add JWT authentication middleware"

# Push your feature branch
git push origin feature/add-user-authentication
```

### Commit Message Best Practices

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Fix a bug
test: Add or update tests
ci: Changes to CI/CD
docs: Documentation updates
refactor: Code refactoring
perf: Performance improvements
style: Code style changes
```

---

## Creating Pull Requests

### Automatic Workflow Triggering

When you push your branch, GitHub Actions **automatically** triggers:

1. **Build & Test Job** (Runs in parallel with security scan)
   ```
   ✓ Checkout code
   ✓ Setup Node.js (tests on 18.x and 20.x)
   ✓ Install dependencies via npm ci
   ✓ Run linter (npm run lint)
   ✓ Run tests (npm test)
   ✓ Generate coverage report
   ✓ Build application (npm run build)
   ✓ Upload artifacts (5-day retention)
   ```

2. **Security Scan Job** (Parallel execution)
   ```
   ✓ Security checks
   ✓ Vulnerability scanning
   ```

### View Workflow Results

```
GitHub UI → Your Repository → Actions Tab → Select Latest Workflow
```

You'll see:
- ✅ All checks passed → You can create PR
- ⏳ Checks in progress → Wait a few minutes
- ❌ Checks failed → Fix the issues and push again

### Create Pull Request on GitHub

**Steps:**
1. Go to your repository
2. Click "Compare & pull request"
3. Fill in:
   - **Title**: Brief description of changes
   - **Description**: What, Why, How
   - **Link Issues**: "Fixes #123" (if applicable)

**Example PR Description:**
```markdown
## Description
Adds JWT authentication middleware to protect API endpoints.

## Changes
- Added JWT token validation
- Protected /api/users endpoint
- Added authentication tests

## Testing
- ✓ All unit tests passing (25/25)
- ✓ Test coverage: 95%
- ✓ Linter: No errors
- ✓ Tested locally on Node 20.x

## Related Issues
Fixes #42 (Authentication)
```

### Branch Protection Rules Applied

Your PR is **automatically blocked** if:
- ❌ Tests fail
- ❌ Linter reports errors
- ❌ Code coverage drops
- ❌ Branch is out of date with main

---

## Merging and Deployment

### Code Review Process

1. **Team Lead Reviews**
   - Checks code quality
   - Verifies tests coverage
   - Ensures no security issues
   - Approves or requests changes

2. **Address Feedback**
   ```bash
   # Make requested changes
   git add .
   git commit -m "refactor: Improve error handling in auth"
   git push origin feature/add-user-authentication
   
   # Workflow runs again automatically
   # All checks must pass before merge
   ```

3. **Approval & Merge**
   ```
   When approved and all checks pass:
   Click "Merge pull request" button
   ```

### Automatic Deployment to Production

When you merge to `main`:

```
✅ Code merged to main branch
   ↓
✅ GitHub Actions Deploy Job Triggers Automatically
   ↓
✅ Download build artifacts
   ↓
✅ Authenticate with AWS (using GitHub Secrets)
   ↓
✅ Deploy to production environment
   ↓
✅ Run health checks
   ↓
✅ Application is LIVE!

⏱️ Total time: 2-5 minutes
```

### Viewing Deployment Status

```
GitHub UI → Actions Tab → Latest Workflow → Deploy Job

You'll see:
- Download build artifacts ✓
- Deploy to AWS ✓
- Health checks ✓
- Success notification ✓
```

---

## Release Management

### Creating a Release Version

#### Scenario: Releasing v1.2.0

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Update version numbers
# Edit package.json:
# "version": "1.2.0"

# 3. Update CHANGELOG
# Document all changes in CHANGELOG.md

# 4. Commit release changes
git add .
git commit -m "chore: Prepare release v1.2.0"
git push origin release/v1.2.0

# 5. Create Pull Request to main
# Title: "Release v1.2.0"
# Description: Include all release notes
```

#### After Approval

```bash
# 6. Merge to main (triggers automatic deployment)
# (This deploys to production)

# 7. Merge back to develop
# (Ensures develop has the release commits)

# 8. Tag the release
git checkout main
git pull origin main
git tag v1.2.0
git push origin v1.2.0

# 9. Create GitHub Release
# GitHub UI → Releases → Create new release
# Select tag v1.2.0
# Add release notes
# Publish release
```

### Version Numbering (Semantic Versioning)

```
MAJOR.MINOR.PATCH (e.g., 1.2.3)

MAJOR: Breaking changes (1.0.0 → 2.0.0)
MINOR: New features, backward compatible (1.0.0 → 1.1.0)
PATCH: Bug fixes (1.0.0 → 1.0.1)
```

---

## Monitoring and Troubleshooting

### Checking Deployment Status

```bash
# SSH to your AWS instance
ssh -i key.pem ec2-user@your-instance.aws

# Check if application is running
curl http://localhost:3000/health

# View logs
cat /var/log/application.log | tail -100
```

### If Tests Fail

1. **Check error in GitHub Actions**
   ```
   Actions → Latest workflow → Failed job → Logs
   ```

2. **Common Issues**
   - Missing test: Add test to src/__tests__/
   - Linting error: Run `npm run lint` locally
   - Build error: Check dependencies

3. **Fix locally**
   ```bash
   git add .
   git commit -m "fix: Resolve failing tests"
   git push origin feature/your-feature
   # Workflow runs again automatically
   ```

### If Deployment Fails

1. **Check deployment logs**
   ```
   Actions → Latest workflow → Deploy job → View logs
   ```

2. **Common Issues**
   - AWS credentials missing: Check GitHub Secrets
   - AWS permissions: Verify IAM role
   - Health check failed: Verify AWS configuration

3. **Retry deployment**
   ```
   Actions → Failed workflow → Re-run jobs
   ```

### Emergency Rollback

If production breaks:

```bash
# 1. Identify the bad commit
git log --oneline main | head -5

# 2. Revert the commit
git revert <commit-hash>

# 3. Push revert (triggers auto-deployment)
git push origin main

# 4. Wait for deployment
# Automatic deployment starts → 5 minutes later production is fixed!
```

---

## Day-in-the-Life Scenarios

### Scenario 1: Adding a New Feature

**9:00 AM** - Start your day
```bash
git checkout -b feature/dark-mode develop
# Code the feature
npm test
```

**10:30 AM** - Create PR
```bash
git push origin feature/dark-mode
# GitHub automatically tests (takes ~3 minutes)
# Create PR on GitHub
```

**11:00 AM** - Team review
- Lead reviews code
- Approves with feedback
- You make requested changes

**1:00 PM** - Merge to main
```bash
# Click "Merge pull request"
# Automatic deployment starts!
```

**1:10 PM** - Feature is LIVE
- GitHub Actions deployed automatically
- Zero downtime
- Health checks passed

---

### Scenario 2: Emergency Bug Fix

**2:00 PM** - Production bug reported
```bash
git checkout -b hotfix/fix-payment-crash main
# Fix the bug
npm test
```

**2:15 PM** - Create urgent PR
```bash
git push origin hotfix/fix-payment-crash
# Tests run automatically
```

**2:20 PM** - Quick team approval
- Lead quickly reviews hotfix
- Approves immediately

**2:25 PM** - Merge
```bash
# Click merge
# Automatic deployment to production
```

**2:30 PM** - Bug is fixed in production!
- Automatic deployment completed
- No manual steps needed
- Users never experienced the outage

---

### Scenario 3: Release Day

**9:00 AM** - Start release process
```bash
git checkout -b release/v2.0.0 develop
# Update version in package.json
# Update CHANGELOG.md
git push origin release/v2.0.0
```

**9:15 AM** - Create release PR
- Title: "Release v2.0.0"
- Include release notes

**11:00 AM** - Team approval
- QA verifies on staging
- Lead approves

**1:00 PM** - Merge to main
```bash
# Click merge
# Automatic deployment to production
```

**1:10 PM** - Create GitHub release
```bash
git tag v2.0.0
git push origin v2.0.0
# Create release on GitHub UI
```

**1:15 PM** - Release is live!
- v2.0.0 available
- Changelog published
- Users can see new features

---

## Key Benefits Summary

| What | Without CI/CD | With This Pipeline |
|------|---|---|
| **Time to Production** | 30+ minutes | 5 minutes |
| **Manual Testing** | Inconsistent | Automated every time |
| **Production Bugs** | Common | Caught in PR before merge |
| **Deployment Errors** | Frequent | Rare (automated) |
| **Rollback Time** | 1+ hour | 5 minutes |
| **Developer Waiting** | 2-3 hours | 0 hours |
| **DevOps Involvement** | High | Minimal |

---

## Next Steps

1. ✅ Clone this repository
2. ✅ Configure AWS credentials in GitHub Secrets
3. ✅ Adapt workflows to your project
4. ✅ Start using feature branches
5. ✅ Watch automatic testing and deployment
6. ✅ Never manually deploy again!

---

## Troubleshooting Quick Reference

**Q: My tests are failing**  
A: Run `npm test` locally, fix issues, commit and push. Workflow will run again.

**Q: Deployment failed**  
A: Check Actions tab for logs. Most likely AWS credential issue. Verify GitHub Secrets.

**Q: How do I revert a deployment?**  
A: `git revert <commit-hash>` then `git push origin main`. Auto-deploys the revert.

**Q: Can I deploy without PR?**  
A: No, main branch requires PR. Branch protection enforces quality.

**Q: How long does deployment take?**  
A: Typically 2-5 minutes from merge to production.

---

## Support
- GitHub Actions Docs: https://docs.github.com/en/actions
- Check Actions tab for workflow logs
- Review CHANGELOG.md for version history
