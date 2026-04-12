import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { useRouter } from "next/navigation";
import { useProtectData } from "@/context/ProtectDataContext";

interface ProtectDataNavProps {
  step: number;
  setStep: (step: number) => void;
  selectedSlugsSize: number;
  hasAnalysisResult: boolean;
  hasActions: boolean;
  goToAnalysis: () => void;
  goToActions: () => void;
  lang: string;
}

export default function ProtectDataNav({
  step,
  setStep,
  selectedSlugsSize,
  hasAnalysisResult,
  hasActions,
  goToAnalysis,
  goToActions,
  lang,
}: ProtectDataNavProps) {
  const t = new Translator(dict, lang);
  const router = useRouter();
  const { actionsToProcess } = useProtectData();

  const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';

  const navigateTo = (targetStep: number) => {
    switch (targetStep) {
      case 1:
        router.push(basePath);
        break;
      case 2:
        if (selectedSlugsSize > 0) {
          goToAnalysis();
        }
        break;
      case 3:
        if (hasAnalysisResult && actionsToProcess.length > 0) {
          goToActions();
        }
        break;
      case 4:
        if (hasAnalysisResult) {
          const summaryPath = lang === 'fr' ? 'bilan' : 'summary';
          router.push(`${basePath}/${summaryPath}`);
        }
        break;
    }
  };

  return (
    <nav className="bg-base-100 border border-base-300 rounded-box shadow-sm mb-8" aria-label={t.t("progressGlobal")}>
      <div className="px-4 py-4 overflow-x-auto">
        <ul className="steps steps-horizontal w-full min-w-[600px]">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
            <button
              className="step-content cursor-pointer hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              onClick={() => navigateTo(1)}
              aria-current={step === 1 ? "step" : undefined}
            >
              {t.t("stepSelection")}
            </button>
          </li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
            <button
              className={`step-content transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                selectedSlugsSize > 0
                  ? "cursor-pointer hover:text-primary text-gray-700"
                  : "cursor-not-allowed text-gray-500 opacity-70"
              }`}
              onClick={() => selectedSlugsSize > 0 && navigateTo(2)}
              disabled={selectedSlugsSize === 0}
              aria-current={step === 2 ? "step" : undefined}
            >
              {t.t("stepAnalysis")}
            </button>
          </li>
          {hasActions && (
            <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
              <button
                className={`step-content transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                  hasAnalysisResult
                    ? "cursor-pointer hover:text-primary text-gray-700"
                    : "cursor-not-allowed text-gray-500 opacity-70"
                }`}
                onClick={() => hasAnalysisResult && navigateTo(3)}
                disabled={!hasAnalysisResult}
                aria-current={step === 3 ? "step" : undefined}
              >
                {t.t("stepActions")}
              </button>
            </li>
          )}
          <li className={`step ${step >= 4 ? "step-primary" : ""}`}>
            <button
              className={`step-content transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                hasAnalysisResult
                  ? "cursor-pointer hover:text-primary text-gray-700"
                  : "cursor-not-allowed text-gray-500 opacity-70"
              }`}
              onClick={() => hasAnalysisResult && navigateTo(4)}
              disabled={!hasAnalysisResult}
              aria-current={step === 4 ? "step" : undefined}
            >
              {t.t("stepSummary")}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
