// "use client";

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
 import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
  description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
    publisher: "Les e-novateurs",
    openGraph: {
        title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
        url: "https://unlock-my-data.com",
        siteName: "Unlock My Data",
        images: [
        {
            url: "https://unlock-my-data.com/og-image.png",
            alt: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        },
        ],
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
        images: ["https://unlock-my-data.com/og-image.png"],
        creator: "@les-enovateurs",
    }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const isProd = process.env.NODE_ENV === "production";

    return (
    <html lang="fr">
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
                                    g.src='https://enovanalytic.les-enovateurs.com/js/${isProd
                  ? "container_TdR2Hjei.js"
                  : "container_TdR2Hjei_dev_d835f97b1bf099bab6e819ad.js"}'; 
                                    s.parentNode.insertBefore(g,s);
                                })();
                            `
          }}
      />
        <Suspense fallback={<div>Loading...</div>}> <Header /></Suspense>
        <main
          role="main"
          className={"flex flex-col bg-white"}
        >
          {children}
        </main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
