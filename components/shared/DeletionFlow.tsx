"use client";

import { RefObject, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Translator from "../tools/t";
import dict from "../../i18n/DeleteMyData.json";
import { getScoreColor } from "../helpers";

interface Service {
  slug: string;
  name: string;
  logo: string;
  nationality?: string;
  url_delete?: string | null;
  contact_mail_delete?: string;
  need_id_card?: boolean | null;
  [key: string]: any;
}

interface DeletionFlowProps {
  // Data
  services: Service[];
  currentServiceIndex: number;

  // State
  completedServices: string[];
  skippedServices: string[];
  notes: Record<string, string>;

  // Configuration
  lang: string;
  showBackButton?: boolean;
  showPreviousButton?: boolean;
  showSkipButton?: boolean;
  totalSelected: number;

  // Optional context
  serviceDetails?: Record<string, { riskScore?: number }>;
  cardRef?: RefObject<HTMLDivElement>;

  // Callbacks
  onBack?: () => void;
  onPrevious?: () => void;
  onSkip: (slug: string) => void;
  onComplete: (slug: string) => void;
  onNavigate: (index: number) => void;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

/**
 * Shared deletion flow component used by both ProtectMyData and SupprimerMesDonnees
 * Handles the step-by-step process of deleting data from selected services
 */
export default function DeletionFlow({
  services,
  currentServiceIndex,
  completedServices,
  skippedServices,
  notes,
  lang,
  showBackButton = false,
  showPreviousButton = true,
  showSkipButton = true,
  totalSelected,
  serviceDetails,
  cardRef,
  onBack,
  onPrevious,
  onSkip,
  onComplete,
  onNavigate,
  setNotes,
}: DeletionFlowProps) {
  const t = useMemo(() => new Translator(dict, lang), [lang]);
  const currentService = services[currentServiceIndex];
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const progress = totalSelected > 0
    ? Math.round((completedServices.length / totalSelected) * 100)
    : 0;

  // Generate email template when service changes
  useEffect(() => {
    if (!currentService) return;

    const subject = lang === 'en'
      ? `Request for deletion of personal data (GDPR - Art. 17)`
      : `Demande de suppression de données personnelles (RGPD - Art. 17)`;

    const body = lang === 'en'
      ? `Dear Sir or Madam,

Under Article 17.1 of the General Data Protection Regulation (GDPR), I request that you erase my personal data associated with my account on ${currentService.name}.

I request deletion because I no longer use this service and wish to exercise my right to erasure.

Please also notify any third parties to whom you have disclosed my data (Article 19 GDPR).

Please inform me of the actions taken within one month of receipt of this request (Article 12.3 GDPR).

If you fail to respond or provide an incomplete response, I will file a complaint with the competent data protection authority.

Sincerely.`
      : `Madame, Monsieur,

En application de l'article 17.1 du Règlement général sur la protection des données (RGPD), je vous prie d'effacer de vos fichiers les données personnelles suivantes me concernant :

Toutes les données personnelles associées à mon compte et mon utilisation de ${currentService.name}.

Je demande que ces informations soient supprimées car :

Je n'utilise plus ce service et souhaite exercer mon droit à l'effacement.

Vous voudrez bien également notifier cette demande d'effacement de mes données aux organismes auxquels vous les auriez communiquées (article 19 du RGPD).

Enfin, je vous prie de m'informer de ces éléments dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de la réception de ce courrier (article 12.3 du RGPD).

À défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;

    setEmailSubject(subject);
    setEmailBody(body);
  }, [currentService, lang]);

  if (!currentService) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      {showBackButton && onBack && (
        <button onClick={onBack} className="btn btn-ghost gap-2">
          <ChevronLeft className="w-4 h-4" />
          {t.t("backToAnalysis")}
        </button>
      )}

      {/* Progress */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">{t.t("progressGlobal")}</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          />
          <p className="text-xs text-base-content/70 mt-1">
            {t.t("processedXofY")
              .replace("{completed}", String(completedServices.length))
              .replace("{total}", String(totalSelected))}
          </p>
          {t.t("sortedByRisk") && (
            <p className="text-xs text-base-content/50 mt-1 italic">
              {t.t("sortedByRisk")}
            </p>
          )}
        </div>
      </div>

      {/* Current Service */}
      <div ref={cardRef} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start gap-4 mb-4">
            {currentService.logo && (
              <div className="relative w-44 h-20 rounded-2xl">
                <Image
                  src={currentService.logo}
                  alt={currentService.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="card-title text-3xl">{currentService.name}</h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="badge">
                  {currentService.nationality || "International"}
                </span>
                {serviceDetails?.[currentService.slug]?.riskScore && t.t("riskScore") && (
                  <span
                    className={`badge ${getScoreColor(
                      serviceDetails[currentService.slug].riskScore || 100
                    )}`}
                  >
                    {t.t("riskScore")} {serviceDetails[currentService.slug].riskScore}
                  </span>
                )}
                {completedServices.includes(currentService.slug) && (
                  <span className="badge badge-success">✓ {t.t("badgeTreated")}</span>
                )}
                {skippedServices.includes(currentService.slug) && (
                  <span className="badge badge-warning text-white">
                    ⚠ {t.t("badgePending")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-4">
            {/* Warning */}
            <div className="alert alert-warning alert-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-black">{t.t("deletionWarningTitle")}</span>
            </div>

            {/* No deletion info available */}
            {!currentService.url_delete && !currentService.contact_mail_delete && (
              <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
                <div className="alert alert-info bg-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-white">{t.t("noInfo")}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">{t.t("tipsTitle")}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li dangerouslySetInnerHTML={{ __html: t.t("tipAccountSettings") }} />
                    <li dangerouslySetInnerHTML={{ __html: t.t("tipSearchEmail") }} />
                    <li dangerouslySetInnerHTML={{ __html: t.t("tipSendEmail") }} />
                  </ul>
                </div>

                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-sm">🤝 {t.t("contributeTitle")}</h4>
                    <p className="text-xs">{t.t("contributeDesc")}</p>
                    <Link
                      href={`/contribuer/modifier-fiche?slug=${currentService.slug}`}
                      target="_blank"
                      prefetch={false}
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm gap-2 mt-2 w-64"
                    >
                      ✏️ {t.t("suggestEdit")}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Online deletion form available */}
            {currentService.url_delete && (
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>✓</span> {t.t("onlineDeleteAvailable")}
                </h3>
                <a
                  href={currentService.url_delete}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm"
                >
                  {t.t("accessForm")} →
                </a>
              </div>
            )}

            {/* Email deletion */}
            {currentService.contact_mail_delete && (
              <div className="bg-base-200/50 p-6 rounded-xl border border-base-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Email template */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✉️</span>
                      <h3 className="font-bold text-lg">{t.t("emailTemplateTitle")}</h3>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold mb-2">
                          {t.t("subjectLabel")}
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label w-full mb-2">
                        <span className="label-text font-semibold">{t.t("bodyLabel")}</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-96 text-sm leading-relaxed w-full"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="space-y-6 lg:pt-12">
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                      <div className="card-body p-5">
                        <h4 className="font-bold text-sm uppercase text-base-content/70 mb-3">
                          {t.t("recipientLabel")}
                        </h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            className="input input-bordered w-full bg-base-200 font-mono text-sm"
                            value={currentService.contact_mail_delete}
                          />
                          <button
                            className="btn btn-square btn-ghost border-base-300"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                currentService.contact_mail_delete!
                              );
                              alert(t.t("emailCopied"));
                            }}
                            title={t.t("copyEmail")}
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`mailto:${
                          currentService.contact_mail_delete
                        }?subject=${encodeURIComponent(
                          emailSubject
                        )}&body=${encodeURIComponent(emailBody)}`}
                        className="btn btn-primary btn-block btn-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        🚀 {t.t("sendEmail")}
                        <span className="text-xs font-normal opacity-80 block">
                          {t.t("opensMailClient")}
                        </span>
                      </a>

                      <div className="divider text-xs text-base-content/50 font-medium">
                        {t.t("orCopyManually")}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(emailSubject);
                            alert(t.t("subjectCopied"));
                          }}
                        >
                          {t.t("copySubject")}
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(emailBody);
                            alert(t.t("messageCopied"));
                          }}
                        >
                          {t.t("copyBody")}
                        </button>
                      </div>
                    </div>

                    <div className="alert alert-info text-xs mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-white">{t.t("modelInfo")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ID card required */}
            {currentService.need_id_card && (
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{t.t("idRequired")}</span>
              </div>
            )}

            {/* Notes */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold w-full mb-2">
                  📝 {t.t("notesLabel")}
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder={t.t("notesPlaceholder")}
                value={notes[currentService.slug] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({
                    ...prev,
                    [currentService.slug]: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="divider" />

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            {showPreviousButton && onPrevious && (
              <button
                className="btn btn-outline"
                onClick={onPrevious}
                disabled={currentServiceIndex === 0}
              >
                ← {t.t("previous")}
              </button>
            )}

            <p className="text-sm text-base-content/60 mx-4">
              {t.t("serviceXofY")
                .replace("{index}", String(currentServiceIndex + 1))
                .replace("{total}", String(services.length))}
            </p>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      {services.length > 1 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            <h3 className="font-semibold text-sm mb-2">{t.t("quickNav")}</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <button
                  key={service.slug}
                  className={`btn btn-xs ${
                    index === currentServiceIndex
                      ? "btn-primary"
                      : completedServices.includes(service.slug)
                      ? "btn-success"
                      : skippedServices.includes(service.slug)
                      ? "btn-warning"
                      : "btn-ghost"
                  }`}
                  onClick={() => onNavigate(index)}
                >
                  {completedServices.includes(service.slug) && "✓ "}
                  {skippedServices.includes(service.slug) && "⚠ "}
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky action buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-3 bg-base-100 p-3 rounded-box shadow-2xl border border-base-300 items-center">
          {showSkipButton && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onSkip(currentService.slug)}
            >
              {t.t("skipForLater")}
            </button>
          )}
          <button
            className="btn btn-primary btn-lg shadow-lg"
            onClick={() => onComplete(currentService.slug)}
          >
            {completedServices.includes(currentService.slug) ? t.t("next") : t.t("markCompleted")}
            →
          </button>
        </div>
      </div>
    </div>
  );
}

