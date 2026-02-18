"use client";

import { memo } from "react";
import Image from "next/image";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface ServiceCardData {
  slug: string;
  name: string;
  logo: string;
  short_description?: string;
  risk_level?: number;
  category?: string;
  nationality?: string;
  country_name?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  onSelect?: (slug: string) => void;
  isSelected?: boolean;
  showRiskLevel?: boolean;
  actionButton?: React.ReactNode;
  className?: string;
}

/**
 * Reusable service card optimized for eco-design
 * - Memoized to prevent unnecessary re-renders
 * - Optimized image loading with Next.js Image
 * - Conditional rendering to minimize DOM size
 */
const ServiceCard = memo(function ServiceCard({
  service,
  onSelect,
  isSelected = false,
  showRiskLevel = true,
  actionButton,
  className = "",
}: ServiceCardProps) {
  const getRiskColor = (risk: number = 0) => {
    if (risk >= 70) return "text-red-600 bg-red-50 border-red-200";
    if (risk >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getRiskIcon = (risk: number = 0) => {
    if (risk >= 70) return AlertTriangle;
    if (risk >= 40) return Shield;
    return CheckCircle2;
  };

  const RiskIcon = showRiskLevel && service.risk_level !== undefined
    ? getRiskIcon(service.risk_level)
    : null;

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
      } ${className}`}
      onClick={() => onSelect?.(service.slug)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(service.slug);
              }
            }
          : undefined
      }
    >
      <div className="p-5">
        {/* Header with logo and country info */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative w-20 h-12 shrink-0">
            <Image
              src={service.logo}
              alt={`Logo ${service.name}`}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          {(service.nationality || service.country_name) && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              {service.nationality || service.country_name}
            </span>
          )}
        </div>

        {/* Service name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {service.name}
        </h3>

        {/* Description */}
        {service.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.short_description}
          </p>
        )}

        {/* Category */}
        {service.category && (
          <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded mb-3">
            {service.category}
          </span>
        )}

        {/* Risk level */}
        {showRiskLevel && service.risk_level !== undefined && RiskIcon && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getRiskColor(service.risk_level)}`}>
            <RiskIcon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">
              Risque: {service.risk_level}/100
            </span>
          </div>
        )}

        {/* Action button */}
        {actionButton && (
          <div className="mt-3">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
});

export default ServiceCard;

