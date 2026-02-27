/**
 * Tests unitaires pour la validation de services
 */

import { validateServiceJSON, validateServices, filterByStatus, getPublishedServices } from '../validateService';

describe('validateServiceJSON', () => {
  test('rejects if required fields are missing', () => {
    const { isValid, errors } = validateServiceJSON({ name: 'Test' });
    expect(isValid).toBe(false);
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('status')]));
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('created_at')]));
  });

  test('accepts minimal valid data', () => {
    const validData = {
      name: 'Test Service',
      status: 'draft',
      created_at: '2026-02-24',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
    };
    const { isValid, errors } = validateServiceJSON(validData);
    expect(isValid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('accepts valid status', () => {
    const data = {
      name: 'Test',
      status: 'published',
      created_at: '2026-02-24',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
      contact_mail_export: 'test@example.com',
    };
    const { isValid } = validateServiceJSON(data);
    expect(isValid).toBe(true);
  });

  test('rejects invalid status', () => {
    const data = {
      name: 'Test',
      status: 'invalid_status',
      created_at: '2026-02-24',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
    };
    const { isValid, errors } = validateServiceJSON(data);
    expect(isValid).toBe(false);
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('Invalid status')]));
  });

  test('accepts valid review array', () => {
    const data = {
      name: 'Ikea',
      status: 'changes_requested',
      created_at: '2026-02-24',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
      review: [
        {
          field: 'privacy_policy_quote',
          message: 'À modifier',
          reviewer: 'mod@example.com',
          timestamp: '2026-02-24T10:30:00Z',
        },
      ],
    };
    const { isValid, errors } = validateServiceJSON(data);
    expect(isValid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('rejects poorly structured review', () => {
    const data = {
      name: 'Test',
      status: 'draft',
      created_at: '2026-02-24',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
      review: [{ field: 'name' }], // message manquant
    };
    const { isValid, errors } = validateServiceJSON(data);
    expect(isValid).toBe(false);
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('review[0]')]));
  });

  test('validates ISO 8601 dates', () => {
    const validDates = [
      '2026-02-24',
      '2026-02-24T10:30:00Z',
      '2026-02-24T10:30:00+02:00',
    ];

    for (const date of validDates) {
      const data = {
        name: 'Test',
        status: 'draft',
        created_at: date,
        created_by: 'john@example.com',
        updated_at: date,
      };
      const { errors } = validateServiceJSON(data);
      expect(errors).not.toContain(expect.stringContaining('created_at'));
    }
  });

  test('rejects invalid dates', () => {
    const data = {
      name: 'Test',
      status: 'draft',
      created_at: 'invalid-date',
      created_by: 'john@example.com',
      updated_at: '2026-02-24',
    };
    const { isValid, errors } = validateServiceJSON(data);
    expect(isValid).toBe(false);
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('created_at')]));
  });
});

describe('validateServices', () => {
  test('validates array of services', () => {
    const services = [
      {
        name: 'Service1',
        status: 'draft',
        created_at: '2026-02-24',
        created_by: 'john@example.com',
        updated_at: '2026-02-24',
      },
      {
        name: 'Service2',
        status: 'published',
        created_at: '2026-02-24',
        created_by: 'jane@example.com',
        updated_at: '2026-02-24',
        contact_mail_export: 'test@example.com',
      },
    ];

    const results = validateServices(services);
    expect(results).toHaveLength(2);
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(true);
  });
});

describe('filterByStatus', () => {
  const services = [
    { name: 'A', status: 'draft' },
    { name: 'B', status: 'changes_requested' },
    { name: 'C', status: 'published' },
  ] as any[];

  test('filters by draft', () => {
    const result = filterByStatus(services, 'draft');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('A');
  });

  test('filters by published', () => {
    const result = filterByStatus(services, 'published');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('C');
  });

  test('returns all if status=all', () => {
    const result = filterByStatus(services, 'all');
    expect(result).toHaveLength(3);
  });
});

describe('getPublishedServices', () => {
  test('returns only published and cleans properties', () => {
    const services = [
      {
        name: 'Draft',
        status: 'draft',
        review: [{ field: 'test', message: 'msg' }],
        created_at: '2026-02-24',
        created_by: 'john@example.com',
        updated_at: '2026-02-24',
      },
      {
        name: 'Published',
        status: 'published',
        created_at: '2026-02-24',
        created_by: 'john@example.com',
        updated_at: '2026-02-24',
      },
    ] as any[];

    const result = getPublishedServices(services);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Published');
    expect(result[0].status).toBeUndefined();
    expect(result[0].review).toBeUndefined();
  });
});
