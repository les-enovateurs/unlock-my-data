"use client";

import { memo } from "react";
import ServiceCard, { ServiceCardData } from "./ServiceCard";

interface ServiceGridProps {
  services: ServiceCardData[];
  onServiceSelect?: (slug: string) => void;
  selectedServices?: Set<string>;
  showRiskLevel?: boolean;
  emptyMessage?: string;
  renderActionButton?: (service: ServiceCardData) => React.ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

/**
 * Grille de services réutilisable optimisée pour l'éco-conception
 * - Mémoïsée pour éviter les re-renders
 * - Grille responsive configurable
 * - Virtualisation potentielle pour grandes listes
 */
const ServiceGrid = memo(function ServiceGrid({
  services,
  onServiceSelect,
  selectedServices = new Set(),
  showRiskLevel = true,
  emptyMessage = "Aucun service trouvé",
  renderActionButton,
  columns = {
    default: 1,
    md: 2,
    lg: 3,
  },
  className = "",
}: ServiceGridProps) {
  // Construction des classes de grille
  const gridClasses = [
    `grid gap-6`,
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {services.map((service) => (
        <ServiceCard
          key={service.slug}
          service={service}
          onSelect={onServiceSelect}
          isSelected={selectedServices.has(service.slug)}
          showRiskLevel={showRiskLevel}
          actionButton={renderActionButton?.(service)}
        />
      ))}
    </div>
  );
});

export default ServiceGrid;

