"use client"
import {useLanguage} from "@/context/LanguageContext";

export default function LegalNotice() {
    const { setLang } = useLanguage();
    setLang('en')
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Legal Notice</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: March 1, 2025</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Site publisher</h2>
            <p className="mb-4">
              The Unlock My Data website is published by Les e-novateurs, a non-profit association.
            </p>
            <p className="mb-4">
              Registered office: Villefranche-sur-Saône, France<br />
              Email: <a href="mailto:contact@les-enovateurs.com" className="text-primary-600 hover:text-primary-800">contact@les-enovateurs.com</a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Hosting</h2>
            <p className="mb-4">
              This site is hosted by Ikoula.<br />
              Address: 32 Rue du Pont Assy, 51100 Reims
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Data sources</h2>
            <p className="mb-4">
              Unlock My Data uses and aggregates data from two main sources:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <a href="https://tosdr.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                  Terms of Service Didn't Read (ToSDR)
                </a>
                &nbsp;- For analysis of terms of service and privacy policies.
              </li>
              <li className="mb-2">
                <a href="https://exodus-privacy.eu.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                  Exodus Privacy
                </a>
                &nbsp;- For analysis of trackers and permissions in Android apps.
              </li>
            </ul>
            <p className="mb-4">
              This data is enriched and kept up to date thanks to the work of volunteers from the Les e-novateurs association and contributors from the open source community.
            </p>
            <p className="mb-4">
              We thank these organizations and all contributors for their valuable work in favor of transparency and the protection of digital privacy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Contribute</h2>
            <p className="mb-4">
              The Unlock My Data project is open source. You can propose modifications or improvements via our GitHub repository:
              <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 ml-1 flex items-center gap-2 mt-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                UnlockMyData GitHub repository
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
            <p className="mb-4">
              For any questions regarding this legal notice, you can contact us at:
              <a href="mailto:contact@les-enovateurs.com" className="text-primary-600 hover:text-primary-800 ml-1">contact@les-enovateurs.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

