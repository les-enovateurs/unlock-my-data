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
        <html lang={lang} data-theme="corporate">
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
