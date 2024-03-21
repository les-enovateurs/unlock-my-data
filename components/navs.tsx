"use client"

import Image from "next/image";
import logo from "../public/logo.webp"
import React, {useState} from "react";
import Link from "next/link";


const Navs = () => {
    const [isNavOpen, setNavCollapsed] = useState(false);

    function openClose(nav?: boolean, search?: boolean) {
        if (true === nav) {
            setNavCollapsed(true);
        }
        if (true === search) {
            setNavCollapsed(false);
        }
        if (false === nav) {
            setNavCollapsed(false);
        }
    }

    return (
        <>
            {/*<Nav/>*/}
            {/*<NavLogo switchLang={switchLang}/>*/}
            <header role="banner" className="p-2">
                <ul className="flex md:flex-row md:items-center md:w-full gap-y-2 flex-col md:text-xl font-bold">
                    <li className={"md:mb-4"}>
                        <Link href="/" className="w-1/4">
                            <Image src={logo} unoptimized={false} alt={"logo Unlock My Data"}/>
                        </Link>
                    </li>
                    <li className="mr-4">
                        <span className={"md:hidden"}>TODO - Slogan</span>
                    </li>
                    {/*<li className="hidden mr-4 md:block">*/}
                    {/*    <SmallTag name={tr.t('responsable')}*/}
                    {/*              link={tr_cat.t('category.url') + '/' + tr_cat.t('sobriete.slug')}/>*/}

                    {/*</li>*/}
                    {/*<li className="hidden mr-4 md:block">*/}

                    {/*    <SmallTag name={tr.t('ethic')}*/}
                    {/*              link={tr_cat.t('category.url') + '/' + tr_cat.t('ethique.slug')}/>*/}

                    {/*</li>*/}
                    {/*<li className="hidden mr-4 md:block">*/}
                    {/*    <SmallTag name={tr.t('accessible')}*/}
                    {/*              link={tr_cat.t('category.url') + '/' + tr_cat.t('accessibilite.slug')}/>*/}
                    {/*</li>*/}
                    {/*<li className={"mr-4 hidden " + ('fr' === activeLocale ? '' : 'md:block')}>*/}
                    {/*    digital*/}
                    {/*</li>*/}
                </ul>
            </header>


            <nav role="navigation" id="menu-de-navigation" aria-label="menu principal"
                 className={"flex flex-col items-center border-y-2 border-gray-200"}>
                <button aria-expanded={isNavOpen} aria-controls="menu-principal"
                        className={"flex items-center text-2xl md:hidden"}
                        onClick={() => openClose(!isNavOpen)}>
                    {(isNavOpen) ?
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2 cursor-pointer	"
                             fill="none" focusable={false} tabIndex={0}
                             viewBox="0 0 24 24"
                             aria-label={'fermer'}
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg"
                             focusable={false} className="h-10 w-10 mr-2 cursor-pointer"
                             fill="none" aria-label={'ouvrir'} tabIndex={0}
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>}
                    Menu
                </button>
                <ul id="menu-principal"
                    className={" mt-6 mb-6 text-brand-light font-bold text-xl flex flex-col gap-y-2  " +
                        "md:flex md:flex-row md:my-4 md:gap-x-5 items-center md:w-full md:px-10   " +
                        "" + ((isNavOpen) ? " " : " hidden ")}>
                    <li>
                        <Link href={"/list"}>
                            <button className={"underlineBtn"}>
                                Annuaire
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/discord"}>
                            <button className={"underlineBtn"}>
                                Etude sur Discord
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/twitch"}>
                            <button className={"underlineBtn"}>
                                Etude sur Twitch
                            </button>
                        </Link>
                    </li>

                    <li>
                        <Link href={"/twitch"}>
                            <button className={"underlineBtn"}>
                                Page infos Twitch
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/instagram"}>
                            <button className={"underlineBtn"}>
                                Service instagram
                            </button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navs
