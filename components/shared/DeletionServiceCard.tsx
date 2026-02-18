"use client";

import { memo } from "react";
import Image from "next/image";

interface DeletionServiceCardProps {
  service: {
    slug: string;
    name: string;
    logo: string;
    nationality: string;
  };
  isSelected: boolean;
  onToggle: (slug: string) => void;
}

/**
 * Service card for data deletion selection
 * Optimized for eco-design with React.memo
 */
const DeletionServiceCard = memo(function DeletionServiceCard({
  service,
  isSelected,
  onToggle,
}: DeletionServiceCardProps) {
  return (
    <div
      className={`card shadow-lg bg-white hover:shadow-xl transition-shadow cursor-pointer ${
        isSelected ? "ring-2 ring-success" : ""
      }`}
      onClick={() => onToggle(service.slug)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(service.slug);
        }
      }}
      aria-pressed={isSelected}
    >
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="checkbox checkbox-success text-white mt-1"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-32 h-16">
                <Image
                  fill
                  src={service.logo}
                  alt={`Logo de ${service.name}`}
                  className="object-contain p-1"
                  sizes="128px"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  {service.nationality || "International"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DeletionServiceCard;

