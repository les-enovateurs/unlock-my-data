import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Unlock My Data",
  description: "TODO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="bg-white">
        <Header />
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
