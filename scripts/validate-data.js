#!/usr/bin/env node

/**
 * Data validation script for Unlock My Data
 * Validates:
 * - JSON structure and syntax
 * - Service schema conformance
 * - Logo URLs accessibility
 * - Required fields
 * - Date formats
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../public/data');

const VALID_STATUSES = ['draft', 'changes_requested', 'published'];
const REQUIRED_FIELDS = {
  service: ['slug', 'name', 'logo'],
  manual: ['status', 'created_at', 'created_by', 'updated_at'],
  admin: ['password'],
};

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.logoChecks = 0;
    this.logoSuccess = 0;
  }

  isRecentlyUpdated(slug) {
    try {
      const manualFilePath = path.join(dataDir, 'manual', `${slug}.json`);
      if (!fs.existsSync(manualFilePath)) return false;

      const data = JSON.parse(fs.readFileSync(manualFilePath, 'utf8'));
      const today = new Date();

      const isDateRecent = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;

        const diffDays = Math.abs(today - date) / (1000 * 60 * 60 * 24);
        return diffDays <= 30; // Check if updated within the last 30 days
      };

      return isDateRecent(data.created_at) || isDateRecent(data.updated_at);
    } catch (e) {
      return false;
    }
  }

  /**
   * Validate JSON structure
   */
  validateJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Validate ISO 8601 date format
   */
  isValidISODate(dateString) {
    if (!dateString) return false;
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})?)?$/;
    if (!iso8601Regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Check if URL is accessible
   */
  async checkURL(url, timeout = 5000) {
    if (!url) return { accessible: null, reason: 'empty' };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'UnlockMyData-Validator/1.0 (https://unlock-my-data.com)'
        }
      }).catch(() =>
        // Fallback to GET if HEAD fails
        fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'UnlockMyData-Validator/1.0 (https://unlock-my-data.com)'
          }
        })
      );

      clearTimeout(timeoutId);

      return {
        accessible: response.ok,
        status: response.status,
        reason: response.ok ? 'ok' : `HTTP ${response.status}`,
      };
    } catch (error) {
      return { accessible: false, reason: error.message };
    }
  }

  /**
   * Validate services.json
   */
  async validateServices() {
    const servicesPath = path.join(dataDir, 'services.json');

    if (!fs.existsSync(servicesPath)) {
      this.errors.push('services.json not found');
      return;
    }

    const jsonCheck = this.validateJSON(servicesPath);
    if (!jsonCheck.valid) {
      this.errors.push(`services.json: ${jsonCheck.error}`);
      return;
    }

    const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

    if (!Array.isArray(services)) {
      this.errors.push('services.json must be an array');
      return;
    }

    // Validate each service
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const prefix = `services[${i}]`;

      // Check required fields
      for (const field of REQUIRED_FIELDS.service) {
        if (!service[field]) {
          this.errors.push(`${prefix}: missing required field "${field}"`);
        }
      }

      // Validate slug format
      if (service.slug && !/^[a-z0-9-]+$/.test(service.slug)) {
        this.errors.push(`${prefix}: invalid slug format "${service.slug}"`);
      }

      // Check logo URL only if it's recently modified in manual directory
      if (service.logo && this.isRecentlyUpdated(service.slug)) {
        this.logoChecks++;
        const urlCheck = await this.checkURL(service.logo);
        if (urlCheck.accessible) {
          this.logoSuccess++;
        } else if (urlCheck.reason !== 'empty') {
          this.warnings.push(
            `${prefix} (${service.slug}): logo URL not accessible (${service.logo}) - ${urlCheck.reason}`
          );
        }
      }
    }

    console.log(`✓ Validated ${services.length} services`);
  }

  /**
   * Validate manual data files
   */
  validateManualData() {
    const manualDir = path.join(dataDir, 'manual');

    if (!fs.existsSync(manualDir)) {
      this.warnings.push('manual/ directory not found');
      return;
    }

    const files = fs.readdirSync(manualDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(manualDir, file);
      const jsonCheck = this.validateJSON(filePath);

      if (!jsonCheck.valid) {
        this.errors.push(`manual/${file}: ${jsonCheck.error}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Check required fields for services with status
      if (data.status) {
        for (const field of REQUIRED_FIELDS.manual) {
          // Allow empty string for updated_at, but check undefined for all
          if (data[field] === undefined || (data[field] === '' && field !== 'updated_at')) {
            this.errors.push(`manual/${file}: missing required field "${field}"`);
          }
        }

        // Validate status
        if (!VALID_STATUSES.includes(data.status)) {
          this.errors.push(
            `manual/${file}: invalid status "${data.status}". Valid: ${VALID_STATUSES.join(', ')}`
          );
        }

        // Validate dates
        if (data.created_at && data.created_at !== '' && !this.isValidISODate(data.created_at)) {
          this.errors.push(`manual/${file}: invalid created_at date format`);
        }
        if (data.updated_at && data.updated_at !== '' && !this.isValidISODate(data.updated_at)) {
          this.errors.push(`manual/${file}: invalid updated_at date format`);
        }

        // Validate review array if present
        if (Array.isArray(data.review)) {
          for (let i = 0; i < data.review.length; i++) {
            const review = data.review[i];
            if (!review.field || !review.message) {
              this.errors.push(
                `manual/${file}: review[${i}] missing "field" or "message"`
              );
            }
          }
        }
      }
    }

    console.log(`✓ Validated ${files.length} manual files`);
  }

  /**
   * Validate i18n files structure
   */
  validateI18nFiles() {
    const i18nDir = path.join(__dirname, '../i18n');

    if (!fs.existsSync(i18nDir)) {
      this.warnings.push('i18n/ directory not found');
      return;
    }

    const files = fs.readdirSync(i18nDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(i18nDir, file);
      const jsonCheck = this.validateJSON(filePath);

      if (!jsonCheck.valid) {
        this.errors.push(`i18n/${file}: ${jsonCheck.error}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Each i18n file should have fr and en keys
      if (file !== 'Shared.json') {
        if (!data.fr || !data.en) {
          this.errors.push(`i18n/${file}: must have both "fr" and "en" keys`);
        }
      }
    }

    console.log(`✓ Validated ${files.length} i18n files`);
  }

  /**
   * Validate TypeScript config
   */
  validateTypeScript() {
    const tsconfigPath = path.join(__dirname, '../tsconfig.json');

    if (!fs.existsSync(tsconfigPath)) {
      this.errors.push('tsconfig.json not found');
      return;
    }

    const jsonCheck = this.validateJSON(tsconfigPath);
    if (!jsonCheck.valid) {
      this.errors.push(`tsconfig.json: ${jsonCheck.error}`);
    }

    console.log('✓ TypeScript config valid');
  }

  /**
   * Print results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('DATA VALIDATION RESULTS');
    console.log('='.repeat(60) + '\n');

    if (this.errors.length === 0) {
      console.log('✅ All validation checks passed!\n');
    } else {
      console.log(`❌ Found ${this.errors.length} error(s):\n`);
      this.errors.forEach((error) => console.log(`  ❌ ${error}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warning(s):\n`);
      this.warnings.forEach((warning) => console.log(`  ⚠️  ${warning}`));
      console.log();
    }

    if (this.logoChecks > 0) {
      console.log(
        `📷 Logo URL checks: ${this.logoSuccess}/${this.logoChecks} accessible\n`
      );
    } else {
      console.log(
        `📷 Logo URL checks: Skipped (no recently modified services detected)\n`
      );
    }

    return this.errors.length === 0;
  }

  /**
   * Run all validations
   */
  async runAll() {
    console.log('Starting data validation...\n');

    await this.validateServices();
    this.validateManualData();
    this.validateI18nFiles();
    this.validateTypeScript();

    const success = this.printResults();
    process.exit(success ? 0 : 1);
  }
}

const validator = new DataValidator();
validator.runAll();

