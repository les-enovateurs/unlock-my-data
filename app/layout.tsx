// "use client";

import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
 import { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Unlock My Data",
  description: "TODO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <Suspense fallback={<div>Loading...</div>}> <Nav /></Suspense>
        <main
          role="main"
          id="contenu-principal"
          className={"flex flex-col mt-20"}
        >
          {children}
        </main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
