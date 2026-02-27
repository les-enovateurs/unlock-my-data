/**
 * Validation for service data
 * No external dependencies (no Zod)
 */

import type { ServiceData, ValidationResult } from './types';

const REQUIRED_FIELDS = [
  'name',
  'status',
  'created_at',
  'created_by',
  'updated_at',
] as const;

const VALID_STATUSES = ['draft', 'changes_requested', 'published'] as const;

/**
 * Validates the JSON structure of a service
 * @param data - Service data to validate
 * @returns A validation object with isValid and errors
 */
export function validateServiceJSON(data: any): ValidationResult {
  const errors: string[] = [];

  // Check that it's an object
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Data must be a valid JSON object'],
    };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(
      `Invalid status: ${data.status}. Must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  // Check dates (ISO 8601 format)
  const dateFields = ['created_at', 'updated_at', 'status_updated_at'];
  for (const field of dateFields) {
    if (data[field] && !isValidISODate(data[field])) {
      errors.push(`${field} is not a valid ISO date (YYYY-MM-DD or ISO 8601)`);
    }
  }

  // Check review structure (if present)
  if (data.review !== undefined) {
    if (!Array.isArray(data.review)) {
      errors.push('review must be an array');
    } else {
      // Check each review item
      data.review.forEach((item: any, idx: number) => {
        if (!item.field || !item.message) {
          errors.push(
            `review[${idx}]: "field" and "message" properties are required`
          );
        }
        if (typeof item.field !== 'string' || typeof item.message !== 'string') {
          errors.push(
            `review[${idx}]: "field" and "message" must be strings`
          );
        }
      });
    }
  }

  // Check contact properties (at least one)
  const contactFields = [
    'contact_mail_export',
    'url_export',
    'address_export',
  ];
  const hasContact = contactFields.some((field) => data[field]);
  if (data.status === 'published' && !hasContact) {
    errors.push(
      'A published card must have at least one contact method (email, URL or address)'
    );
  }

  // Check bilingual properties consistency (recommendation, not error)
  const bilingualFields = [
    'details_required_documents',
    'response_format',
    'response_delay',
    'privacy_policy_quote',
  ];

  for (const field of bilingualFields) {
    const frField = data[field];
    const enField = data[`${field}_en`];

    if (frField && !enField) {
      // Warning, not an error
      console.warn(`⚠️ Missing translation: ${field}_en`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a string is a valid ISO date
 * @param dateString - String to validate
 * @returns true if valid, false otherwise
 */
function isValidISODate(dateString: string): boolean {
  // Accepted formats: YYYY-MM-DD or complete ISO 8601
  const isoRegex =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!isoRegex.test(dateString)) {
    return false;
  }

  // Check that it's a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate multiple services in a single operation
 * @param services - Array of services to validate
 * @returns Array with validation results for each
 */
export function validateServices(
  services: any[]
): Array<{
  name: string;
  isValid: boolean;
  errors: string[];
}> {
  return services.map((service) => ({
    name: service.name || 'Unknown',
    ...validateServiceJSON(service),
  }));
}

/**
 * Filter services by status
 * @param services - Services to filter
 * @param status - Status(es) to keep
 * @returns Filtered services
 */
export function filterByStatus(
  services: ServiceData[],
  status: 'draft' | 'changes_requested' | 'published' | 'all' = 'all'
): ServiceData[] {
  if (status === 'all') {
    return services;
  }
  return services.filter((s) => s.status === status);
}

/**
 * Get services ready for public compilation
 * @param services - All services
 * @returns Published services only
 */
export function getPublishedServices(services: ServiceData[]): ServiceData[] {
  return filterByStatus(services, 'published').map((service) => {
    // Clean draft/review properties
    const { review, status, status_updated_at, submitted_by, ...clean } = service;
    return clean as ServiceData;
  });
}
