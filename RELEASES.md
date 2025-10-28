# Release Process for reSCRP

This document describes how to create and publish new releases of the Single Cell Research Portal.

## Versioning Strategy

We use [Semantic Versioning](https://semver.org/) (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR** (x.0.0): Breaking changes, major platform redesigns
- **MINOR** (0.x.0): New modules, significant features, backward-compatible changes
- **PATCH** (0.0.x): Bug fixes, minor updates, documentation improvements

### Version Examples

- `v0.1.0` → `v0.2.0` : Added a new cancer module
- `v0.2.0` → `v0.2.1` : Fixed chart rendering bug
- `v0.9.0` → `v1.0.0` : Official production release
- `v1.0.0` → `v2.0.0` : Major API breaking change

## Release Workflow

### 1. Complete Feature Development

Ensure all work is completed on your feature branch:
- All code changes committed
- Tests passing (if applicable)
- Documentation updated
- CHANGELOG.md updated in "Unreleased" section

### 2. Create Pull Request

```bash
# Push feature branch
git push origin feature/your-feature-name

# Create PR via GitHub UI or CLI
gh pr create --title "Add Your Feature" --body "Description"
```

### 3. Review and Merge

- Get PR approval
- Merge to `main` branch
- Delete feature branch after merge

### 4. Prepare Release on Main

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Update CHANGELOG.md
# Move items from [Unreleased] to new version section
# Update date: [0.x.0] - YYYY-MM-DD
```

### 5. Create Version Tag

```bash
# Create annotated tag with descriptive message
git tag -a v0.x.0 -m "Release v0.x.0: Brief description

Detailed changes:
- New feature A
- Enhancement B
- Bug fix C"

# Push tag to remote (triggers Docker build)
git push origin v0.x.0
```

### 6. Create GitHub Release

**Option A: GitHub CLI**
```bash
gh release create v0.x.0 \
  --title "v0.x.0 - Release Name" \
  --notes-file RELEASE_NOTES.md
```

**Option B: GitHub Web UI**
1. Go to https://github.com/break-through-cancer/reSCRP/releases/new
2. Select your tag: `v0.x.0`
3. Set release title: `v0.x.0 - Release Name`
4. Copy relevant CHANGELOG.md section to description
5. Mark as pre-release (if < v1.0.0)
6. Click "Publish release"

### 7. Verify Docker Image

The GitHub Actions workflow will automatically:
- Build Docker image for linux/amd64 and linux/arm64
- Push to `ghcr.io/break-through-cancer/rescrp`
- Tag with version number and update `latest`

Verify the image was published:
```bash
# Check available tags
gh api repos/break-through-cancer/reSCRP/packages

# Or visit: https://github.com/break-through-cancer/reSCRP/pkgs/container/rescrp
```

### 8. Update Deployment

If you have a deployment environment, update it to use the new version:

```bash
# Docker
docker pull ghcr.io/break-through-cancer/rescrp:v0.x.0
docker-compose up -d

# Or using latest
docker pull ghcr.io/break-through-cancer/rescrp:latest
docker-compose up -d
```

## Release Checklist

Use this checklist for each release:

- [ ] All feature branch changes merged to `main`
- [ ] CHANGELOG.md updated with version number and date
- [ ] All tests passing
- [ ] Version tag created locally
- [ ] Version tag pushed to remote
- [ ] GitHub release created
- [ ] Docker images built successfully in CI
- [ ] Docker images available in ghcr.io
- [ ] Deployment updated (if applicable)
- [ ] Release announcement (if applicable)

## First Release: v0.1.0

### When to create v0.1.0

Create the first tagged release after:
- OvarianMRD module is merged and tested
- All current changes are stable on `main`
- You're ready to have a reproducible snapshot

### Steps for v0.1.0

```bash
# 1. On main branch after OvarianMRD merge
git checkout main
git pull origin main

# 2. Update CHANGELOG.md
# - Move items from [Unreleased] to [0.1.0] - 2025-10-28
# - Commit the change
git add CHANGELOG.md
git commit -m "Prepare v0.1.0 release"
git push origin main

# 3. Create and push tag
git tag -a v0.1.0 -m "Release v0.1.0: Initial tagged release

First versioned release of reSCRP including:
- Ovarian MRD module
- BTC authentication
- Documentation and tutorial links
- Multi-module single-cell analysis platform"

git push origin v0.1.0

# 4. Create GitHub release
gh release create v0.1.0 \
  --title "v0.1.0 - Initial Release" \
  --notes "See CHANGELOG.md for complete details" \
  --prerelease
```

## Hotfix Process

For urgent bug fixes that need immediate release:

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/fix-critical-bug

# 2. Make fix and commit
git add .
git commit -m "Fix critical bug in module X"

# 3. Push and create PR
git push origin hotfix/fix-critical-bug
gh pr create --title "Hotfix: Critical bug" --label "hotfix"

# 4. After merge, create patch release
git checkout main
git pull origin main
git tag -a v0.1.1 -m "Hotfix: Critical bug in module X"
git push origin v0.1.1
```

## Rolling Back a Release

If a release has issues:

```bash
# Option 1: Revert to previous Docker image
docker pull ghcr.io/break-through-cancer/rescrp:v0.x.x-previous
docker-compose up -d

# Option 2: Delete tag and release (only if not deployed)
git tag -d v0.x.0
git push origin :refs/tags/v0.x.0
gh release delete v0.x.0

# Option 3: Create new patch with fix
# (Preferred - don't delete published releases)
```

## Resources

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Docker tags best practices](https://docs.docker.com/develop/dev-best-practices/)
