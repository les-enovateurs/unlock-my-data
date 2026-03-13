"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import servicesData from "../public/data/services.json";
import { ServiceSuite } from "@/constants/digitalCleanUp";
import { DIGITAL_CLEAN_UP_SUITES } from "@/constants/digitalCleanUp";

export interface Service {
    slug: string;
    name: string;
    logo?: string;
    taglist?: string[];
    [key: string]: any;
}

export interface CleanUpGroup {
    id: string;
    name: string;
    logo?: string;
    children: Service[];
    isSuite: boolean;
}

interface CleanUpContextType {
    selectedServiceIds: string[];
    setSelectedServiceIds: (ids: string[]) => void;

    usedVolumes: Record<string, string>;
    setUsedVolumes: (vols: Record<string, string>) => void;

    savedVolumes: Record<string, number>;
    setSavedVolumes: (vols: Record<string, number>) => void;

    // Helper functions for navigation
    getOrderedSuites: () => CleanUpGroup[];
    getNextRoute: (currentPhase: "audit" | "clean", currentSuiteId: string) => string | null;
}

const CleanUpContext = createContext<CleanUpContextType | undefined>(undefined);

export function CleanUpProvider({ children }: { children: React.ReactNode }) {
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [usedVolumes, setUsedVolumes] = useState<Record<string, string>>({});
    const [savedVolumes, setSavedVolumes] = useState<Record<string, number>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    const filterRecordByKeys = <T,>(record: Record<string, T>, allowedKeys: Set<string>) => {
        const entries = Object.entries(record).filter(([key]) => allowedKeys.has(key));
        return Object.fromEntries(entries) as Record<string, T>;
    };

    // Persist to localStorage
    useEffect(() => {
        const storedSelected = localStorage.getItem("digitalCleanUp_selected");
        const storedUsed = localStorage.getItem("digitalCleanUp_usedVolumes");
        const storedSaved = localStorage.getItem("digitalCleanUp_savedVolumes");

        if (storedSelected) setSelectedServiceIds(JSON.parse(storedSelected));
        if (storedUsed) setUsedVolumes(JSON.parse(storedUsed));
        if (storedSaved) setSavedVolumes(JSON.parse(storedSaved));

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("digitalCleanUp_selected", JSON.stringify(selectedServiceIds));
    }, [selectedServiceIds, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("digitalCleanUp_usedVolumes", JSON.stringify(usedVolumes));
    }, [usedVolumes, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("digitalCleanUp_savedVolumes", JSON.stringify(savedVolumes));
    }, [savedVolumes, isLoaded]);

    // Keep only values related to currently selected services/suites
    useEffect(() => {
        if (!isLoaded) return;

        const selectedSet = new Set(selectedServiceIds);
        const suiteIds = new Set(
            DIGITAL_CLEAN_UP_SUITES
                .filter((suite) => suite.children.some((childSlug) => selectedSet.has(childSlug)))
                .map((suite) => suite.id)
        );

        const allowedUsedKeys = new Set([...selectedSet, ...suiteIds]);
        const nextUsed = filterRecordByKeys(usedVolumes, allowedUsedKeys);
        if (JSON.stringify(nextUsed) !== JSON.stringify(usedVolumes)) {
            setUsedVolumes(nextUsed);
        }

        const nextSaved = filterRecordByKeys(savedVolumes, selectedSet);
        if (JSON.stringify(nextSaved) !== JSON.stringify(savedVolumes)) {
            setSavedVolumes(nextSaved);
        }
    }, [isLoaded, selectedServiceIds, usedVolumes, savedVolumes]);

    const getOrderedSuites = () => {
        const groupMap = new Map<string, CleanUpGroup>();

        selectedServiceIds.forEach(slug => {
            const service = (servicesData as Service[]).find(s => s.slug === slug);
            if (!service) return;

            const suite = DIGITAL_CLEAN_UP_SUITES.find(s => s.children.includes(slug));

            if (suite) {
                if (!groupMap.has(suite.id)) {
                    groupMap.set(suite.id, {
                        id: suite.id,
                        isSuite: true,
                        name: suite.name,
                        logo: suite.logo,
                        children: []
                    });
                }
                groupMap.get(suite.id)!.children.push(service);
            } else {
                groupMap.set(slug, {
                    id: slug,
                    isSuite: false,
                    name: service.name,
                    logo: service.logo,
                    children: [service]
                });
            }
        });

        // Group sort: Suites first (in order of DIGITAL_CLEAN_UP_SUITES), then others alphabetically
        return Array.from(groupMap.values()).sort((a, b) => {
            if (a.isSuite && b.isSuite) {
                const indexA = DIGITAL_CLEAN_UP_SUITES.findIndex(s => s.id === a.id);
                const indexB = DIGITAL_CLEAN_UP_SUITES.findIndex(s => s.id === b.id);
                return indexA - indexB;
            }
            if (a.isSuite && !b.isSuite) return -1;
            if (!a.isSuite && b.isSuite) return 1;
            return a.name.localeCompare(b.name);
        });
    };

    const getNextRoute = (currentPhase: "audit" | "clean", currentSuiteId: string) => {
        const suites = getOrderedSuites();
        const currentIndex = suites.findIndex(s => s.id === currentSuiteId);

        if (currentIndex === -1) return "/digital-clean-up"; // Fallback to start

        if (currentPhase === "audit") {
            // After audit, go to clean phase of same suite
            return `/digital-clean-up/clean/${currentSuiteId}`;
        } else {
            // After clean, go to audit phase of NEXT suite
            if (currentIndex + 1 < suites.length) {
                return `/digital-clean-up/audit/${suites[currentIndex + 1].id}`;
            } else {
                // If last suite, go to recap
                return `/digital-clean-up/recap`;
            }
        }
    };

    return (
        <CleanUpContext.Provider
            value={{
                selectedServiceIds,
                setSelectedServiceIds,
                usedVolumes,
                setUsedVolumes,
                savedVolumes,
                setSavedVolumes,
                getOrderedSuites,
                getNextRoute
            }}
        >
            {children}
        </CleanUpContext.Provider>
    );
}

export function useCleanUpContext() {
    const context = useContext(CleanUpContext);
    if (context === undefined) {
        throw new Error("useCleanUpContext must be used within a CleanUpProvider");
    }
    return context;
}
