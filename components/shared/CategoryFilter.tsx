"use client";

import { memo } from "react";
import { Filter } from "lucide-react";

export interface CategoryOption {
  value: string;
  label: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onChange: (category: string) => void;
  allCategoriesLabel?: string;
  className?: string;
}

/**
 * Filtre de catégories réutilisable optimisé pour l'éco-conception
 * - Mémoïsé pour éviter les re-renders
 * - Utilise les boutons natifs HTML
 * - Pas d'animations CSS coûteuses
 */
const CategoryFilter = memo(function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
  allCategoriesLabel = "Toutes les catégories",
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="font-semibold text-sm text-gray-900">Catégories</h3>
      </div>

      <div className="space-y-1">
        {/* Option "Toutes les catégories" */}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            selectedCategory === ""
              ? "bg-primary text-white font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-pressed={selectedCategory === ""}
        >
          <span>{allCategoriesLabel}</span>
          {selectedCategory === "" && categories.length > 0 && (
            <span className="ml-2 opacity-80">
              ({categories.reduce((sum, cat) => sum + (cat.count || 0), 0)})
            </span>
          )}
        </button>

        {/* Options de catégories */}
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === category.value
                ? "bg-primary text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-pressed={selectedCategory === category.value}
          >
            <span>{category.label}</span>
            {category.count !== undefined && (
              <span className={`ml-2 ${selectedCategory === category.value ? "opacity-80" : "text-gray-500"}`}>
                ({category.count})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

export default CategoryFilter;

