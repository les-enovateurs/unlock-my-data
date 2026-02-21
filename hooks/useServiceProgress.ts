import { useState, useCallback } from "react";

/**
 * Custom hook to manage service completion/skip state
 * Eco-conception: Grouped related state, optimized updates
 */
export function useServiceProgress() {
  const [completedServices, setCompletedServices] = useState<string[]>([]);
  const [skippedServices, setSkippedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [alternativesAdopted, setAlternativesAdopted] = useState<Record<string, string>>({});
  const [alternativesSkipped, setAlternativesSkipped] = useState<string[]>([]);
  const [passwordsChanged, setPasswordsChanged] = useState<string[]>([]);
  const [dataExported, setDataExported] = useState<string[]>([]);

  const markAsCompleted = useCallback((slug: string) => {
    setCompletedServices((prev) =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
    setSkippedServices((prev) => prev.filter((s) => s !== slug));
  }, []);

  const markAsSkipped = useCallback((slug: string) => {
    setSkippedServices((prev) =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
    setCompletedServices((prev) => prev.filter((s) => s !== slug));
  }, []);

  const updateNote = useCallback((slug: string, note: string) => {
    setNotes((prev) => ({ ...prev, [slug]: note }));
  }, []);

  const markAlternativeAdopted = useCallback((slug: string, alternativeSlug: string) => {
    setAlternativesAdopted((prev) => ({ ...prev, [slug]: alternativeSlug }));
    setAlternativesSkipped((prev) => prev.filter((s) => s !== slug));
  }, []);

  const markAlternativeSkipped = useCallback((slug: string) => {
    setAlternativesSkipped((prev) =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
    // Remove from adopted if skipping (though practically unlikely to happen in this order)
    const {[slug]: _, ...rest} = alternativesAdopted;
    if (alternativesAdopted[slug]) {
        setAlternativesAdopted(rest);
    }
  }, [alternativesAdopted]);

  const markPasswordChanged = useCallback((slug: string) => {
    setPasswordsChanged((prev) =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
  }, []);

  const markDataExported = useCallback((slug: string) => {
    setDataExported((prev) =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
  }, []);

  const reset = useCallback(() => {
    setCompletedServices([]);
    setSkippedServices([]);
    setNotes({});
    setAlternativesAdopted({});
    setAlternativesSkipped([]);
    setPasswordsChanged([]);
    setDataExported([]);
  }, []);

  const loadState = useCallback((saved: any) => {
    if (saved.completedServices) setCompletedServices(saved.completedServices);
    if (saved.skippedServices) setSkippedServices(saved.skippedServices);
    if (saved.notes) setNotes(saved.notes);
    if (saved.alternativesAdopted) setAlternativesAdopted(saved.alternativesAdopted);
    if (saved.alternativesSkipped) setAlternativesSkipped(saved.alternativesSkipped);
    if (saved.passwordsChanged) setPasswordsChanged(saved.passwordsChanged);
    if (saved.dataExported) setDataExported(saved.dataExported);
  }, []);

  return {
    completedServices,
    skippedServices,
    notes,
    alternativesAdopted,
    alternativesSkipped,
    passwordsChanged,
    dataExported,
    markAsCompleted,
    markAsSkipped,
    updateNote,
    markAlternativeAdopted,
    markAlternativeSkipped,
    markPasswordChanged,
    markDataExported,
    reset,
    loadState,
  };
}
