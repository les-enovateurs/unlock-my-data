// "use client";

import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import localFont from 'next/font/local'
// import { Inter } from 'next/font/google'
 import { Suspense } from 'react'
// // If loading a variable font, you don't need to specify the font weight
// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Unlock My Data",
  description: "TODO",
};

const myFont = localFont({ src: './../fonts/Luciole/Luciole-Regular.ttf' })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr"
    style={{
      fontFamily: myFont.style.fontFamily,
    }}
    >
      <body className={`bg-white`}>
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
