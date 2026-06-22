"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    ChevronRight,
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
    Home,
    Compass,
    Zap,
    GraduationCap,
    HeartHandshake,
    FilePlus2,
    FileSearch,
    FilePen,
    BookOpen,
    AlertTriangle,
    Bug,
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
    icon: LucideIcon;
    leaves?: NavLeaf[];
    submenuGroups?: NavigationGroup[];
    routes?: string[];
};

type ContribTab = { name: string; href: string };
type ContribAction = { name: string; sub: string; icon: LucideIcon; href: string };

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
    '/ateliers/urgence-fuite': '/workshops/data-leak-emergency',
    '/ateliers': '/workshops',
    '/nettoyage-numerique': '/digital-clean-up'
};

const EN_TO_FR_MAPPING = Object.entries(FR_TO_EN_MAPPING).reduce((acc, [fr, en]) => {
    acc[en] = fr;
    return acc;
}, {} as Record<string, string>);

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
    const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
    const [contribMenu, setContribMenu] = useState(false);
    const { lang } = useLanguage();
    const t = new Translator(dict, lang);
    const ht = useMemo(() => new Translator(headerDict, lang), [lang]);
    const router = useRouter();
    const isFr = lang === 'fr';

    // Contribution subnav (ported from kit Chrome.jsx CONTRIB_TABS) : onglets + menu "Actions".
    const contribTabs: ContribTab[] = useMemo(() => isFr ? [
        { name: ht.t("howToContribute"), href: "/contribuer" },
        { name: ht.t("missions"), href: "/contribuer/missions" },
        { name: ht.t("contributors"), href: "/contributeurs" },
        { name: ht.t("engagementCertificate"), href: "/contribuer/attestation-engagement" },
    ] : [
        { name: ht.t("howToContribute"), href: "/contribute" },
        { name: ht.t("missions"), href: "/contribute/missions" },
        { name: ht.t("contributors"), href: "/contributors" },
        { name: ht.t("engagementCertificate"), href: "/contribute/engagement-certificate" },
    ], [ht, isFr]);

    const contribActions: (ContribAction | "sep")[] = useMemo(() => isFr ? [
        { name: ht.t("newForm"), sub: ht.t("newFormSub"), icon: FilePlus2, href: "/contribuer/nouvelle-fiche" },
        { name: ht.t("formsToReview"), sub: ht.t("formsToReviewSub"), icon: FileSearch, href: "/contribuer/fiches-a-revoir" },
        { name: ht.t("updateForm"), sub: ht.t("updateFormSub"), icon: FilePen, href: "/contribuer/modifier-fiche" },
        { name: ht.t("updateGuides"), sub: ht.t("updateGuidesSub"), icon: BookOpen, href: "/contribuer/modifier-guides" },
        "sep",
        { name: ht.t("reportLeak"), sub: ht.t("reportLeakSub"), icon: AlertTriangle, href: "/contribuer/signaler-fuite" },
        { name: ht.t("reportVulnerability"), sub: ht.t("reportVulnerabilitySub"), icon: Bug, href: "/contribuer/signaler-vulnerabilite" },
    ] : [
        { name: ht.t("newForm"), sub: ht.t("newFormSub"), icon: FilePlus2, href: "/contribute/new-form" },
        { name: ht.t("formsToReview"), sub: ht.t("formsToReviewSub"), icon: FileSearch, href: "/contribute/forms-to-review" },
        { name: ht.t("updateForm"), sub: ht.t("updateFormSub"), icon: FilePen, href: "/contribute/update-form" },
        { name: ht.t("updateGuides"), sub: ht.t("updateGuidesSub"), icon: BookOpen, href: "/contribute/update-guides" },
        "sep",
        { name: ht.t("reportLeak"), sub: ht.t("reportLeakSub"), icon: AlertTriangle, href: "/contribute/report-leak" },
        { name: ht.t("reportVulnerability"), sub: ht.t("reportVulnerabilitySub"), icon: Bug, href: "/contribute/report-vulnerability" },
    ], [ht, isFr]);

    const navigation: NavigationItem[] = useMemo(() => [
        { name: ht.t("home"), href: isFr ? "/" : "/en", icon: Home },
        {
            name: ht.t("explore"),
            icon: Compass,
            leaves: [
                { name: ht.t("catalogApps"), sub: ht.t("catalogAppsSub"), icon: LayoutGrid, href: isFr ? "/liste-applications" : "/list-app" },
                { name: ht.t("compareServicesPlain"), sub: ht.t("compareServicesSub"), icon: Scale, href: isFr ? "/comparer" : "/compare" },
                { name: ht.t("transfersMap"), sub: ht.t("transfersMapSub"), icon: GitFork, href: isFr ? "/transferts" : "/transfers" },
                { name: ht.t("pressSpace"), sub: ht.t("pressSpaceSub"), icon: Newspaper, href: isFr ? "/presse" : "/press" },
            ],
        },
        {
            name: ht.t("act"),
            icon: Zap,
            leaves: [
                { name: ht.t("protectMyDataPlain"), sub: ht.t("protectMyDataSub"), icon: Shield, href: isFr ? "/proteger-mes-donnees" : "/protect-my-data" },
                { name: ht.t("deleteMyDataPlain"), sub: ht.t("deleteMyDataSub"), icon: Trash2, href: isFr ? "/supprimer-mes-donnees" : "/delete-my-data" },
                { name: ht.t("digitalCleanUpPlain"), sub: ht.t("digitalCleanUpSub"), icon: Sparkles, href: isFr ? "/nettoyage-numerique" : "/digital-clean-up" },
            ],
        },
        {
            name: ht.t("workshops"),
            icon: GraduationCap,
            leaves: [
                { name: ht.t("allWorkshops"), sub: ht.t("allWorkshopsSub"), icon: LayoutGrid, href: isFr ? "/ateliers" : "/workshops" },
                { name: ht.t("leakWorkshop"), sub: ht.t("leakWorkshopSub"), icon: ShieldAlert, href: isFr ? "/ateliers/urgence-fuite" : "/workshops/data-leak-emergency" },
            ],
        },
        {
            name: ht.t("contribute"),
            href: isFr ? "/contribuer" : "/contribute",
            icon: HeartHandshake,
            routes: isFr ? ["/contribuer", "/contributeurs"] : ["/contribute", "/contributors"],
        },
    ], [ht, isFr]);

    const currentPathname = usePathname() || '/';
    const homeHref = isFr ? "/" : "/en";
    const protectHref = isFr ? "/proteger-mes-donnees" : "/protect-my-data";

    const isActiveItem = (item: NavigationItem): boolean => {
        if (item.href) {
            if (item.href === "/" && currentPathname === "/") return true;
            if (item.href === "/en" && currentPathname === "/en") return true;
            if (item.href !== "/" && item.href !== "/en" && currentPathname.startsWith(item.href)) return true;
        }
        if (item.routes && item.routes.some(r => currentPathname.startsWith(r))) return true;
        if (item.leaves) return item.leaves.some(leaf => currentPathname.startsWith(leaf.href));
        if (item.submenuGroups) return item.submenuGroups.some(group => group.items.some(subItem => currentPathname.startsWith(subItem.href)));
        return false;
    };

    const stripSlash = (p: string): string => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
    const isActiveSubItem = (href: string): boolean => stripSlash(currentPathname) === stripSlash(href);

    // La subnav Contribution s'affiche dès qu'on est sur une route /contribuer ou /contributeurs.
    const onContrib = currentPathname.startsWith(isFr ? "/contribuer" : "/contribute")
        || currentPathname.startsWith(isFr ? "/contributeurs" : "/contributors");
    const activeAction = contribActions.find(
        (a): a is ContribAction => a !== "sep" && currentPathname.startsWith(a.href)
    );

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

    const switchLang = () => {
        // Do NOT call toggleLang() here: lang is derived from the pathname by
        // LanguageContext's sync effect. Pushing the target URL is enough, and
        // it avoids a transient lang/path mismatch (subnav flicker, stale label).
        router.push(switchUrl);
        setMobileOpen(false);
        setOpenDesktopMenu(null);
    };

    // Reset every menu when the route or language changes.
    useEffect(() => {
        setOpenDesktopMenu(null);
        setMobileOpenGroup(null);
        setMobileOpen(false);
        setContribMenu(false);
    }, [currentPathname, lang]);

    // Mobile overlay : verrouille le scroll du body + Échap pour fermer.
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
        const onKeyEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenDesktopMenu(null); };
        window.addEventListener("keydown", onKey);
        window.addEventListener("keydown", onKeyEsc);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keydown", onKeyEsc);
        };
    }, [mobileOpen]);

    const activeGroupName = navigation.find(
        (item) => (item.leaves || item.submenuGroups) && isActiveItem(item)
    )?.name ?? null;

    const openMobile = () => {
        setMobileOpenGroup(activeGroupName ?? navigation.find((i) => i.leaves || i.submenuGroups)?.name ?? null);
        setMobileOpen(true);
    };

    return (
        <header className="hdr">
            <div className="hdr-wrap hdr-in">
                <Link href={homeHref} className="hdr-logo" onClick={() => setMobileOpen(false)} aria-label="Unlock My Data">
                    <BrandLogo size={30} />
                </Link>

                {/* Desktop navigation */}
                <nav className="nav" aria-label={ht.t("menuMain")}>
                    {navigation.map((item) => {
                        const hasDropdown = Boolean(item.leaves || item.submenuGroups);
                        const isActive = isActiveItem(item);

                        if (!hasDropdown) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href || "#"}
                                    className={`nav-link${isActive ? " active" : ""}`}
                                    onClick={() => setOpenDesktopMenu(null)}
                                >
                                    {item.name}
                                </Link>
                            );
                        }

                        const isMenuOpen = openDesktopMenu === item.name;
                        return (
                            <div key={item.name} className="nav-drop">
                                <button
                                    type="button"
                                    className={`nav-trigger${isActive || isMenuOpen ? " active" : ""}`}
                                    onClick={() => setOpenDesktopMenu(isMenuOpen ? null : item.name)}
                                    aria-haspopup="menu"
                                    aria-expanded={isMenuOpen}
                                >
                                    {item.name}
                                    {isMenuOpen
                                        ? <ChevronUp className="w-[15px] h-[15px]" aria-hidden="true" />
                                        : <ChevronDown className="w-[15px] h-[15px]" aria-hidden="true" />}
                                </button>
                                {isMenuOpen && (
                                    <>
                                        <div className="nav-scrim" onClick={() => setOpenDesktopMenu(null)} aria-hidden="true" />
                                        <div className="nav-menu" role="menu">
                                            {item.leaves?.map((leaf) => {
                                                const Ic = leaf.icon;
                                                return (
                                                    <Link
                                                        key={leaf.href}
                                                        href={leaf.href}
                                                        role="menuitem"
                                                        className={isActiveSubItem(leaf.href) ? "on" : ""}
                                                        onClick={() => setOpenDesktopMenu(null)}
                                                    >
                                                        <span className="mi-ic"><Ic className="w-[18px] h-[18px]" aria-hidden="true" /></span>
                                                        <span className="mi-txt">{leaf.name}<span className="mi-sub">{leaf.sub}</span></span>
                                                    </Link>
                                                );
                                            })}
                                            {item.submenuGroups?.map((group) => (
                                                <div key={group.title}>
                                                    <p className="nav-grp-h">{group.title}</p>
                                                    {group.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            role="menuitem"
                                                            className={isActiveSubItem(subItem.href) ? "on" : ""}
                                                            onClick={() => setOpenDesktopMenu(null)}
                                                        >
                                                            <span className="mi-txt">{subItem.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    <button
                        type="button"
                        className="lang"
                        onClick={switchLang}
                        aria-label={t.t("switchLangAria")}
                        title={t.t("langButtonTitle")}
                    >
                        {lang.toUpperCase()}
                    </button>
                </nav>

                {/* Burger (mobile) */}
                <button
                    type="button"
                    className="nav-burger"
                    onClick={openMobile}
                    aria-label={ht.t("menuMain")}
                    aria-expanded={mobileOpen}
                >
                    <Menu className="w-6 h-6" aria-hidden="true" />
                </button>
            </div>

            {/* Contribution subnav : onglets + menu "Actions" (visible sur les routes /contribuer) */}
            {onContrib && (
                <nav className="subnav" aria-label={ht.t("contribute")}>
                    <div className="subnav-in">
                        <div className="subnav-tabs">
                            {contribTabs.map((tab) => (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={isActiveSubItem(tab.href) ? "active" : ""}
                                    onClick={() => setContribMenu(false)}
                                >
                                    {tab.name}
                                </Link>
                            ))}
                        </div>
                        <div className="subnav-drop">
                            <button
                                type="button"
                                className={`subnav-trigger${activeAction ? " active" : ""}`}
                                onClick={() => setContribMenu((m) => !m)}
                                aria-haspopup="menu"
                                aria-expanded={contribMenu}
                            >
                                <Zap className="w-[15px] h-[15px]" aria-hidden="true" />
                                {activeAction ? activeAction.name : ht.t("actions")}
                                {contribMenu
                                    ? <ChevronUp className="w-[14px] h-[14px]" aria-hidden="true" />
                                    : <ChevronDown className="w-[14px] h-[14px]" aria-hidden="true" />}
                            </button>
                            {contribMenu && (
                                <>
                                    <div className="subnav-scrim" onClick={() => setContribMenu(false)} aria-hidden="true" />
                                    <div className="subnav-menu" role="menu">
                                        {contribActions.map((it, i) => {
                                            if (it === "sep") return <div key={`sep-${i}`} className="subnav-sep" />;
                                            const Ic = it.icon;
                                            return (
                                                <Link
                                                    key={it.href}
                                                    href={it.href}
                                                    role="menuitem"
                                                    className={isActiveSubItem(it.href) ? "on" : ""}
                                                    onClick={() => setContribMenu(false)}
                                                >
                                                    <span className="mi-ic"><Ic className="w-4 h-4" aria-hidden="true" /></span>
                                                    <span className="mi-txt">{it.name}<span className="mi-sub">{it.sub}</span></span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile overlay menu */}
            {mobileOpen && (
                <div className="mnav" role="dialog" aria-modal="true" aria-label={ht.t("menuMain")}>
                    <div className="mnav-bar">
                        <Link href={homeHref} className="hdr-logo" onClick={() => setMobileOpen(false)} aria-label="Unlock My Data">
                            <BrandLogo size={28} />
                        </Link>
                        <button type="button" className="mnav-x" onClick={() => setMobileOpen(false)} aria-label={t.t("close")}>
                            <X className="w-[22px] h-[22px]" aria-hidden="true" />
                        </button>
                    </div>

                    <nav className="mnav-body" aria-label={ht.t("menuMain")}>
                        {navigation.map((item) => {
                            const Ic = item.icon;
                            const hasDropdown = Boolean(item.leaves || item.submenuGroups);
                            const isActive = isActiveItem(item);

                            if (!hasDropdown) {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href || "#"}
                                        className={`mnav-row${isActive ? " active" : ""}`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span className="mnav-ic"><Ic className="w-[19px] h-[19px]" aria-hidden="true" /></span>
                                        <span className="mnav-label">{item.name}</span>
                                        {/*<span className="mnav-chev"><ChevronRight className="w-[18px] h-[18px]" aria-hidden="true" /></span>*/}
                                    </Link>
                                );
                            }

                            const isGroupOpen = mobileOpenGroup === item.name;
                            return (
                                <div key={item.name} className="mnav-group">
                                    <button
                                        type="button"
                                        className={`mnav-row${isActive ? " active" : ""}`}
                                        aria-expanded={isGroupOpen}
                                        onClick={() => setMobileOpenGroup(isGroupOpen ? null : item.name)}
                                    >
                                        <span className="mnav-ic"><Ic className="w-[19px] h-[19px]" aria-hidden="true" /></span>
                                        <span className="mnav-label">{item.name}</span>
                                        <span className="mnav-chev">
                                            {isGroupOpen
                                                ? <ChevronUp className="w-[18px] h-[18px]" aria-hidden="true" />
                                                : <ChevronDown className="w-[18px] h-[18px]" aria-hidden="true" />}
                                        </span>
                                    </button>
                                    {isGroupOpen && (
                                        <div className="mnav-panel">
                                            {item.leaves?.map((leaf) => {
                                                const LIc = leaf.icon;
                                                return (
                                                    <Link
                                                        key={leaf.href}
                                                        href={leaf.href}
                                                        className={`mnav-item${isActiveSubItem(leaf.href) ? " on" : ""}`}
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        <span className="mnav-iic"><LIc className="w-[17px] h-[17px]" aria-hidden="true" /></span>
                                                        <span className="mnav-itxt">{leaf.name}<span className="mnav-sub">{leaf.sub}</span></span>
                                                    </Link>
                                                );
                                            })}
                                            {item.submenuGroups?.map((group) => (
                                                <div key={group.title}>
                                                    <p className="mnav-grp-h">{group.title}</p>
                                                    {group.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`mnav-item${isActiveSubItem(subItem.href) ? " on" : ""}`}
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            <span className="mnav-itxt">{subItem.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="mnav-foot">
                        <Link href={protectHref} className="mnav-cta" onClick={() => setMobileOpen(false)}>
                            <Shield className="w-[18px] h-[18px]" aria-hidden="true" />
                            {ht.t("protectMyDataPlain")}
                        </Link>
                        <button
                            type="button"
                            className="lang"
                            onClick={switchLang}
                            aria-label={t.t("switchLangAria")}
                            title={t.t("langButtonTitle")}
                        >
                            {lang.toUpperCase()}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
