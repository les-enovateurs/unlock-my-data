"use client";

import { memo } from "react";

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
  translations: {
    progressGlobal: string;
    processedXofY: string;
  };
}

/**
 * Barre de progression pour le suivi de la suppression
 * Optimisée avec React.memo pour l'éco-conception
 */
const ProgressBar = memo(function ProgressBar({
  progress,
  completed,
  total,
  translations,
}: ProgressBarProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">{translations.progressGlobal}</span>
          <span className="text-sm">{progress}%</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
          aria-label={`Progression: ${progress}%`}
        ></progress>
        <p className="text-xs text-base-content/70 mt-1">
          {translations.processedXofY
            .replace("{completed}", String(completed))
            .replace("{total}", String(total))}
        </p>
      </div>
    </div>
  );
});

export default ProgressBar;

