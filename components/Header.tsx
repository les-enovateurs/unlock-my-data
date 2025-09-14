"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import titre from "../public/logoUMD.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPathname = usePathname();

  const navigation: Array<{
    name: string;
    href?: string;
    main?: boolean;
    submenu?: Array<{
      name: string;
      href: string;
    }>
  }> = [
    { name: "Accueil", href: "/" },
    { name: "Liste des applications", href: "/liste-applications" },
    { name: "Contribuer", href: "/contribuer" },
    {
      name: "Comparer les services",
      href: "/comparer",
      main: true,
    },
  ];

  // Enhanced function to check if a navigation item is active
  const isActiveItem = (item: typeof navigation[0]): boolean => {
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
      return item.submenu.some(subItem =>
          subItem.href === currentPathname ||
          (subItem.href !== "/" && currentPathname.startsWith(subItem.href))
      );
    }

    return false;
  };

  // Function to check if a submenu item is active
  const isActiveSubItem = (href: string): boolean => {
    return currentPathname === href ||
        (href !== "/" && currentPathname.startsWith(href));
  };

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
                                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-transform duration-300 origin-left ${
                                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                  }`} />
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
                              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-transform duration-300 origin-left ${
                                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                              }`} />
                            </span>
                            </p>
                        )}
                        {item.submenu && (
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                                            ? "text-primary-700 bg-primary-100 border-l-4 border-primary-600 font-semibold"
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