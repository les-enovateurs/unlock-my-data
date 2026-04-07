import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import titre from "../public/logoUMD.webp";
import { useLanguage } from "@/context/LanguageContext";
import dict from "../i18n/Shared.json";
import headerDict from "../i18n/Header.json";
import Translator from "./tools/t";

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
    main?: boolean;
    submenu?: NavigationSubItem[];
    submenuGroups?: NavigationGroup[];
};

const FR_TO_EN_MAPPING: Record<string, string> = {
    '/liste-applications': '/list-app',
    '/proteger-mes-donnees': '/protect-my-data',
    '/evaluer-mes-risques': '/evaluate-my-risks',
    '/comparer': '/compare',
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

    const contributeGroups: NavigationGroup[] = useMemo(() => lang === 'fr' ? [
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
    ], [ht, lang]);

    const navigation: NavigationItem[] = lang === 'fr' ? [
        { name: ht.t("home"), href: "/" },
        { name: ht.t("applications"), href: "/liste-applications" },
        {
            name: ht.t("tools"),
            submenu: [
                { name: ht.t("protectMyData"), href: "/proteger-mes-donnees" },
                { name: ht.t("compareServices"), href: "/comparer" },
                { name: ht.t("deleteMyData"), href: "/supprimer-mes-donnees" },
                { name: ht.t("digitalCleanUpDay"), href: "/nettoyage-numerique" },
            ]
        },
        {
            name: ht.t("contribute"),
            submenuGroups: contributeGroups,
        },
        { name: ht.t("workshops"), href: "/ateliers" },
    ] : [
        { name: ht.t("home"), href: "/en" },
        { name: ht.t("applications"), href: "/list-app" },
        {
            name: ht.t("tools"),
            submenu: [
                { name: ht.t("protectMyData"), href: "/evaluate-my-risks" },
                { name: ht.t("compareServices"), href: "/compare" },
                { name: ht.t("deleteMyData"), href: "/delete-my-data" },
                { name: ht.t("digitalCleanUpDay"), href: "/digital-clean-up" },
            ]
        },
        {
            name: ht.t("contribute"),
            submenuGroups: contributeGroups,
        },
    ];

    const currentPathname = usePathname() || '/';

    const isActiveItem = (item: NavigationItem): boolean => {
        if (item.href) {
            if (item.href === "/" && currentPathname === "/") return true;
            if (item.href === "/en" && currentPathname === "/en") return true;
            if (item.href !== "/" && item.href !== "/en" && currentPathname.startsWith(item.href)) return true;
        }
        if (item.submenu) return item.submenu.some(subItem => currentPathname.startsWith(subItem.href));
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

    const switchUrl = getSwitchUrl(lang === 'fr' ? 'en' : 'fr');

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

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="relative px-4 sm:px-6 lg:px-8" ref={desktopMenuRef}>
                    <div className="flex items-center justify-between h-20">
                        <div className="shrink-0">
                            <Link href={lang === 'fr' ? "/" : "/en"} className="flex items-center transition-transform duration-300 hover:scale-105" onClick={() => setIsOpen(false)}>
                                <Image src={titre} alt="Unlock My Data" className="w-40" priority={true} />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
                            {navigation.map((item, index) => {
                                const isActive = isActiveItem(item);
                                const hasDropdown = Boolean(item.submenu || item.submenuGroups);
                                const isOpenMenu = openDesktopMenu === item.name;

                                if (hasDropdown) {
                                    return (
                                        <div key={index} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setOpenDesktopMenu(isOpenMenu ? null : item.name)}
                                                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${isActive
                                                    ? "text-primary-600 bg-primary-50/50"
                                                    : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                    } ${isOpenMenu ? "bg-gray-50 text-primary-600" : ""}`}
                                                aria-haspopup="menu"
                                                aria-expanded={isOpenMenu}
                                            >
                                                <span>{item.name}</span>
                                                <svg className={`w-4 h-4 transition-transform duration-300 ${isOpenMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="relative">
                                        <Link
                                            href={item.href || "#"}
                                            className={`group px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg block ${isActive
                                                ? "text-primary-600 bg-primary-50/50"
                                                : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="relative">
                                                {item.name}
                                                <span className={`absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary-500 transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })}
                            <div className="h-6 w-px bg-gray-200 mx-2" />
                            <button 
                                onClick={() => { toggleLang(); router.push(switchUrl); }} 
                                className="px-3 py-1.5 text-sm font-bold border-2 border-primary-100 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-200 text-primary-700"
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
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                aria-label={ht.t("menuMain")}
                            >
                                <div className="relative w-6 h-5">
                                    <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "rotate-45 top-2" : "top-0"}`} />
                                    <span className={`absolute w-full h-0.5 bg-current transition-all duration-300 top-2 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                                    <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "-rotate-45 top-2" : "top-4"}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Dropdown Content */}
                    <AnimatePresence>
                        {openDesktopMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute left-0 right-0 top-[72px] bg-white border-x border-b border-gray-100 shadow-2xl rounded-b-2xl overflow-hidden z-40"
                            >
                                {navigation
                                    .filter((item) => item.name === openDesktopMenu && (item.submenu || item.submenuGroups))
                                    .map((item) => (
                                        <div key={item.name} className="p-6 lg:p-8">
                                            {item.submenu && (
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {item.submenu.map((subItem) => {
                                                        const isSubActive = isActiveSubItem(subItem.href);
                                                        return (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                className={`flex items-center p-3 rounded-xl border transition-all duration-200 ${isSubActive
                                                                    ? "border-primary-200 bg-primary-50 text-primary-700 shadow-sm"
                                                                    : "border-gray-50 bg-gray-50/30 text-gray-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                                                    }`}
                                                                onClick={() => setOpenDesktopMenu(null)}
                                                            >
                                                                <span className="text-sm font-semibold">{subItem.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {item.submenuGroups && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {item.submenuGroups.map((group) => (
                                                        <div key={group.title} className="space-y-3">
                                                            <h3 className="px-1 text-xs font-bold uppercase tracking-widest text-primary-500/80">
                                                                {group.title}
                                                            </h3>
                                                            <div className="grid gap-2">
                                                                {group.items.map((subItem) => {
                                                                    const isSubActive = isActiveSubItem(subItem.href);
                                                                    return (
                                                                        <Link
                                                                            key={subItem.href}
                                                                            href={subItem.href}
                                                                            className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isSubActive
                                                                                ? "bg-primary-50 text-primary-700"
                                                                                : "text-gray-600 hover:bg-primary-50/50 hover:text-primary-700"
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
                        >
                            <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
                                {navigation.map((item) => {
                                    const isActive = isActiveItem(item);
                                    const hasDropdown = Boolean(item.submenu || item.submenuGroups);
                                    const isOpenMenu = mobileOpenMenu === item.name;

                                    return (
                                        <div key={item.href || item.name} className="space-y-1">
                                            {hasDropdown ? (
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer ${isActive
                                                        ? "text-primary-700 bg-primary-50"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => setMobileOpenMenu(isOpenMenu ? null : item.name)}
                                                    aria-expanded={isOpenMenu}
                                                >
                                                    <span>{item.name}</span>
                                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isOpenMenu ? "rotate-180 text-primary-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href || "#"}
                                                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${isActive
                                                        ? "text-primary-700 bg-primary-50 border-l-4 border-primary-500"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}

                                            <AnimatePresence>
                                                {hasDropdown && isOpenMenu && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="pl-4 space-y-1 overflow-hidden"
                                                    >
                                                        {item.submenu && item.submenu.map((subItem) => (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveSubItem(subItem.href)
                                                                    ? "text-primary-600 bg-primary-50/50"
                                                                    : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                                    }`}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}

                                                        {item.submenuGroups && item.submenuGroups.map((group) => (
                                                            <div key={group.title} className="py-2 space-y-1">
                                                                <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 py-1">
                                                                    {group.title}
                                                                </p>
                                                                {group.items.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.href}
                                                                        href={subItem.href}
                                                                        className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveSubItem(subItem.href)
                                                                            ? "text-primary-600 bg-primary-50/50"
                                                                            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                                            }`}
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button 
                                        onClick={() => { toggleLang(); router.push(switchUrl); }} 
                                        className="w-full flex items-center justify-between px-4 py-4 rounded-xl text-base font-bold bg-primary-600 text-white shadow-lg shadow-primary-200 cursor-pointer active:scale-95 transition-all"
                                    >
                                        <span>{lang === 'fr' ? "Switch to English" : "Passer en Français"}</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded uppercase text-xs">{lang === 'fr' ? 'en' : 'fr'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}