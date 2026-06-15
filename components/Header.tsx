"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronDown,
    Menu,
    X,
    LayoutGrid,
    Scale,
    GitFork,
    Newspaper,
    Shield,
    Trash2,
    Sparkles,
    ShieldAlert,
    type LucideIcon,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useLanguage } from "@/context/LanguageContext";
import dict from "../i18n/Shared.json";
import headerDict from "../i18n/Header.json";
import Translator from "./tools/t";

type NavLeaf = {
    name: string;
    href: string;
    icon: LucideIcon;
    sub: string;
};

type NavigationSubItem = {
    name: string;
    href: string;
};

type NavigationGroup = {
    title: string;
    items: NavigationSubItem[];
};

type NavigationItem = {
    name: string;
    href?: string;
    leaves?: NavLeaf[];
    submenuGroups?: NavigationGroup[];
};

const FR_TO_EN_MAPPING: Record<string, string> = {
    '/liste-applications': '/list-app',
    '/proteger-mes-donnees': '/protect-my-data',
    '/evaluer-mes-risques': '/evaluate-my-risks',
    '/comparer': '/compare',
    '/transferts': '/transfers',
    '/presse': '/press',
    '/supprimer-mes-donnees': '/delete-my-data',
    '/contribuer/missions': '/contribute/missions',
    '/contribuer/nouvelle-fiche': '/contribute/new-form',
    '/contribuer/modifier-fiche': '/contribute/update-form',
    '/contribuer/modifier-guides': '/contribute/update-guides',
    '/contribuer/signaler-fuite': '/contribute/report-leak',
    '/contribuer/signaler-vulnerabilite': '/contribute/report-vulnerability',
    '/contribuer/fiches-a-revoir': '/contribute/forms-to-review',
    '/contribuer': '/contribute',
    '/contributeurs': '/contributors',
    '/contribuer/attestation-engagement': '/contribute/engagement-certificate',
    '/mentions-legales': '/legal-notice',
    '/politique-confidentialite': '/privacy-policy',
    '/ateliers': '/',
    '/nettoyage-numerique': '/digital-clean-up'
};

