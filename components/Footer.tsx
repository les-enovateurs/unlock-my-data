import Link from "next/link";
import Image from "next/image";
import logo from "../public/logoUMD.webp";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { lang } = useLanguage();
    const isFr = lang === "fr";

    return (
        <footer role="contentinfo" className="bg-base-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1">
                        <Link prefetch={false} href={isFr ? "/" : "/en"} className="block mb-4">
                            <Image src={logo} alt={"Unlock My Data"} className="w-32" />
                        </Link>
                        <p className="text-gray-600 text-sm">
                            {isFr
                                ? "Reprenons le contrôle sur nos données personnelles en ligne."
                                : "Let’s regain control of our personal data online."}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="col-span-1">
                        <h3 className="font-semibold text-lg mb-4">
                            {isFr ? "Navigation" : "Navigation"}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={isFr ? "/" : "/en"}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {isFr ? "Accueil" : "Home"}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={isFr ? "/liste-applications" : "/list-app"}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {isFr ? "Listes des applications" : "List of applications"}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={isFr ? "/contribuer" : "/contribute"}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {isFr ? "Contribuer" : "Contribute"}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={isFr ? "/comparer" : "/compare"}
                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                >
                                    {isFr ? "Comparer les services" : "Compare services"}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact / Follow us */}
                    <div className="col-span-1">
                        <h3 className="font-semibold text-lg mb-4">
                            {isFr ? "Nous suivre" : "Follow us"}
                        </h3>
                        <div className="flex space-x-4">
                            <Link
                                prefetch={false}
                                href="https://github.com/les-enovateurs/unlock-my-data"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor"/></svg>
                                Github
                            </Link>
                            <Link
                                prefetch={false}
                                href="https://mastodon.social/@enovateurs_media"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
                                </svg>
                                Mastodon
                            </Link>
                            <Link prefetch={false}
                                href="https://www.linkedin.com/company/les-enovateurs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} Unlock My Data.{" "}
                            {isFr ? "Tous droits réservés." : "All rights reserved."}
                        </p>
                        <p className="text-sm text-gray-600">
                            {isFr ? "Fait avec ❤️ par " : "Made with ❤️ by "}
                            <Link
                                href="https://les-enovateurs.com/en"
                                target="_blank"
                                prefetch={false}
                                className="hover:text-primary-600 transition-colors hover:underline"
                            >
                                les e-novateurs
                            </Link>
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link
                                href={isFr ? "/mentions-legales" : "/legal-notice"}
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                {isFr ? "Mentions légales" : "Legal notice"}
                            </Link>
                            <Link
                                href={
                                    isFr
                                        ? "/politique-confidentialite"
                                        : "/privacy-policy"
                                }
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                {isFr
                                    ? "Politique de confidentialité"
                                    : "Privacy policy"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
