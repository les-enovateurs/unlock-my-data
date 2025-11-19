"use client";

import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react'

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

function detectInitialLang(fallback: Lang = 'fr'): Lang {
    if (typeof window === 'undefined') return fallback
    // Priority: localStorage -> cookie -> URL prefix (/en) -> browser language -> fallback
    try {
        const stored = window.localStorage.getItem('lang') as Lang | null
        if (stored === 'fr' || stored === 'en') return stored
    } catch {}
    const cookie = readCookie('lang') as Lang | undefined
    if (cookie === 'fr' || cookie === 'en') return cookie
    const path = window.location?.pathname || ''
    if (path === '/en' || path.startsWith('/en/')) return 'en'
    const nav = typeof navigator !== 'undefined' ? navigator.language || '' : ''
    if (nav.toLowerCase().startsWith('en')) return 'en'
    return fallback
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
    const [lang, setLangState] = useState<Lang>(initialLang || (typeof window !== 'undefined' ? detectInitialLang('fr') : 'fr'))

    // On mount (client), re-check persisted value to sync hydration if needed
    useEffect(() => {
        const detected = detectInitialLang(lang)
        if (detected !== lang) setLangState(detected)
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
