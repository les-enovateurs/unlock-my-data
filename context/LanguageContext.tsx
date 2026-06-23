"use client";

import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react'
import {usePathname} from "next/navigation";

export type Lang = 'fr' | 'en'

type LanguageContextValue = {
    lang: Lang
    setLang: (lang: Lang) => void
    toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

function readCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
    return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

function writeCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 365) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`
}

// English content routes are NOT prefixed with /en in this project (e.g.
// /contribute, /list-app, /compare). They must be recognised explicitly,
// otherwise the pathname→lang sync forces lang back to 'fr' on every EN page.
const EN_ROUTE_PREFIXES = [
    '/en',
    '/list-app',
    '/protect-my-data',
    '/evaluate-my-risks',
    '/compare',
    '/transfers',
    '/press',
    '/delete-my-data',
    '/contribute',
    '/contributors',
    '/legal-notice',
    '/privacy-policy',
    '/workshops',
]

// Exact match or match followed by "/" — avoids FR routes falsely matching an
// EN prefix (e.g. "/comparer" must NOT match "/compare").
function pathStartsWith(path: string, prefix: string): boolean {
    return path === prefix || path.startsWith(prefix + '/')
}

function detectLangFromPath(path: string): Lang | null {
    if (EN_ROUTE_PREFIXES.some((p) => pathStartsWith(path, p))) return 'en'
    return 'fr'
}

function detectInitialLang(fallback: Lang = 'fr'): Lang {
    if (typeof window === 'undefined') return fallback
    // Priority: URL prefix (/en) -> localStorage -> cookie -> browser language -> fallback
    const path = window.location?.pathname || ''
    const pathLang = detectLangFromPath(path)
    if (pathLang) return pathLang

    try {
        const stored = window.localStorage.getItem('lang') as Lang | null
        if (stored === 'fr' || stored === 'en') return stored
    } catch {}
    const cookie = readCookie('lang') as Lang | undefined
    if (cookie === 'fr' || cookie === 'en') return cookie
    const nav = typeof navigator !== 'undefined' ? navigator.language || '' : ''
    if (nav.toLowerCase().startsWith('en')) return 'en'
    return fallback
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
    const [lang, setLangState] = useState<Lang>(initialLang || 'fr')
    const pathname = usePathname()

    // Sync with pathname
    useEffect(() => {
        const pathLang = detectLangFromPath(pathname)
        if (pathLang && pathLang !== lang) {
            setLangState(pathLang)
        }
    }, [pathname, lang])

    // On mount (client), re-check persisted value to sync hydration if needed
    useEffect(() => {
        if (!initialLang) {
            const detected = detectInitialLang('fr')
            if (detected !== lang) setLangState(detected)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Persist and reflect on <html lang="...">
        try { window.localStorage.setItem('lang', lang) } catch {}
        writeCookie('lang', lang)
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('lang', lang)
        }
    }, [lang])

    const api = useMemo<LanguageContextValue>(() => ({
        lang,
        setLang: (l: Lang) => setLangState(l),
        toggleLang: () => setLangState((prev) => (prev === 'fr' ? 'en' : 'fr')),
    }), [lang])

    return (
        <LanguageContext.Provider value={api}>{children}</LanguageContext.Provider>
    )
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext)
    if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
    return ctx
}
