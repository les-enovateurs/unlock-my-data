import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Service, getAlternatives } from "@/constants/protectData";
import { SERVICE_CATEGORIES } from '../../constants/protectData';
import {
  ChevronLeft,
  CheckCircle,
  ArrowRight,
  Download,
  Trash,
  Copy,
  Mail,
  Shuffle,
  SkipForward,
  ExternalLink,
} from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import AlternativeComparison from "./AlternativeComparison";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type SubStep = "alternative" | "export" | "delete";

interface ServiceAction {
  slug: string;
  priority: "urgent" | "recommended" | "optional";
  needsAlternative: boolean;
  needsPasswordChange: boolean;
}

interface ProtectDataActionsProps {
  lang: string;
  services: Service[];
  setStep: (step: number) => void;
  currentActionIndex: number;
  setCurrentActionIndex: (index: number) => void;
  actionsToProcess: Array<{
    slug: string;
    type: "find_alternative" | "change_password" | "export_data" | "delete_account";
    priority: "urgent" | "recommended" | "optional";
  }>;
  alternativesAdopted: Record<string, string>;
  alternativesSkipped: string[];
  markAlternativeAdopted: (slug: string, alternativeSlug: string) => void;
  markAlternativeSkipped: (slug: string) => void;
  passwordsChanged: string[];
  markPasswordChanged: (slug: string) => void;
  dataExported: string[];
  markDataExported: (slug: string) => void;
  markAsCompleted: (slug: string) => void;
  cardRef: RefObject<HTMLDivElement>;
  manualAlternativesMap?: Record<string, string[]>;
}

