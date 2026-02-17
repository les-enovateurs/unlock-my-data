import { RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { getScoreColor } from "../helpers";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Service, ServiceDetails } from "@/constants/protectData";

interface ProtectDataDeletionProps {
  lang: string;
  currentService: Service;
  setStep: (step: number) => void;
  progress: number;
  completedServices: string[];
  selectedSlugsSize: number;
  cardRef: RefObject<HTMLDivElement>;
  serviceDetails: Record<string, ServiceDetails>;
  skippedServices: string[];
  emailSubject: string;
  setEmailSubject: (s: string) => void;
  emailBody: string;
  setEmailBody: (b: string) => void;
  notes: Record<string, string>;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  currentServiceIndex: number;
  setCurrentServiceIndex: (idx: number) => void;
  sortedServicesLength: number;
  sortedServices: Service[];
  markAsSkipped: (slug: string) => void;
  markAsCompleted: (slug: string) => void;
}

export default function ProtectDataDeletion({
  lang,
  currentService,
  setStep,
  progress,
  completedServices,
  selectedSlugsSize,
  cardRef,
  serviceDetails,
  skippedServices,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  notes,
  setNotes,
  currentServiceIndex,
  setCurrentServiceIndex,
  sortedServicesLength,
  sortedServices,
  markAsSkipped,
  markAsCompleted,
}: ProtectDataDeletionProps) {
  const t = new Translator(dict, lang);
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setStep(2)} className="btn btn-ghost gap-2">
        <ChevronLeft className="w-4 h-4" />
        {t.t("backToAnalysis")}
      </button>

      {/* Progress */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              {t.t("progressGlobal")}
            </span>
            <span className="text-sm">{progress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          ></progress>
          <p className="text-xs text-base-content/70 mt-1">
            {t.t("processedXofY")
              .replace("{completed}", String(completedServices.length))
              .replace("{total}", String(selectedSlugsSize))}
          </p>
          <p className="text-xs text-base-content/50 mt-1 italic">
            {t.t("sortedByRisk")}
          </p>
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
                {serviceDetails[currentService.slug] && (
                  <span
                    className={`badge ${getScoreColor(
                      serviceDetails[currentService.slug].riskScore || 100
                    ).replace("text-", "badge-")}`}
                  >
                    {t.t("riskScore")}:{" "}
                    {serviceDetails[currentService.slug].riskScore}
                  </span>
                )}
                {completedServices.includes(currentService.slug) && (
                  <span className="badge badge-success">
                    ✓ {t.t("badgeTreated")}
                  </span>
                )}
                {skippedServices.includes(currentService.slug) && (
                  <span className="badge badge-warning text-white">
                    ⚠ {t.t("badgePending")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
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
              <span className={"text-black"}>
                {t.t("deletionWarningTitle")}
              </span>
            </div>

            {!currentService.url_delete &&
              !currentService.contact_mail_delete && (
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
                      ></path>
                    </svg>
                    <span className={"text-white"}>{t.t("noInfo")}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold">{t.t("tipsTitle")}</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li
                        dangerouslySetInnerHTML={{
                          __html: t.t("tipAccountSettings"),
                        }}
                      />

                      <li
                        dangerouslySetInnerHTML={{
                          __html: t.t("tipSearchEmail"),
                        }}
                      />

                      <li
                        dangerouslySetInnerHTML={{
                          __html: t.t("tipSendEmail"),
                        }}
                      />
                    </ul>
                  </div>

                  <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="font-bold text-sm">
                        🤝{" "}
                        {lang === "en"
                          ? "Contribute to the project"
                          : "Contribuez au projet"}
                      </h4>
                      <p className="text-xs">
                        {lang === "en"
                          ? "If you find how to delete this account, help other users!"
                          : "Si vous trouvez comment supprimer ce compte, aidez les autres utilisateurs !"}
                      </p>
                      <Link
                        href={`/contribuer/modifier-fiche?slug=${currentService.slug}`}
                        target="_blank"
                        prefetch={false}
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm gap-2 mt-2 w-64 bg-"
                      >
                        ✏️ {t.t("suggestEdit")}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

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

            {currentService.contact_mail_delete && (
              <div className="bg-base-200/50 p-6 rounded-xl border border-base-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Editable Template */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✉️</span>
                      <h3 className="font-bold text-lg">
                        {t.t("emailTemplateTitle")}
                      </h3>
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
                        <span className="label-text font-semibold">
                          {t.t("bodyLabel")}
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-96 text-sm leading-relaxed w-full"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column: Recipient & Actions */}
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
                        ></path>
                      </svg>
                      <span className={"text-white"}>
                        {t.t("modelInfo")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  ></path>
                </svg>
                <span>{t.t("idRequired")}</span>
              </div>
            )}

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
              ></textarea>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex justify-between items-center">
            <button
              className="btn btn-outline"
              onClick={() => {
                if (currentServiceIndex > 0) {
                  setCurrentServiceIndex(currentServiceIndex - 1);
                }
              }}
              disabled={currentServiceIndex === 0}
            >
              ← {t.t("previous")}
            </button>

            <p className="text-sm text-base-content/60 mx-4">
              {t.t("serviceXofY")
                .replace("{index}", String(currentServiceIndex + 1))
                .replace("{total}", String(sortedServicesLength))}
            </p>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-4">
          <h3 className="font-semibold text-sm mb-2">{t.t("quickNav")}</h3>
          <div className="flex flex-wrap gap-2">
            {sortedServices.map((service, index) => (
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
                onClick={() => setCurrentServiceIndex(index)}
              >
                {completedServices.includes(service.slug) && "✓ "}
                {skippedServices.includes(service.slug) && "⚠ "}
                {service.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-3 bg-base-100 p-3 rounded-box shadow-2xl border border-base-300 items-center">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              markAsSkipped(currentService.slug);
              if (currentServiceIndex < sortedServicesLength - 1) {
                setCurrentServiceIndex(currentServiceIndex + 1);
              } else {
                setStep(4);
              }
            }}
          >
            {t.t("skipForLater")}
          </button>
          <button
            className="btn btn-primary btn-lg shadow-lg"
            onClick={() => {
              markAsCompleted(currentService.slug);
              if (currentServiceIndex < sortedServicesLength - 1) {
                setCurrentServiceIndex(currentServiceIndex + 1);
              } else {
                setStep(4);
              }
            }}
          >
            {completedServices.includes(currentService.slug)
              ? t.t("next")
              : t.t("markCompleted")}
            →
          </button>
        </div>
      </div>
    </div>
  );
}

