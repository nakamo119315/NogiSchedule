<!--
  Sync Impact Report
  ===================
  Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution establishment)

  Modified principles: N/A (initial version)

  Added sections:
  - Core Principles (5 principles for frontend-only GitHub Pages project)
    - I. Static Frontend Only
    - II. GitHub Pages Compatibility
    - III. Zero Backend Dependencies
    - IV. Progressive Enhancement
    - V. Simplicity First
  - Deployment Constraints
  - Development Workflow
  - Governance

  Removed sections: N/A (initial version)

  Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Compatible (uses frontend structure option)
  - .specify/templates/spec-template.md: ✅ Compatible (technology-agnostic)
  - .specify/templates/tasks-template.md: ✅ Compatible (single project structure applies)

  Follow-up TODOs: None
-->

# Nogi Constitution

## Core Principles

### I. Static Frontend Only

All features MUST be implementable as static frontend code. No server-side processing, databases, or backend APIs are permitted within this project.

**Rationale**: GitHub Pages serves only static content. This constraint ensures all features work within the hosting environment's capabilities.

**Rules**:
- All code MUST execute in the browser (JavaScript/TypeScript)
- Data persistence MUST use browser storage (localStorage, IndexedDB) or external static files
- Dynamic content MUST be generated client-side
- Build output MUST be static HTML, CSS, and JavaScript files

### II. GitHub Pages Compatibility

All implementations MUST be deployable to GitHub Pages without modification or additional configuration.

**Rationale**: The target deployment platform is GitHub Pages, which has specific constraints that MUST be respected.

**Rules**:
- MUST work with GitHub Pages' static file serving
- MUST NOT require server-side rendering (SSR)
- MUST handle GitHub Pages' base path configuration (repository name as subdirectory)
- MUST use relative paths or configurable base URLs for assets
- Single Page Applications MUST include proper 404.html handling for client-side routing

### III. Zero Backend Dependencies

Features MUST NOT depend on custom backend services, serverless functions, or APIs that require authentication tokens embedded in client code.

**Rationale**: Backend dependencies would require separate hosting and maintenance, defeating the simplicity of GitHub Pages deployment.

**Rules**:
- External API calls are permitted ONLY for public, CORS-enabled endpoints
- API keys or secrets MUST NOT be embedded in frontend code
- If data fetching is required, use publicly accessible static JSON files or public APIs
- Consider offline-first approaches where possible

### IV. Progressive Enhancement

Core functionality MUST work without JavaScript where feasible. Enhanced features MAY require JavaScript.

**Rationale**: Ensures basic accessibility and resilience, while allowing rich interactivity.

**Rules**:
- Critical content SHOULD be present in initial HTML
- JavaScript failures SHOULD degrade gracefully, not break the page
- Loading states MUST be provided for async operations
- MUST work across modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

### V. Simplicity First

Choose the simplest solution that meets requirements. Avoid over-engineering for hypothetical future needs.

**Rationale**: Frontend-only projects benefit from minimal complexity. Simpler code is easier to maintain and debug.

**Rules**:
- Prefer vanilla JavaScript/CSS before adding frameworks
- Add dependencies only when they solve a concrete, immediate problem
- Build tooling complexity MUST be justified by tangible benefits
- YAGNI (You Aren't Gonna Need It) principle applies strictly

## Deployment Constraints

**Hosting**: GitHub Pages (static files only)

**Build Requirements**:
- Build output MUST be a directory of static files (typically `dist/` or `docs/`)
- Build process MUST be reproducible via npm/yarn scripts
- MUST support both root deployment (`username.github.io`) and project deployment (`username.github.io/repo-name`)

**Performance Targets**:
- Initial page load: < 3 seconds on 3G connection
- Total bundle size: < 500KB gzipped (excluding images)
- Lighthouse Performance score: > 80

**Accessibility**:
- MUST pass WCAG 2.1 Level AA for critical user journeys
- MUST be keyboard navigable

## Development Workflow

**Local Development**:
- MUST support local development with hot reload
- MUST NOT require external services to run locally
- Mock data SHOULD be used for development

**Testing**:
- Unit tests for utility functions and business logic
- Integration tests for critical user flows (where applicable)
- Visual regression tests are optional but recommended for UI components

**Code Quality**:
- Linting and formatting MUST be automated
- Type checking (if using TypeScript) MUST pass before merge
- Commits SHOULD follow conventional commit format

## Governance

This constitution is the authoritative source for architectural decisions in this project. All implementation choices MUST comply with these principles.

**Amendment Process**:
1. Propose changes via discussion or issue
2. Document rationale for the change
3. Update constitution with new version number
4. Update any affected templates or documentation

**Versioning Policy**:
- MAJOR: Principle removal or fundamental redefinition
- MINOR: New principle added or existing principle materially expanded
- PATCH: Clarifications, typo fixes, non-semantic changes

**Compliance**:
- All code reviews MUST verify compliance with these principles
- Violations require explicit justification documented in the PR
- Constitution Check in plan.md MUST be completed before implementation

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