const EN_TO_FR_MAPPING = Object.entries(FR_TO_EN_MAPPING).reduce((acc, [fr, en]) => {
    acc[en] = fr;
    return acc;
}, {} as Record<string, string>);

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
    const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
    const desktopMenuRef = useRef<HTMLDivElement | null>(null);
    const { lang, toggleLang } = useLanguage();
    const t = new Translator(dict, lang);
    const ht = useMemo(() => new Translator(headerDict, lang), [lang]);
    const router = useRouter();
    const isFr = lang === 'fr';

    const contributeGroups: NavigationGroup[] = useMemo(() => isFr ? [
        {
            title: ht.t("guide"),
            items: [
                { name: ht.t("howToContribute"), href: "/contribuer" },
                { name: ht.t("missions"), href: "/contribuer/missions" },
                { name: ht.t("contributors"), href: "/contributeurs" },
                { name: ht.t("engagementCertificate"), href: "/contribuer/attestation-engagement" },
            ]
        },
        {
            title: ht.t("contributionActions"),
            items: [
                { name: ht.t("formsToReview"), href: "/contribuer/fiches-a-revoir" },
                { name: ht.t("newForm"), href: "/contribuer/nouvelle-fiche" },
                { name: ht.t("updateForm"), href: "/contribuer/modifier-fiche" },
                { name: ht.t("updateGuides"), href: "/contribuer/modifier-guides" },
            ]
        },
        {
            title: ht.t("security"),
            items: [
                { name: ht.t("reportLeak"), href: "/contribuer/signaler-fuite" },
                { name: ht.t("reportVulnerability"), href: "/contribuer/signaler-vulnerabilite" },
            ]
        }
    ] : [
        {
            title: ht.t("guide"),
            items: [
                { name: ht.t("howToContribute"), href: "/contribute" },
                { name: ht.t("missions"), href: "/contribute/missions" },
                { name: ht.t("contributors"), href: "/contributors" },
                { name: ht.t("engagementCertificate"), href: "/contribute/engagement-certificate" },
            ]
        },
        {
            title: ht.t("contributionActions"),
            items: [
                { name: ht.t("formsToReview"), href: "/contribute/forms-to-review" },
                { name: ht.t("newForm"), href: "/contribute/new-form" },
                { name: ht.t("updateForm"), href: "/contribute/update-form" },
                { name: ht.t("updateGuides"), href: "/contribute/update-guides" },
            ]
        },
        {
            title: ht.t("security"),
            items: [
                { name: ht.t("reportLeak"), href: "/contribute/report-leak" },
                { name: ht.t("reportVulnerability"), href: "/contribute/report-vulnerability" },
            ]
        }
    ], [ht, isFr]);

    const navigation: NavigationItem[] = useMemo(() => [
        { name: ht.t("home"), href: isFr ? "/" : "/en" },
        {
            name: ht.t("explore"),
            leaves: [
                { name: ht.t("catalogApps"), sub: ht.t("catalogAppsSub"), icon: LayoutGrid, href: isFr ? "/liste-applications" : "/list-app" },
                { name: ht.t("compareServicesPlain"), sub: ht.t("compareServicesSub"), icon: Scale, href: isFr ? "/comparer" : "/compare" },
                { name: ht.t("transfersMap"), sub: ht.t("transfersMapSub"), icon: GitFork, href: isFr ? "/transferts" : "/transfers" },
                { name: ht.t("pressSpace"), sub: ht.t("pressSpaceSub"), icon: Newspaper, href: isFr ? "/presse" : "/press" },
            ],
        },
        {
            name: ht.t("act"),
            leaves: [
                { name: ht.t("protectMyDataPlain"), sub: ht.t("protectMyDataSub"), icon: Shield, href: isFr ? "/proteger-mes-donnees" : "/protect-my-data" },
                { name: ht.t("deleteMyDataPlain"), sub: ht.t("deleteMyDataSub"), icon: Trash2, href: isFr ? "/supprimer-mes-donnees" : "/delete-my-data" },
                { name: ht.t("digitalCleanUpPlain"), sub: ht.t("digitalCleanUpSub"), icon: Sparkles, href: isFr ? "/nettoyage-numerique" : "/digital-clean-up" },
            ],
        },
        {
            name: ht.t("workshops"),
            leaves: [
                { name: ht.t("allWorkshops"), sub: ht.t("allWorkshopsSub"), icon: LayoutGrid, href: "/ateliers" },
                { name: ht.t("leakWorkshop"), sub: ht.t("leakWorkshopSub"), icon: ShieldAlert, href: "/ateliers/urgence-fuite" },
            ],
        },
        {
            name: ht.t("contribute"),
            submenuGroups: contributeGroups,
        },
    ], [ht, isFr, contributeGroups]);

    const currentPathname = usePathname() || '/';

    const isActiveItem = (item: NavigationItem): boolean => {
        if (item.href) {
            if (item.href === "/" && currentPathname === "/") return true;
            if (item.href === "/en" && currentPathname === "/en") return true;
            if (item.href !== "/" && item.href !== "/en" && currentPathname.startsWith(item.href)) return true;
        }
        if (item.leaves) return item.leaves.some(leaf => currentPathname.startsWith(leaf.href));
        if (item.submenuGroups) return item.submenuGroups.some(group => group.items.some(subItem => currentPathname.startsWith(subItem.href)));
        return false;
    };

    const isActiveSubItem = (href: string): boolean => currentPathname === href;

    const getSwitchUrl = (targetLang: 'fr' | 'en') => {
        if (targetLang === 'en') {
            if (currentPathname === '/') return '/en';
            const sortedKeys = Object.keys(FR_TO_EN_MAPPING).sort((a, b) => b.length - a.length).filter(key => key !== '/');
            for (const key of sortedKeys) {
                if (currentPathname.startsWith(key)) return currentPathname.replace(key, FR_TO_EN_MAPPING[key]);
            }
            return '/en';
        } else {
            if (currentPathname === '/en') return '/';
            const sortedKeys = Object.keys(EN_TO_FR_MAPPING).sort((a, b) => b.length - a.length).filter(key => key !== '/');
            for (const key of sortedKeys) {
                if (currentPathname.startsWith(key)) return currentPathname.replace(key, EN_TO_FR_MAPPING[key]);
            }
            return '/';
        }
    };

    const switchUrl = getSwitchUrl(isFr ? 'en' : 'fr');

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
                setOpenDesktopMenu(null);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenDesktopMenu(null);
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        setOpenDesktopMenu(null);
        setMobileOpenMenu(null);
        setIsOpen(false);
    }, [currentPathname, lang]);

    // Éco-conçu : sobre, sans animation — instant state changes only.
    const navLinkBase = "px-3 py-2 text-sm font-semibold rounded-lg block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300";
    const navLinkActive = "text-umd-indigo-800 bg-umd-indigo-50";
    const navLinkIdle = "text-umd-slate-600 hover:text-umd-indigo-700 hover:bg-umd-indigo-50";

    return (
        <header className="bg-white border-b border-umd-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto">
                <div className="relative px-4 sm:px-6 lg:px-8" ref={desktopMenuRef}>
                    <div className="flex items-center justify-between h-20">
                        <div className="shrink-0">
                            <Link href={isFr ? "/" : "/en"} className="flex items-center" onClick={() => setIsOpen(false)}>
                                <BrandLogo size={30} />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
                            {navigation.map((item, index) => {
                                const isActive = isActiveItem(item);
                                const hasDropdown = Boolean(item.leaves || item.submenuGroups);
                                const isOpenMenu = openDesktopMenu === item.name;

                                if (hasDropdown) {
                                    return (
                                        <div key={index} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setOpenDesktopMenu(isOpenMenu ? null : item.name)}
                                                className={`flex items-center gap-1.5 cursor-pointer ${navLinkBase} ${isActive || isOpenMenu ? navLinkActive : navLinkIdle}`}
                                                aria-haspopup="menu"
                                                aria-expanded={isOpenMenu}
                                            >
                                                <span>{item.name}</span>
                                                <ChevronDown className={`w-4 h-4 ${isOpenMenu ? "rotate-180" : ""}`} aria-hidden="true" />
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="relative">
                                        <Link
                                            href={item.href || "#"}
                                            className={`${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}
                                        >
                                            {item.name}
                                        </Link>
                                    </div>
                                );
                            })}
                            <div className="h-6 w-px bg-umd-slate-200 mx-2" />
                            <button
                                onClick={() => { toggleLang(); router.push(switchUrl); }}
                                className="px-3.5 py-1.5 text-sm font-bold border-[1.5px] border-umd-slate-200 rounded-full text-umd-indigo-700 hover:border-umd-indigo-300 hover:bg-umd-indigo-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300"
                                aria-label={t.t("switchLangAria")}
                                title={t.t("langButtonTitle")}
                            >
                                {lang.toUpperCase()}
                            </button>
                        </nav>

                        {/* Mobile Button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-umd-slate-600 hover:text-umd-indigo-700 hover:bg-umd-indigo-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300"
                                aria-label={ht.t("menuMain")}
                                aria-expanded={isOpen}
                            >
                                {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    {/* Desktop Dropdown Content */}
                    {openDesktopMenu && (
                        <div className="absolute left-0 right-0 top-[72px] bg-white border-x border-b border-umd-slate-200 shadow-lg rounded-b-2xl overflow-hidden z-40">
                            {navigation
                                .filter((item) => item.name === openDesktopMenu && (item.leaves || item.submenuGroups))
                                .map((item) => (
                                    <div key={item.name} className="p-6 lg:p-8">
                                        {item.leaves && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {item.leaves.map((leaf) => {
                                                    const Ic = leaf.icon;
                                                    const isSubActive = isActiveSubItem(leaf.href);
                                                    return (
                                                        <Link
                                                            key={leaf.href}
                                                            href={leaf.href}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isSubActive
                                                                ? "border-umd-indigo-200 bg-umd-indigo-50"
                                                                : "border-umd-slate-200 bg-white hover:border-umd-indigo-300 hover:bg-umd-indigo-50"
                                                                }`}
                                                            onClick={() => setOpenDesktopMenu(null)}
                                                        >
                                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-umd-indigo-50 text-umd-indigo-700">
                                                                <Ic className="h-[18px] w-[18px]" aria-hidden="true" />
                                                            </span>
                                                            <span className="min-w-0">
                                                                <span className="block text-sm font-semibold text-umd-slate-900">{leaf.name}</span>
                                                                <span className="block text-xs text-umd-slate-500">{leaf.sub}</span>
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {item.submenuGroups && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {item.submenuGroups.map((group) => (
                                                    <div key={group.title} className="space-y-3">
                                                        <h3 className="px-1 text-xs font-bold uppercase tracking-widest text-umd-indigo-600">
                                                            {group.title}
                                                        </h3>
                                                        <div className="grid gap-1">
                                                            {group.items.map((subItem) => {
                                                                const isSubActive = isActiveSubItem(subItem.href);
                                                                return (
                                                                    <Link
                                                                        key={subItem.href}
                                                                        href={subItem.href}
                                                                        className={`block px-3 py-2.5 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isSubActive
                                                                            ? "bg-umd-indigo-50 text-umd-indigo-700"
                                                                            : "text-umd-slate-600 hover:bg-umd-indigo-50 hover:text-umd-indigo-700"
                                                                            }`}
                                                                        onClick={() => setOpenDesktopMenu(null)}
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-umd-slate-200">
                        <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = isActiveItem(item);
                                const hasDropdown = Boolean(item.leaves || item.submenuGroups);
                                const isOpenMenu = mobileOpenMenu === item.name;

                                return (
                                    <div key={item.href || item.name} className="space-y-1">
                                        {hasDropdown ? (
                                            <button
                                                type="button"
                                                className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-base font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isActive
                                                    ? "text-umd-indigo-800 bg-umd-indigo-50"
                                                    : "text-umd-slate-700 hover:bg-umd-slate-50"
                                                    }`}
                                                onClick={() => setMobileOpenMenu(isOpenMenu ? null : item.name)}
                                                aria-expanded={isOpenMenu}
                                            >
                                                <span>{item.name}</span>
                                                <ChevronDown className={`w-5 h-5 ${isOpenMenu ? "rotate-180 text-umd-indigo-600" : ""}`} aria-hidden="true" />
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                className={`block px-4 py-3 rounded-xl text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isActive
                                                    ? "text-umd-indigo-800 bg-umd-indigo-50 border-l-4 border-umd-indigo-500"
                                                    : "text-umd-slate-700 hover:bg-umd-slate-50"
                                                    }`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        )}

                                        {hasDropdown && isOpenMenu && (
                                            <div className="pl-4 space-y-1">
                                                {item.leaves && item.leaves.map((leaf) => {
                                                    const Ic = leaf.icon;
                                                    return (
                                                        <Link
                                                            key={leaf.href}
                                                            href={leaf.href}
                                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isActiveSubItem(leaf.href)
                                                                ? "text-umd-indigo-700 bg-umd-indigo-50"
                                                                : "text-umd-slate-600 hover:text-umd-indigo-700 hover:bg-umd-slate-50"
                                                                }`}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <Ic className="h-4 w-4 shrink-0 text-umd-indigo-600" aria-hidden="true" />
                                                            {leaf.name}
                                                        </Link>
                                                    );
                                                })}

                                                {item.submenuGroups && item.submenuGroups.map((group) => (
                                                    <div key={group.title} className="py-2 space-y-1">
                                                        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-umd-slate-400 py-1">
                                                            {group.title}
                                                        </p>
                                                        {group.items.map((subItem) => (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                className={`block px-4 py-2.5 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${isActiveSubItem(subItem.href)
                                                                    ? "text-umd-indigo-700 bg-umd-indigo-50"
                                                                    : "text-umd-slate-600 hover:text-umd-indigo-700 hover:bg-umd-slate-50"
                                                                    }`}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="pt-4 mt-4 border-t border-umd-slate-200">
                                <button
                                    onClick={() => { toggleLang(); router.push(switchUrl); }}
                                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl text-base font-bold bg-umd-indigo-800 text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300"
                                >
                                    <span>{isFr ? "Switch to English" : "Passer en Français"}</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded uppercase text-xs">{isFr ? 'en' : 'fr'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
