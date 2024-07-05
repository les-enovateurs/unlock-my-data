import type {Metadata} from "next";
import "./globals.css";
import Navs from "@/components/Navs";
import Footer from "@/components/Footer";


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
        <Footer />
        </body>
        </html>
    );
}