export default function ProtectDataActions({
  lang,
  services,
  setStep,
  currentActionIndex,
  setCurrentActionIndex,
  actionsToProcess,
  alternativesAdopted,
  alternativesSkipped,
  markAlternativeAdopted,
  markAlternativeSkipped,
  passwordsChanged,
  markPasswordChanged,
  dataExported,
  markDataExported,
  markAsCompleted,
  cardRef,
  manualAlternativesMap,
}: ProtectDataActionsProps) {
  const t = new Translator(dict, lang);

  // Build a stable memoized list of services to process (one per service slug)
  const serviceGroups: ServiceAction[] = useMemo(() => {
    const seen = new Set<string>();
    const groups: ServiceAction[] = [];
    for (const action of actionsToProcess) {
      if (!seen.has(action.slug)) {
        seen.add(action.slug);
        const needsAlternative = actionsToProcess.some(
          (a) => a.slug === action.slug && a.type === "find_alternative"
        );
        const needsPasswordChange = actionsToProcess.some(
          (a) => a.slug === action.slug && a.type === "change_password"
        );
        groups.push({
          slug: action.slug,
          priority: action.priority,
          needsAlternative,
          needsPasswordChange,
        });
      }
    }
    return groups;
    // actionsToProcess is stable (built once from analysisResult + selectedSlugs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsToProcess]);

  const totalServices = serviceGroups.length;
  const currentGroup = serviceGroups[currentActionIndex] ?? null;
  const currentService = services.find((s) => s.slug === currentGroup?.slug) ?? null;

  // Sub-step within the current service.
  // We use a ref as source-of-truth so transitions are immune to parent re-renders
  // that could cause stale closures in useEffect.
  const subStepRef = useRef<SubStep>("alternative");
  const [subStep, setSubStepState] = useState<SubStep>("alternative");

  const setSubStep = (s: SubStep) => {
    subStepRef.current = s;
    setSubStepState(s);
  };

  const [selectedAlternative, setSelectedAlternative] = useState<string>("");
  const [migrationGuide, setMigrationGuide] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const prevIndexRef = useRef<number>(-1);

  // Reset sub-step state only when the service index actually changes
  useEffect(() => {
    if (prevIndexRef.current === currentActionIndex) return;
    prevIndexRef.current = currentActionIndex;

    const currentSlug = serviceGroups[currentActionIndex]?.slug;
    if (!currentSlug) return;

    // Check if we already have data for this service
    const hasAdoptedAlternative = currentSlug in alternativesAdopted;
    const hasSkippedAlternative = alternativesSkipped.includes(currentSlug);
    const hasExportedData = dataExported.includes(currentSlug);

    // Determine initial step based on what's already done
    let initialStep: SubStep = "alternative";
    if (hasAdoptedAlternative || hasSkippedAlternative || !serviceGroups[currentActionIndex]?.needsAlternative) {
      initialStep = "export";
      if (hasExportedData) {
        initialStep = "delete";
      }
    }

    setSubStep(initialStep);

    // Restore previously selected alternative if it exists
    const previouslySelected = alternativesAdopted[currentSlug];
    setSelectedAlternative(previouslySelected && previouslySelected !== "__already__" ? previouslySelected : "");

    setMigrationGuide(null);
    setCopied(false);
  }, [currentActionIndex, serviceGroups, alternativesAdopted, alternativesSkipped, dataExported]);

  // Generate email template when service changes or sub-step is delete
  useEffect(() => {
    if (!currentService || subStep !== "delete") return;

    const subject =
      lang === "en"
        ? `Request for deletion of personal data (GDPR - Art. 17)`
        : `Demande de suppression de données personnelles (RGPD - Art. 17)`;

    const body =
      lang === "en"
        ? `Dear Sir or Madam,

Under Article 17.1 of the General Data Protection Regulation (GDPR), I request that you erase my personal data associated with my account on ${currentService.name}.

I request deletion because I no longer use this service and wish to exercise my right to erasure.

Please also notify any third parties to whom you have disclosed my data (Article 19 GDPR).

Please confirm the deletion or inform me of any reason for delay or refusal within one month.

Sincerely,`
        : `Madame, Monsieur,

Conformément à l'article 17.1 du Règlement Général sur la Protection des Données (RGPD), je vous prie d'effacer mes données personnelles associées à mon compte sur ${currentService.name}.

Je demande cette suppression car je n'utilise plus ce service et je souhaite exercer mon droit à l'effacement.

Merci de notifier également tout tiers à qui vous auriez communiqué mes données (Article 19 du RGPD).

Je vous remercie de me confirmer la suppression ou de m'informer de tout motif de retard ou de refus dans un délai d'un mois.

Cordialement,`;

    setEmailSubject(subject);
    setEmailBody(body);
  }, [currentService, subStep, lang]);

  // Fetch migration guide when alternative selected
  useEffect(() => {
    if (!selectedAlternative || !currentService) {
      setMigrationGuide(null);
      return;
    }

    let mounted = true;

    const locale = (lang || "en").split("-")[0]; // normalize e.g. "fr-FR" -> "fr"

    // Try language-specific filenames first, then fallback to generic `.md`.
    const candidates = [
      `/data/migrations/${currentService.slug}/${selectedAlternative}.${locale}.md`,
      // Also try explicit fr/en variants in case locale is something unexpected
      `/data/migrations/${currentService.slug}/${selectedAlternative}.${locale === "fr" ? "fr" : "en"}.md`,
    ];

    const fetchGuide = async () => {
      for (const url of candidates) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            if (!mounted) return;
            setMigrationGuide(text);
            return; // stop after first successful fetch
          }
        } catch (err) {
          // ignore and try next candidate
        }
      }

      if (mounted) {
        setMigrationGuide(null);
      }
    };

    fetchGuide();

    return () => {
      mounted = false;
    };
  }, [selectedAlternative, currentService, lang]);

  if (!currentGroup || !currentService || totalServices === 0) {
    return null;
  }

  const service = currentService;
  const alternatives = getAlternatives(service.slug, manualAlternativesMap);
  const progress = Math.round(((currentActionIndex) / totalServices) * 100);

  const goToNextService = () => {
    if (currentActionIndex < totalServices - 1) {
      setCurrentActionIndex(currentActionIndex + 1);
    } else {
      setStep(4);
    }
  };

  // Sub-step handlers
  const handleAlternativeAdopted = () => {
    if (!selectedAlternative) return;
    markAlternativeAdopted(service.slug, selectedAlternative);
    goToNextService();
  };

  const handleAlreadyHaveAlternative = () => {
    if (!selectedAlternative) return;
    markAlternativeAdopted(service.slug, selectedAlternative);
    setSubStep("export");
  };

  const handleSkipAlternative = () => {
    markAlternativeSkipped(service.slug);
    setSubStep("export");
  };

  const handleExportDone = () => {
    markDataExported(service.slug);
    setSubStep("delete");
  };

  const handleSkipExport = () => {
    setSubStep("delete");
  };

  const handleDeleted = () => {
    markAsCompleted(service.slug);
    goToNextService();
  };

  const handleSkipDeletion = () => {
    goToNextService();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subStepOrder: SubStep[] = ["alternative", "export", "delete"];
  const subStepIndex = subStepOrder.indexOf(subStep);

  const priorityBadgeClass =
    currentGroup.priority === "urgent"
      ? "badge-error text-white"
      : currentGroup.priority === "recommended"
        ? "badge-warning"
        : "badge-ghost";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setStep(2)} className="btn btn-ghost gap-2">
        <ChevronLeft className="w-4 h-4" />
        {t.t("backToAnalysis")}
      </button>

      {/* Overall progress */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t.t("progressGlobal")}</span>
            <span className="text-sm text-base-content/70">
              {currentActionIndex + 1} / {totalServices}
            </span>
          </div>
          <progress className="progress progress-primary w-full" value={progress} max="100" />
        </div>
      </div>

      {/* Service Card */}
      <div ref={cardRef} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Service header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {service.logo && (
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-12 h-12 rounded-lg object-contain"
                />
              )}
              <div>
                <h2 className="card-title">{service.name}</h2>
                <span className={`badge ${priorityBadgeClass}`}>
                  {t.t(currentGroup.priority)}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-step tabs */}
          <div className="flex gap-1 mb-6">
            {[
              { key: "alternative" as SubStep, icon: <Shuffle className="w-3 h-3" />, label: t.t("tabAlternative") },
              { key: "export" as SubStep, icon: <Download className="w-3 h-3" />, label: t.t("tabExport") },
              { key: "delete" as SubStep, icon: <Trash className="w-3 h-3" />, label: t.t("tabDelete") },
            ].map(({ key, icon, label }, idx) => {
              const isActive = subStep === key;
              const isDone = idx < subStepIndex;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isDone) setSubStep(key);
                  }}
                  disabled={!isActive && !isDone}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${isActive ? "bg-primary text-primary-content" : isDone ? "bg-success/20 text-success hover:bg-success/30 cursor-pointer" : "bg-base-200 text-base-content/50 cursor-not-allowed"}`}
                >
                  {isDone ? <CheckCircle className="w-3 h-3" /> : icon}
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── SUB-STEP: ALTERNATIVE ── */}
          {subStep === "alternative" && (
            <div className="space-y-4">
              <div className="alert alert-info">
                <Shuffle className="w-5 h-5 shrink-0 text-white" />
                <div>
                  <h3 className="font-bold text-white">{t.t("findAlternativeTitle")}</h3>
                  <p className="text-sm text-white">{t.t("findAlternativeDesc")}</p>
                </div>
              </div>

              {/* Show previously adopted alternative */}
              {alternativesAdopted[service.slug] && (
                <div className="alert alert-success">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="font-bold">
                      {lang === "fr" ? "Alternative déjà enregistrée" : "Alternative already saved"}
                    </h4>
                    <p className="text-sm">
                      {lang === "fr"
                        ? "Vous pouvez modifier votre choix ci-dessous ou passer à l'étape suivante."
                        : "You can change your choice below or skip to the next step."}
                    </p>
                  </div>
                </div>
              )}

              {alternatives.length > 0 ? (
                <div className="space-y-3">
                  <AlternativeComparison
                    lang={lang}
                    currentSlug={service.slug}
                    alternativeSlugs={alternatives.slice(0, 3)}
                    selectedAlternative={selectedAlternative}
                    onSelectAlternative={setSelectedAlternative}
                  />

                  {migrationGuide && (
                    <div className="mt-4 p-4 bg-base-200 rounded-xl mb-4 text-sm prose prose-sm max-w-none">
                      <h4 className="font-bold flex items-center gap-2 mb-2">
                        <span className="text-xl">📚</span>
                        {t.t("migrationGuideTitle")}
                      </h4>
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{migrationGuide}</ReactMarkdown>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    {/* Try: save choice as "to try" and move on */}
                    <button
                      onClick={handleAlternativeAdopted}
                      disabled={!selectedAlternative}
                      className="btn btn-primary btn-block gap-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                      {t.t("tryAlternative")}
                    </button>

                    <button
                      onClick={handleAlreadyHaveAlternative}
                      className="btn btn-success btn-outline btn-block gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {selectedAlternative ? t.t("alreadyHaveThisAlternative") : t.t("alreadyHaveAlternative")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <span>{t.t("noAlternativesFound")}</span>
                </div>
              )}

              <button
                onClick={handleSkipAlternative}
                className="btn btn-ghost btn-block gap-2"
              >
                <SkipForward className="w-4 h-4" />
                {t.t("skipThisStep")}
              </button>
            </div>
          )}

          {/* ── SUB-STEP: EXPORT ── */}
          {subStep === "export" && (
            <div className="space-y-4">
              <div className="alert alert-info">
                <Download className="w-5 h-5 shrink-0" />
                <div>
                  <h3 className="font-bold">{t.t("exportDataTitle")}</h3>
                  <p className="text-sm">{t.t("exportDataDesc")}</p>
                </div>
              </div>

              <div className="bg-base-200 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">{t.t("exportTips")}</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-base-content/70">
                  <li>{t.t("exportTip1")}</li>
                  <li>{t.t("exportTip2")}</li>
                  <li>{t.t("exportTip3")}</li>
                </ul>
              </div>

              {service.url_delete && (
                <a
                  href={service.url_delete}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-block gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t.t("goToService")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={handleExportDone}
                className="btn btn-primary btn-block gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {t.t("dataExported")}
              </button>

              <button
                onClick={handleSkipExport}
                className="btn btn-ghost btn-block gap-2"
              >
                <SkipForward className="w-4 h-4" />
                {t.t("skipDontNeed")}
              </button>
            </div>
          )}

          {/* ── SUB-STEP: DELETE ── */}
          {subStep === "delete" && (
            <div className="space-y-4">
              <div className="alert alert-error">
                <Trash className="w-5 h-5 shrink-0" />
                <div>
                  <h3 className="font-bold">{t.t("deleteAccountTitle")}</h3>
                  <p className="text-sm">{t.t("deleteAccountDesc")}</p>
                </div>
              </div>

              {/* Direct deletion URL */}
              {service.url_delete && (
                <a
                  href={service.url_delete}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-error btn-block gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t.t("goToDeletionPage")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              {/* Email template */}
              {(service.contact_mail_delete || !service.url_delete) && (
                <div className="bg-base-200 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">{t.t("emailTemplate")}</h4>
                  <div className="text-sm text-base-content/70 space-y-1">
                    <div>
                      <span className="font-semibold">{t.t("subject")} : </span>
                      {emailSubject}
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">{t.t("body")} :</span>
                      <pre className="whitespace-pre-wrap font-sans text-xs mt-1">{emailBody}</pre>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(`${emailSubject}\n\n${emailBody}`)}
                    className="btn btn-outline btn-block gap-2"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {t.t(copied ? "copied" : "copyToClipboard")}
                  </button>

                  {service.contact_mail_delete && (
                    <a
                      href={`mailto:${service.contact_mail_delete}?subject=${encodeURIComponent(
                        emailSubject
                      )}&body=${encodeURIComponent(emailBody)}`}
                      className="btn btn-primary btn-block gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-4 h-4" />
                      {t.t("sendEmail")}
                    </a>
                  )}

                  {!service.contact_mail_delete && !service.url_delete && (
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        emailSubject
                      )}&body=${encodeURIComponent(emailBody)}`}
                      className="btn btn-primary btn-block gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-4 h-4" />
                      {t.t("sendEmail")}
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={handleDeleted}
                className="btn btn-success btn-block gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {t.t("deletionDone")}
              </button>

              <button
                onClick={handleSkipDeletion}
                className="btn btn-ghost btn-block gap-2"
              >
                <SkipForward className="w-4 h-4" />
                {t.t("skipToNextService")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick navigation between services */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <h4 className="text-sm font-medium mb-3">{t.t("quickNav")}</h4>
          <div className="flex flex-wrap gap-2">
            {serviceGroups.map((group, idx) => {
              const svc = services.find((s) => s.slug === group.slug);
              const isDone =
                dataExported.includes(group.slug) ||
                alternativesAdopted[group.slug] !== undefined;
              return (
                <button
                  key={group.slug}
                  onClick={() => setCurrentActionIndex(idx)}
                  className={`btn btn-sm gap-1 ${idx === currentActionIndex
                      ? "btn-primary"
                      : isDone
                        ? "btn-success"
                        : "btn-ghost"
                    }`}
                  title={svc?.name}
                >
                  {svc?.name}
                  {isDone && <CheckCircle className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

