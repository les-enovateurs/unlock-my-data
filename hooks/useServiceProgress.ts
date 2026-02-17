import { useState, useCallback } from "react";

/**
 * Custom hook to manage service completion/skip state
 * Eco-conception: Grouped related state, optimized updates
 */
export function useServiceProgress() {
  const [completedServices, setCompletedServices] = useState<string[]>([]);
  const [skippedServices, setSkippedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

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

  const reset = useCallback(() => {
    setCompletedServices([]);
    setSkippedServices([]);
    setNotes({});
  }, []);

  const loadState = useCallback((data: {
    completedServices?: string[];
    skippedServices?: string[];
    notes?: Record<string, string>;
  }) => {
    if (data.completedServices) setCompletedServices(data.completedServices);
    if (data.skippedServices) setSkippedServices(data.skippedServices);
    if (data.notes) setNotes(data.notes);
  }, []);

  return {
    completedServices,
    skippedServices,
    notes,
    markAsCompleted,
    markAsSkipped,
    updateNote,
    reset,
    loadState,
  };
}

