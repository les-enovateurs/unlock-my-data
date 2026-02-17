import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

interface ProtectDataNavProps {
  step: number;
  setStep: (step: number) => void;
  selectedSlugsSize: number;
  hasAnalysisResult: boolean;
  goToAnalysis: () => void;
  goToDeletion: () => void;
  lang: string;
}

export default function ProtectDataNav({
  step,
  setStep,
  selectedSlugsSize,
  hasAnalysisResult,
  goToAnalysis,
  goToDeletion,
  lang,
}: ProtectDataNavProps) {
  const t = new Translator(dict, lang);

  return (
    <nav className="bg-base-100 border border-base-300 rounded-box shadow-sm mb-8">
      <div className="px-4 py-4">
        <ul className="steps steps-horizontal w-full">
          <li
            className={`step ${step >= 1 ? "step-primary" : ""} cursor-pointer`}
            onClick={() => setStep(1)}
            role="button"
            tabIndex={0}
          >
            {t.t("stepSelection")}
          </li>
          <li
            className={`step ${step >= 2 ? "step-primary" : ""} ${
              selectedSlugsSize > 0
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => selectedSlugsSize > 0 && goToAnalysis()}
            role="button"
            tabIndex={selectedSlugsSize > 0 ? 0 : -1}
          >
            {t.t("stepAnalysis")}
          </li>
          <li
            className={`step ${step >= 3 ? "step-primary" : ""} ${
              hasAnalysisResult
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => hasAnalysisResult && goToDeletion()}
            role="button"
            tabIndex={hasAnalysisResult ? 0 : -1}
          >
            {t.t("stepDeletion")}
          </li>
          <li
            className={`step ${step >= 4 ? "step-primary" : ""} ${
              step === 4 ? "" : "cursor-not-allowed opacity-50"
            }`}
          >
            {t.t("stepSummary")}
          </li>
        </ul>
      </div>
    </nav>
  );
}

