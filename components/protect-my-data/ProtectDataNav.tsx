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
  selectedSlugsSize,
  hasAnalysisResult,
  hasActions,
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
        if (selectedSlugsSize > 0) router.push(`${basePath}/analyse`);
        break;
      case 3:
        if (hasAnalysisResult && actionsToProcess.length > 0) {
          router.push(`${basePath}/actions/${actionsToProcess[0].slug}`);
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
    <nav className="bg-base-100 border border-base-300 rounded-box shadow-sm mb-8">
      <div className="px-4 py-4">
        <ul className="steps steps-horizontal w-full">
          <li
            className={`step ${step >= 1 ? "step-primary" : ""} cursor-pointer`}
            onClick={() => navigateTo(1)}
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
            onClick={() => navigateTo(2)}
            role="button"
            tabIndex={selectedSlugsSize > 0 ? 0 : -1}
          >
            {t.t("stepAnalysis")}
          </li>
          {hasActions && (
            <li
              className={`step ${step >= 3 ? "step-primary" : ""} ${
                hasAnalysisResult
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => navigateTo(3)}
              role="button"
              tabIndex={hasAnalysisResult ? 0 : -1}
            >
              {t.t("stepActions")}
            </li>
          )}
          <li
            className={`step ${step >= 4 ? "step-primary" : ""} ${
              step === 4 ? "step-primary" : (hasAnalysisResult ? "cursor-pointer" : "cursor-not-allowed opacity-50")
            }`}
            onClick={() => hasAnalysisResult && navigateTo(4)}
            role="button"
            tabIndex={hasAnalysisResult ? 0 : -1}
          >
            {t.t("stepSummary")}
          </li>
        </ul>
      </div>
    </nav>
  );
}
