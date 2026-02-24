# Scripts Directory

Build, validation, and automation scripts for Unlock My Data.

## Available Scripts

### `validate-data.js`

Comprehensive data validation for the Unlock My Data project.

**Usage:**
```bash
npm run validate
# or
node scripts/validate-data.js
```

**What it validates:**

- **JSON Structure**: Validates all JSON files for correct syntax
- **Service Schema**: Checks required fields in services data:
  - `slug`, `name`, `logo`
  - Validates slug format (lowercase alphanumeric + hyphens)
- **Manual Data Files**: Validates status, dates, and review structures
  - Checks for valid status values: `draft`, `changes_requested`, `published`
  - Validates ISO 8601 date formats
  - Verifies review array structure
- **i18n Files**: Ensures all translation files have `fr` and `en` keys
- **TypeScript Config**: Verifies tsconfig.json validity
- **Logo URLs**: Samples logo URLs to check accessibility (first 10 services)

**Output:**

Detailed report showing:
- ✅ Passed validations
- ❌ Errors (fails CI/CD)
- ⚠️ Warnings (does not fail on master, fails on fiche-* branches)
- 📷 Logo URL accessibility stats

**Exit Codes:**

- `0`: All validations passed
- `1`: One or more validation errors found

## GitHub Actions Integration

The validation script runs automatically in: `.github/workflows/validate.yml`

### Branch Strategy

#### `master` Branch
- Regular validation runs on push and pull requests
- Allows warnings (non-critical issues marked with ⚠️)
- Stricter requirements for errors (❌)
- Suitable for stable, production code

#### `fiche-*` Branches
- **STRICTER validation** runs on push and pull requests
- **NO warnings allowed** - all warnings must be fixed
- All validation checks must pass completely
- Ensures new contributions meet highest standards
- Suitable for new service inputs and feature branches

### Validation Triggers

Runs on:
- Push to `master` or branches matching `fiche-*` pattern
- Pull requests against `master` or `fiche-*` branches
- Changes to data, config, or code files

### Jobs in Pipeline

1. **Validate** - Data & schema validation
2. **Validate-Strict** - Runs ONLY on `fiche-*` branches, enforces stricter standards
3. **Lint** - ESLint + TypeScript type checking
4. **Build** - Tests Next.js compilation
5. **Test** - Unit tests (if present)
6. **Summary** - Overall status check and PR commenting

