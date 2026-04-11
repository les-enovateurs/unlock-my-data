"use client";

import { memo } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Translator from "@/components/tools/t";
import sharedDict from "@/i18n/Shared.json";

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
 * Optimized for accessibility and eco-design
 */
const DeletionServiceCard = memo(function DeletionServiceCard({
  service,
  isSelected,
  onToggle,
}: DeletionServiceCardProps) {
  const { lang } = useLanguage();
  const t = new Translator(sharedDict, lang);

  return (
    <div
      className={`card shadow-lg bg-white hover:shadow-xl transition-all duration-200 cursor-pointer relative ${
        isSelected ? "ring-2 ring-success border-success" : "border-gray-100"
      }`}
    >
      <label className="card-body p-4 cursor-pointer">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(service.slug)}
            className="checkbox checkbox-success text-white mt-1 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
            aria-label={t.t("selectService", { service: service.name })}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-32 h-16">
                <Image
                  fill
                  src={service.logo}
                  alt={service.name}
                  className="object-contain p-1"
                  sizes="128px"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                  {service.nationality || "International"}
                </span>
              </div>
            </div>
            {/* Invisibly extend click area for the whole card to the checkbox label */}
            <span className="sr-only">{service.name}</span>
          </div>
        </div>
      </label>
    </div>
  );
});

export default DeletionServiceCard;
