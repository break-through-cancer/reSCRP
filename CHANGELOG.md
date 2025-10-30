# Changelog

All notable changes to the Single Cell Research Portal (reSCRP) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2025-10-30

### Added
- Database connection logging for all modules (TCM, TCM_Custom, GastricCancer, GastricTME, BcellLC, OvMRD, OvarianMRD)
- Startup connection verification with detailed error reporting
- Test suite with Node.js native test runner
  - Application health tests
  - Database connection tests
  - Route tests
  - Security header tests
  - Utility function tests
- Shared test helpers module to reduce code duplication
- Database pool cleanup methods for all modules to prevent test hanging

### Fixed
- OvarianMRD embedding page CellStatus dropdown showing undefined values
- OvarianMRD embedding page Cell Status and Sample View plots not rendering
- Test suite hanging due to unclosed database connections and pending promises
- Optimized OvarianMRD queryCellType to use single SQL query instead of two

### Changed
- Refactored duplicate makeRequest function into shared test helpers
- Removed non-functional Data Validation tests from test suite

## [0.1.0] - 2025-10-28

### Added
- Ovarian MRD module with complete analysis pipeline
  - Temporal cell composition analysis
  - Cell composition visualization charts (stacked bar, line, and pie grid)
  - Database creation and data loading scripts
  - R scripts for embedding, DEGs, and expression analysis
  - Ovarian MRD schematic image on module index page
  - Red color theme matching module branding
- BTC authentication and group claims (PR #15)
- Documentation and tutorial links in navigation (PR #16)
- Font Awesome icons for module navigation
- R dependency updates (tidyr, base64, pheatmap, openssl, askpass)
- System fonts support for ggplot visualizations
- Red background color style for homepage links

### Changed
- Updated BTC logo and header styling for OvarianMRD module
- Migrated undraw profile SVG images to shared assets directory
- Updated Ovarian MRD sample count to 8 samples
- Updated tutorial icon to code icon
- Modified TCM module to read database from environment file
- Changed Docker volume path from /data/TCM to /data
- Docker base image updates for better R package support

### Fixed
- Logo height consistency using CSS instead of inline styles
- Profile image paths now use shared /assets/img/ directory
- Added .gitignore rules for R workspace files (.RData, .Rhistory)

### Removed
- Legacy TCM load_data.sql script
- Unused SQL scripts
- Incomplete yarn packageManager field from package.json

### Infrastructure
- GitHub Actions workflow for Docker image builds
- Multi-platform Docker image support (linux/amd64, linux/arm64)
- Container registry integration with GitHub Packages (ghcr.io)

## Release Notes

### Version 0.1.0 - Initial Tagged Release

This is the first versioned release of reSCRP. The platform includes:

**Active Modules:**
- T Cell Map (TCM)
- Custom T Cell Map
- Gastric Cancer
- Gastric TME
- B Cell Landscape in Lung Cancer
- Ovarian MRD (NEW)

**Platform Features:**
- Single-cell RNA sequencing data visualization
- Interactive cell type analysis and exploration
- Differential gene expression analysis
- Cell embedding visualizations
- Authentication and access control
- Multi-study data portal

**Technical Stack:**
- Node.js/Express backend
- Pug templating
- MySQL/MySQL2 database
- R integration for statistical analysis
- Chart.js for data visualization
- Docker containerization

---

## Version Guidelines

- **MAJOR** version: Breaking changes, major architectural updates
- **MINOR** version: New modules, significant features, backward-compatible changes
- **PATCH** version: Bug fixes, minor updates, documentation improvements

## Upcoming Releases

Future versions will follow this pattern:
- v0.2.0 - Next feature additions or module updates
- v1.0.0 - Official production release when platform is stable
