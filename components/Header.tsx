"use client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {useState} from "react";
import Image from "next/image";
import titre from "../public/logoUMD.webp";
import {useLanguage} from "@/context/LanguageContext";

const FR_TO_EN_MAPPING: Record<string, string> = {
    '/liste-applications': '/list-app',
    '/proteger-mes-donnees': '/protect-my-data',
    '/evaluer-mes-risques': '/evaluate-my-risks',
    '/comparer': '/compare',
    '/supprimer-mes-donnees': '/delete-my-data',
    '/contribuer/missions': '/contribute/missions',
    '/contribuer/nouvelle-fiche': '/contribute/new-form',
    '/contribuer/modifier-fiche': '/contribute/update-form',
    '/contribuer/signaler-fuite': '/contribute/report-leak',
    '/contribuer/signaler-vulnerabilite': '/contribute/report-vulnerability',
    '/contribuer': '/contribute',
    '/contributeurs': '/contributors',
    '/mentions-legales': '/legal-notice',
    '/politique-confidentialite': '/privacy-policy',
    '/ateliers' : '/'
};

const EN_TO_FR_MAPPING = Object.entries(FR_TO_EN_MAPPING).reduce((acc, [fr, en]) => {
    acc[en] = fr;
    return acc;
}, {} as Record<string, string>);

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const {lang, toggleLang} = useLanguage();
    const router = useRouter();

    const navigation: Array<{
            name: string;
            href?: string;
            main?: boolean;
            submenu?: Array<{
                name: string;
                href: string;
            }>
        }> = 'fr' === lang ? [
                {name: "Accueil", href: "/"},
                {name: "Applications", href: "/liste-applications"},
                {
                    name: "Outils",
                    submenu: [
                        {name: "🛡️ Protéger mes données", href: "/proteger-mes-donnees"},
                        {name: "⚖️ Comparer les services", href: "/comparer"},
                        {name: "🗑️ Supprimer mes données", href: "/supprimer-mes-donnees"},
                    ]
                },
                {
                    name: "Contribuer",
                    submenu: [
                        {name: "Comment contribuer", href: "/contribuer"},
                        {name: "Missions", href: "/contribuer/missions"},
                        {name: "Nouvelle fiche", href: "/contribuer/nouvelle-fiche"},
                        {name: "Modifier une fiche", href: "/contribuer/modifier-fiche"},
                        {name: "Signaler une fuite", href: "/contribuer/signaler-fuite"},
                        {name: "Signaler une vulnérabilité", href: "/contribuer/signaler-vulnerabilite"},
                        {name: "Contributeurs", href: "/contributeurs"},
                    ]
                },
                {name: "Ateliers", href: "/ateliers"},
            ] :
            [
                {name: "Home", href: "/en"},
                {name: "Applications", href: "/list-app"},
                {
                    name: "Tools",
                    submenu: [
                        {name: "🛡️ Evaluate my risks", href: "/evaluate-my-risks"},
                        {name: "⚖️ Compare services", href: "/compare"},
                        {name: "🗑️ Delete my data", href: "/delete-my-data"},
                    ]
                },
                {
                    name: "Contribute",
                    submenu: [
                        {name: "How to contribute", href: "/contribute"},
                        {name: "Missions", href: "/contribute/missions"},
                        {name: "New form", href: "/contribute/new-form"},
                        {name: "Update form", href: "/contribute/update-form"},
                        {name: "Report a leak", href: "/contribute/report-leak"},
                        {name: "Report a vulnerability", href: "/contribute/report-vulnerability"},
                        {name: "Contributors", href: "/contributors"},
                    ]
                },
            ]
    ;

    // Enhanced function to check if a navigation item is active
    const isActiveItem = (item: typeof navigation[0]): boolean => {
        const currentPathname = usePathname() || '/';

        if (item.href) {
            // Exact match for home page
            if (item.href === "/" && currentPathname === "/") {
                return true;
            }
            // For other pages, check if current path starts with the item href (excluding home page)
            if (item.href !== "/" && currentPathname.startsWith(item.href)) {
                return true;
            }
        }

        // Check if any submenu item is active
        if (item.submenu) {
            return item.submenu.some(subItem => currentPathname.startsWith(subItem.href));
        }

        return false;
    };

    // Function to check if a submenu item is active
    const isActiveSubItem = (href: string): boolean => {
        const currentPathname = usePathname() || '/';
        return currentPathname === href;
    };

    const currentPathname = usePathname() || '/';

    const getSwitchUrl = () => {
        if (lang === 'fr') {
            if (currentPathname === '/') return '/en';

            const sortedKeys = Object.keys(FR_TO_EN_MAPPING).sort((a, b) => b.length - a.length);
            for (const key of sortedKeys) {
                if (currentPathname.startsWith(key)) {
                    return currentPathname.replace(key, FR_TO_EN_MAPPING[key]);
                }
            }
            return '/en';
        } else {
            if (currentPathname === '/en') return '/';

            const sortedKeys = Object.keys(EN_TO_FR_MAPPING).sort((a, b) => b.length - a.length);
            for (const key of sortedKeys) {
                if (currentPathname.startsWith(key)) {
                    return currentPathname.replace(key, EN_TO_FR_MAPPING[key]);
                }
            }
            return '/';
        }
    };

    const switchUrl = getSwitchUrl();

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src={titre}
                                    alt="Unlock My Data"
                                    className="w-40"
                                    priority={true}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:items-center md:space-x-8">
                            {navigation.map((item, index) => {
                                const isActive = isActiveItem(item);

                                return (
                                    <div key={index} className="relative group">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                                    item.main
                                                        ? isActive
                                                            ? "text-primary-700 underline"
                                                            : "hover:border-1 text-white hover:text-black hover:border-primary-600 hover:bg-white bg-primary-700 rounded-md"
                                                        : isActive
                                                            ? "text-primary-700 font-semibold"
                                                            : "text-gray-600 hover:text-primary-600"
                                                }`}
                                            >
                            <span className="relative">
                              {item.name}
                                {!item.main && (
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-transform duration-300 origin-left ${
                                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        }`}/>
                                )}
                            </span>
                                            </Link>
                                        ) : (
                                            <p
                                                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-default ${
                                                    isActive
                                                        ? "text-primary-700 font-semibold"
                                                        : "text-gray-600 hover:text-primary-600"
                                                }`}
                                            >
                            <span className="relative">
                              {item.name}
                                {item.submenu && (
                                    <svg
                                        className="w-4 h-4 ml-1 inline-block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                )}
                                <span
                                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-transform duration-300 origin-left ${
                                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    }`}/>
                            </span>
                                            </p>
                                        )}
                                        {item.submenu && (
                                            <div
                                                className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="py-1">
                                                    {item.submenu.map((subItem) => {
                                                        const isSubActive = isActiveSubItem(subItem.href);

                                                        return (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                                                    isSubActive
                                                                        ? "text-primary-700 bg-primary-50 font-medium border-r-2 border-primary-600"
                                                                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                                                                }`}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <button onClick={() => {toggleLang(); router.push(switchUrl);}}
                                className="ml-2 px-3 py-2 text-sm font-medium  rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                                aria-label={lang === "fr" ? "Switch language to English" : "Changer la langue en français"}
                                title={lang === "fr" ? "English" : "Français"}
                            >
                                {lang === "fr" ? "FR > EN" : "EN > FR"}
                            </button>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600  transition-all duration-200"
                            >
                                <span className="sr-only">Menu principal</span>
                                <div className="relative w-6 h-6">
                  <span
                      className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                          isOpen ? "rotate-45 top-3" : "top-1"
                      }`}
                  ></span>
                                    <span
                                        className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                                            isOpen ? "opacity-0" : "top-3"
                                        }`}
                                    ></span>
                                    <span
                                        className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                                            isOpen ? "-rotate-45 top-3" : "top-5"
                                        }`}
                                    ></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                            {navigation.map((item) => {
                                const isActive = isActiveItem(item);

                                return (
                                    <div key={item.href || item.name}>
                                        <Link
                                            href={item.href || "#"}
                                            className={
                                                item.main
                                                    ? isActive
                                                        ? "block px-3 py-2 text-base font-medium text-white bg-primary-800 rounded-md"
                                                        : "block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                                                    : `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                                        isActive
                                                            ? "text-primary-700 bg-primary-100 underline decoration-blue-700 decoration-4 font-semibold"
                                                            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                    }`
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                        {item.submenu && (
                                            <div className="pl-4 space-y-1">
                                                {item.submenu.map((subItem) => {
                                                    const isSubActive = isActiveSubItem(subItem.href);

                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                                isSubActive
                                                                    ? "text-primary-700 bg-primary-50 font-medium border-l-2 border-primary-600"
                                                                    : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                                            }`}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}