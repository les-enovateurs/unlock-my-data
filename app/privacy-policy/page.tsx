"use client"
import {useLanguage} from "@/context/LanguageContext";

export default function PrivacyPolicy() {
    const { setLang } = useLanguage();
    setLang('en')
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: March 1, 2025</p>

            <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Unlock My Data is committed to protecting the privacy of users of our platform.
              This privacy policy explains how we collect, use, and protect your personal data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Data collected</h2>
            <p className="mb-4">We only collect the data necessary for the proper functioning of our service:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Anonymous browsing data (pages visited, time spent on the site).</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Use of data</h2>
            <p className="mb-4">This data is used to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Improve our service and your user experience.</li>
              <li>Generate anonymous usage statistics.</li>
              <li>Ensure the security of our platform.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Data protection</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your data against any unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Your rights</h2>
            <p className="mb-4">Since no personal data is processed, the rights provided by the GDPR (access, rectification, erasure, restriction, portability, objection) do not apply.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <p className="mb-4">
              For any questions regarding our privacy policy,
              you can contact us via our contact form or by email at:
              <a href="mailto:contact@les-enovateurs.com" className="text-primary-600 hover:text-primary-800 ml-1">contact@les-enovateurs.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

