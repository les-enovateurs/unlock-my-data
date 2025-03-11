// "use client";

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
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
