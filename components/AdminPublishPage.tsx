"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle, ExternalLink, Lock } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/AdminPublish.json";

interface AdminPublishPageProps {
  lang: "fr" | "en";
}

export default function AdminPublishPage({ lang }: AdminPublishPageProps) {
  const t = new Translator(dict as any, lang);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_REVIEW_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError(t.t("incorrectPassword"));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="card-title justify-center text-2xl mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              {t.t("adminPanel")}
            </h2>
            
            {error && (
              <div className="alert alert-error mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium">{t.t("password")}</span>
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {t.t("accessDashboard")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              {t.t("moderationDashboard")}
            </h1>
            <p className="text-base-content/70 mt-2">
              {t.t("moderationDesc")}
            </p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="btn btn-ghost">
            {t.t("logout")}
          </button>
        </div>

        <div className="alert alert-warning mb-8">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">{t.t("staticSiteNote")}</h3>
            <div className="text-sm">
              {t.t("staticSiteDesc")}
              <br/>
              {t.t("howToModerate")}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">{t.t("publicationWorkflow")}</h2>
              <ul className="steps steps-vertical gap-4">
                <li className="step step-primary">
                  <span className="font-semibold">{t.t("findPR")}</span>
                  <div className="text-sm text-base-content/70">{t.t("findPRDesc")}</div>
                </li>
                <li className="step step-primary">
                  <span className="font-semibold">{t.t("reviewChanges")}</span>
                  <div className="text-sm text-base-content/70">{t.t("reviewChangesDesc")}</div>
                </li>
                <li className="step step-primary">
                  <span className="font-semibold">{t.t("modifyStatus")}</span>
                  <div className="text-sm text-base-content/70">{t.t("modifyStatusDesc")}
                    <div className="mt-2 space-y-1">
                      <div><code className="bg-base-200 px-2 py-1 rounded text-xs">"status": "published"</code> {t.t("publishTo")}</div>
                      <div><code className="bg-base-200 px-2 py-1 rounded text-xs">"status": "changes_requested"</code> {t.t("requestChangesTo")}</div>
                    </div>
                  </div>
                </li>
                <li className="step step-primary">
                  <span className="font-semibold">{t.t("addReview")}</span>
                  <div className="text-sm text-base-content/70">{t.t("addReviewDesc")}</div>
                </li>
                <li className="step step-primary">
                  <span className="font-semibold">{t.t("commitAndMerge")}</span>
                  <div className="text-sm text-base-content/70">{t.t("commitAndMergeDesc")}</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">{t.t("reviewJSONExample")}</h2>
              <div className="mockup-code bg-neutral text-neutral-content text-sm">
                <pre data-prefix="1"><code>{`{`}</code></pre>
                <pre data-prefix="2"><code>{`  "name": "Netflix",`}</code></pre>
                <pre data-prefix="3"><code>{`  "status": "changes_requested",`}</code></pre>
                <pre data-prefix="4"><code>{`  "review": [`}</code></pre>
                <pre data-prefix="5"><code>{`    {`}</code></pre>
                <pre data-prefix="6"><code>{`      "field": "contact_mail_export",`}</code></pre>
                <pre data-prefix="7"><code>{`      "message": "Email seems invalid, please verify",`}</code></pre>
                <pre data-prefix="8"><code>{`      "reviewer": "John Moderator",`}</code></pre>
                <pre data-prefix="9"><code>{`      "timestamp": "2024-02-24T10:00:00Z"`}</code></pre>
                <pre data-prefix="10"><code>{`    }`}</code></pre>
                <pre data-prefix="11"><code>{`  ]`}</code></pre>
                <pre data-prefix="12"><code>{`}`}</code></pre>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">{t.t("pendingPRs")}</h2>
              <p className="text-base-content/70 mb-4">
                {t.t("viewAllContributions")}
              </p>
              <a 
                href="https://github.com/les-enovateurs/unlock-my-data/pulls" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {t.t("viewPRsOnGitHub")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
