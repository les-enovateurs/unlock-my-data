import type {Metadata} from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image"
import logo from "../public/logo.webp"
import Navs from "@/components/navs";


export const metadata: Metadata = {
    title: "Unlock My Data",
    description: "TODO",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {


    return (
        <html lang="fr">
        <body>
        <Navs/>
        <main role="main" id="contenu-principal" className={"flex flex-col"}>
            {children}
        </main>
        <footer role="contentinfo" className={"bg-black pb-10 "}>
            <Link prefetch={false} href={"/"}>
                <Image
                    src={logo}
                    alt={"Unlock My Data"}
                    className={" w-1/3 md:w-1/6 md:mx-auto"}
                />
            </Link>
            <nav>
                <ul className={"text-white flex flex-col gap-y-3 md:flex md:flex-row md:justify-center md:gap-x-6 w-full px-5 mt-5 md:mt-0"}>
                    <li>
                        <Link href={"/todo"} className={"underlineBtn hover:text-white"}>
                            <button>
                                TODO - Link Footer
                            </button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
        </body>
        </html>
    );
}
