"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import titre from "/public/logoUMD.webp";
import { Menu } from "lucide-react"; // Import Menu icon for mobile

const navItems = [
  {
    pathName: "/",
    label: "Accueil",
  },
  {
    pathName: "/list",
    label: "Annuaire",
  },
  {
    label: "Comparatifs",
    isDropdown: true,
    children: [
      {
        pathName: "/comparatif_reseaux_sociaux",
        label: "Comparatif des réseaux sociaux",
      },
      {
        pathName: "/comparatif_applications",
        label: "Comparatif des applications",
      }
    ]
  }
];

export default function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <header className="bg-color1 shadow-sm w-screen py-1">
        <div className="relative flex flex-row justify-between container mx-auto">
          <Link href="/" className="flex bg-color1 px-1 items-center gap-2 w-1/2">
            <Image
                src={titre}
                alt="logo Unlock My Data"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-stretch hidden md:block w-full pl-6 align-stretch py-1">
            <ul className="flex items-center h-[10vh] w-full">
              {navItems.map((item, index) => (
                  !item.isDropdown ? (
                      <li
                          key={index}
                          className={`${index > 0 ? 'mx-1' : ''} w-1/2 border-2 border-color4 rounded-xl relative bg-color1 text-center min-h-[10vh] flex items-center justify-center`}
                      >
                        <Link
                            href={item.pathName}
                            className="flex bg-color1 items-center justify-center text-color4 transition-colors duration-200 w-full h-full"
                        >
                          <span className="align-middle z-10">{item.label}</span>
                        </Link>
                      </li>
                  ) : (
                      <li
                          key={index}
                          className="mx-1 w-1/2 border-2 border-color4 rounded-xl relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
                          onMouseEnter={() => setIsDropdownOpen(true)}
                          onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <button className="flex bg-color1 items-center justify-center text-color4 transition-colors duration-200 w-full h-full">
                          <span className="align-middle z-10">{item.label}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-color1 shadow-lg z-20">
                              {item.children.map((child, childIndex) => (
                                  <Link
                                      key={childIndex}
                                      href={child.pathName}
                                      className="block p-4 text-color4 transition-colors duration-200 hover:bg-color2"
                                  >
                                    {child.label}
                                  </Link>
                              ))}
                            </div>
                        )}
                      </li>
                  )
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
              className="md:hidden flex items-center px-3 text-color4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-color1 w-full">
              <nav className="container mx-auto py-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                      !item.isDropdown ? (
                          <li key={index} className="border-b border-color2 pb-2">
                            <Link
                                href={item.pathName}
                                className="block text-color4 p-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                      ) : (
                          <li key={index} className="border-b border-color2 pb-2">
                            <div className="text-color4 p-2 font-medium">{item.label}</div>
                            <ul className="ml-4 space-y-1 mt-1">
                              {item.children.map((child, childIndex) => (
                                  <li key={childIndex}>
                                    <Link
                                        href={child.pathName}
                                        className="block text-color4 p-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                              ))}
                            </ul>
                          </li>
                      )
                  ))}
                </ul>
              </nav>
            </div>
        )}
      </header>
  );
}