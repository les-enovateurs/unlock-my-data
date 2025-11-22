"use client";

import React, {Suspense} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {useLanguage} from "@/context/LanguageContext";

type HtmlWithLangProps = {
    children: React.ReactNode;
    isProd: boolean;
};

export function HtmlWithLang({children, isProd}: HtmlWithLangProps) {
    const {lang} = useLanguage();

    return (
        <html lang={lang}>
        <body>
        <script
            dangerouslySetInnerHTML={{
                __html: `
              var _mtm = window._mtm = window._mtm || [];
              _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
              (function() {
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true;
                g.defer=true;
                g.type='text/javascript';
                g.src='https://enovanalytic.les-enovateurs.com/js/${
                    isProd
                        ? "container_TdR2Hjei.js"
                        : "container_TdR2Hjei_dev_d835f97b1bf099bab6e819ad.js"
                }';
                s.parentNode.insertBefore(g,s);
              })();
            `,
            }}
        />
        <Suspense fallback={<div>Loading...</div>}>
            <Header/>
        </Suspense>
        <main role="main" className={"flex flex-col bg-white"}>
            {children}
        </main>
        <ScrollToTop/>
        <Footer/>
        </body>
        </html>
    );
}
