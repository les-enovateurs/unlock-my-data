"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  const { setLang } = useLanguage();
  setLang("en");

  return (
    <>
      {/* Hero Section - Lighter and more focused */}
      <div className="hero min-h-[70vh] bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Abstract background shapes for "lightness" */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50"></div>

        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
              👋 Take back control of your digital life
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Your data,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                your rules.
              </span>
            </h1>
            <p className="py-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Unlock My Data is the civic platform to{" "}
              <strong>analyze</strong> your services, <strong>compare</strong> ethical
              alternatives and <strong>bulk delete</strong> your online traces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

              <Link href="/protect-my-data" className="btn btn-primary text-white btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-500 to-cyan-500 border-0 text-gray-900">
                🛡️ Protect my data
              </Link>
              <Link
                href="/compare"
                className="btn btn-outline btn-lg rounded-full px-8 bg-white hover:bg-gray-50"
              >
                📊 Compare services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features - The 3 Pillars (Analyze, Compare, Delete) */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1: Analyze */}
            <Link
              href="/list-app"
              prefetch={false}
              className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyze</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover the hidden side of your favorite apps. Trackers, permissions,
                privacy policy: we decode everything for you.
              </p>
              <button className=" cursor-pointer text-blue-600 font-semibold  flex items-center gap-2">
                Explore the catalog{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </Link>

            {/* Feature 2: Compare */}
            <Link
              href="/compare"
              className="group p-8 rounded-3xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Compare</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Don&apos;t choose at random anymore. Compare digital services on ethical
                criteria and find the alternative that respects you.
              </p>
              <button className="cursor-pointer text-purple-600 font-semibold flex items-center gap-2">
                Start a comparison{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </Link>

            {/* Feature 3: Delete */}
            <Link
              href="/supprimer-mes-donnees"
              className="group p-8 rounded-3xl bg-gray-50 hover:bg-red-50 transition-colors duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🗑️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Clean up your digital past. Automatically generate GDPR account
                deletion requests for dozens of services.
              </p>
              <button className="cursor-pointer text-red-600 font-semibold flex items-center gap-2">
                Delete my accounts{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Context Section - Redesigned "CNIL Alert" to be cleaner */}
      <div className="py-20 bg-gray-900 text-white rounded-t-[3rem] mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-red-400 uppercase border border-red-400 rounded-full">
                  Context 2025
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Why protecting your data has become{" "}
                  <span className="text-red-400">urgent</span>?
                </h2>
                <p className="text-gray-400 text-lg mb-6">
                  Massive data breaches are no longer the exception, but the rule. In
                  2024, the CNIL recorded a record increase in incidents.
                </p>
                <a
                  href="https://www.cnil.fr/fr/violations-massives-de-donnees-en-2024-quels-sont-les-principaux-enseignements-mesures-a-prendre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-red-400 underline-offset-4 hover:text-red-400 transition-colors"
                >
                  Read the CNIL report
                </a>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500 blur-3xl opacity-20"></div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-4xl font-bold text-white mb-2">5 629</div>
                      <div className="text-sm text-gray-400">Reported breaches</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-red-400 mb-2">+20%</div>
                      <div className="text-sm text-gray-400">Compared to 2023</div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-700">
                    <p className="text-sm text-gray-300 italic">
                      &quot;The number of breaches affecting more than one million people has
                      doubled in one year.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Section - Simplified */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                Get informed to act better
              </h2>
              <p className="text-gray-600 mt-4">
                The latest news about your digital rights
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <a
                href="https://les-enovateurs.com/precautions-discussing-generative-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <Image className={"h-48"}  alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprecautions-discussion-ia-generative.77e5b230.webp&w=1920&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Basic Precautions to Take</h3>
                  <p className="text-gray-600 text-sm">When Interacting With a Generative AI</p>
                </div>
              </a>

              <a
                href="https://les-enovateurs.com/nothing-to-hide-5-good-reasons-to-protect-online-data"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <Image className={"h-48"} alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne.4e24c6b2.webp&w=3840&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Nothing to hide?</h3>
                  <p className="text-gray-600 text-sm">Here are 5 good reasons to protect your data online anyway</p>
                </div>
              </a>

              <a
                  href="https://les-enovateurs.com/online-dating-love-stories-become-profitable"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Image className={"h-48"}  alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frencontres-en-ligne-histoires-amour-deviennent-lucratives.882c8d5e.webp&w=3840&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Online Dating</h3>
                  <p className="text-gray-600 text-sm">When Love Stories Become Profitable</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Section - Clean & Impactful */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mb-20"></div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
                An Open Source & Civic project
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                Unlock My Data is built by a community of volunteers. We rely on
                collective intelligence to document the practices of web giants.
              </p>

              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <a
                  href="/contribuer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-6 rounded-xl transition-colors border border-white/20"
                >
                  <div className="text-3xl mb-3">🔍</div>
                  <div className="font-bold mb-1">Analyze</div>
                  <div className="text-sm text-blue-100">Help us decipher services</div>
                </a>
                <a
                  href="https://github.com/les-enovateurs/unlock-my-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-6 rounded-xl transition-colors border border-white/20"
                >
                  <div className="text-3xl mb-3">💻</div>
                  <div className="font-bold mb-1">Code</div>
                  <div className="text-sm text-blue-100">Improve the platform</div>
                </a>
                <ShareButton
                  label={"Share"}
                  text={"Discover privacy details of your favorite services"}
                  url={""}
                  lang={"en"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Made with love */}
      <div className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Made with ❤️ by{" "}
            <a
              href="https://les-enovateurs.com"
              className="text-blue-600 hover:underline font-medium"
            >
              Les e-novateurs
            </a>
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link
              href="https://les-enovateurs.com/categories/frugality/1"
              className="hover:text-blue-600 transition-colors"
            >
              🌱 Digital ecology
            </Link>
            <Link
              href="https://les-enovateurs.com/categories/ethics/1"
              className="hover:text-blue-600 transition-colors"
            >
              🤝 Ethics
            </Link>
            <Link
              href="https://les-enovateurs.com/categories/inclusive/1"
              className="hover:text-blue-600 transition-colors"
            >
              💡 Inclusive
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
