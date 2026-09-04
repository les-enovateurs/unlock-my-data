"use client";

import React from "react";
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
        <html lang={lang} data-theme="corporate">
        <head>
            {/* Self-hosted variable fonts used above the fold (see app/design-tokens.css).
                Without preload they are only discovered after the CSS parses. */}
            <link rel="preload" href="/fonts/PublicSans-variable.woff2" as="font" type="font/woff2"
                  crossOrigin="anonymous"/>
            <link rel="preload" href="/fonts/SpaceGrotesk-variable.woff2" as="font" type="font/woff2"
                  crossOrigin="anonymous"/>
            {isProd && <link rel="preconnect" href="https://www.wysistat.com" crossOrigin="anonymous"/>}
        </head>
        <body>
        {isProd && <script type="text/javascript"
            dangerouslySetInnerHTML={{
                __html: `
                var _wsq = _wsq || [];
                _wsq.push(['_setNom', 'unlockmydata']);
                _wsq.push(['_wysistat']);

                (function(){
                    var ws = document.createElement('script');
                    ws.type = 'text/javascript';
                    ws.async = true;
                    ws.src = ('https:' == document.location.protocol ? 'https://www' : 'http://www') + '.wysistat.com/ws.jsa';
                    var s = document.getElementsByTagName('script')[0]||document.getElementsByTagName('body')[0];
                    s.parentNode.insertBefore(ws, s);
                })();
            `,
            }}
        />}
        <Header/>
        <main role="main" className="flex flex-col bg-white min-h-screen">
            {children}
        </main>
        <ScrollToTop/>
        <Footer/>
        </body>
        </html>
    );
}
