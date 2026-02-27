import { SERVICE_CATEGORIES } from '../constants/protectData';

describe('SERVICE_CATEGORIES', () => {
  it('should be an object with category keys and array values', () => {
    expect(typeof SERVICE_CATEGORIES).toBe('object');
    Object.values(SERVICE_CATEGORIES).forEach(arr => {
      expect(Array.isArray(arr)).toBe(true);
    });
  });

  it('should not have duplicate slugs across categories', () => {
    const allSlugs = Object.values(SERVICE_CATEGORIES).flat();
    const uniqueSlugs = new Set(allSlugs);
    expect(allSlugs.length).toBe(uniqueSlugs.size);
  });

  it('should allow reverse mapping from slug to category', () => {
    const slugToCategory: Record<string, string> = {};
    for (const [category, slugs] of Object.entries(SERVICE_CATEGORIES)) {
      slugs.forEach(slug => {
        slugToCategory[slug] = category;
      });
    }
    Object.keys(slugToCategory).forEach(slug => {
      expect(typeof slugToCategory[slug]).toBe('string');
    });
  });
});
