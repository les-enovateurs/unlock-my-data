"use client";

import { memo } from "react";

interface ActionButtonsProps {
  onPrevious?: () => void;
  onSkip: () => void;
  onComplete: () => void;
  onNext?: () => void;
  showPrevious: boolean;
  showNext: boolean;
  translations: {
    previous: string;
    skipForLater: string;
    markCompleted: string;
    next: string;
  };
}

/**
 * Boutons d'action pour la navigation dans les services
 * Optimisé avec React.memo
 */
const ActionButtons = memo(function ActionButtons({
  onPrevious,
  onSkip,
  onComplete,
  onNext,
  showPrevious,
  showNext,
  translations,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-between">
      {showPrevious && onPrevious && (
        <button onClick={onPrevious} className="btn btn-outline">
          {translations.previous}
        </button>
      )}

      <div className="flex gap-3 ml-auto">
        <button onClick={onSkip} className="btn btn-warning">
          {translations.skipForLater}
        </button>
        <button
          onClick={() => {
            onComplete();
            onNext?.();
          }}
          className="btn btn-success"
        >
          {translations.markCompleted}
        </button>
      </div>

      {showNext && onNext && (
        <button onClick={onNext} className="btn btn-primary ml-auto">
          {translations.next}
        </button>
      )}
    </div>
  );
});

export default ActionButtons;

