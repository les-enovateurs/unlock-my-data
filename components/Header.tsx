"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import titre from "../public/logoUMD.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPathname = usePathname();

  const navigation = [
    { name: "Accueil", href: "/" },
    { 
      name: "Comparatifs", 
      submenu: [
        { name: "Réseaux sociaux", href: "/comparatif/reseaux-sociaux" },
       // { name: "Messageries", href: "/comparatif/messageries" },
        //{ name: "Services de streaming", href: "/comparatif/streaming" },
      ]
    },
    { 
      name: "Études", 
      submenu: [
        { name: "Discord", href: "/discord" },
        { name: "Google", href: "/google" },
        { name: "Instagram", href: "/instagram" },
        { name: "Twitch", href: "/twitch" },
      ]
    },
    { name: "Liste des applications", href: "/liste-applications" },
  ];

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
              {navigation.map((item,index) => (
                <div key={index} className="relative group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200  
                        ${currentPathname === item.href
                          ? "text-primary-600"
                          : "text-gray-600 hover:text-primary-600"
                        }
                      `}
                    >
                      <span className="relative">
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
                      </span>
                    </Link>
                  ) : (
                    <p
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-default
                        text-gray-600 hover:text-primary-600
                      `}
                    >
                      <span className="relative">
                        {item.name}
                        {item.submenu && (
                          <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
                      </span>
                    </p>
                  )}
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://github.com/UnlockMyData/reboot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Contribuer
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
              >
                <span className="sr-only">Menu principal</span>
                <div className="relative w-6 h-6">
                  <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "rotate-45 top-3" : "top-1"}`}></span>
                  <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "opacity-0" : "top-3"}`}></span>
                  <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "-rotate-45 top-3" : "top-5"}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
              {navigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                      ${currentPathname === item.href
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://github.com/UnlockMyData/reboot"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Contribuer sur GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 