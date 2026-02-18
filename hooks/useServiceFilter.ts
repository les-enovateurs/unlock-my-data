import { useMemo } from "react";

export interface FilterableService {
  slug: string;
  name: string;
  category?: string;
  [key: string]: any;
}

interface UseServiceFilterOptions {
  searchQuery: string;
  selectedCategory: string;
  searchFields?: string[];
}

/**
 * Hook personnalisé pour filtrer les services
 * Optimisé pour l'éco-conception avec useMemo
 *
 * @param services - Liste des services à filtrer
 * @param options - Options de filtrage
 * @returns Services filtrés
 */
export function useServiceFilter<T extends FilterableService>(
  services: T[],
  options: UseServiceFilterOptions
): T[] {
  const { searchQuery, selectedCategory, searchFields = ["name", "slug"] } = options;

  return useMemo(() => {
    let filtered = services;

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Filtre par recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((service) =>
        searchFields.some((field) => {
          const value = service[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    return filtered;
  }, [services, searchQuery, selectedCategory, searchFields]);
}

/**
 * Hook pour extraire les catégories uniques d'une liste de services
 *
 * @param services - Liste des services
 * @param categoryField - Nom du champ contenant la catégorie
 * @returns Catégories uniques avec leur nombre
 */
export function useServiceCategories<T extends FilterableService>(
  services: T[],
  categoryField: string = "category"
): Array<{ value: string; label: string; count: number }> {
  return useMemo(() => {
    const categoryCount = new Map<string, number>();

    services.forEach((service) => {
      const category = service[categoryField];
      if (category) {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    });

    return Array.from(categoryCount.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [services, categoryField]);
}

