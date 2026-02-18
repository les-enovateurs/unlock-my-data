"use client";

import { memo } from "react";
import { Search, X } from "lucide-react";

interface ServiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant de recherche réutilisable optimisé pour l'éco-conception
 * - Mémoïsé pour éviter les re-renders inutiles
 * - Structure HTML minimale
 * - Pas de dépendances lourdes
 */
const ServiceSearchBar = memo(function ServiceSearchBar({
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
}: ServiceSearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        className="px-5 py-3 pl-12 bg-white rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={placeholder}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>
      {value && !disabled && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Effacer la recherche"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

export default ServiceSearchBar;
