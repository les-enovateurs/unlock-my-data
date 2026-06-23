import { RefObject, useState } from "react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Trash2, X, Download, Upload } from "lucide-react";

interface ProtectDataHeroProps {
  lang: string;
  savedNotification: boolean;
  loadedNotification: boolean;
  saveToFile: () => void;
  loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  resetAllData: () => void;
  /** Override the H1 (defaults to t("title")). */
  titleOverride?: string;
  /** Override the subtitle line (defaults to t("subtitle")). */
  subtitleOverride?: string;
  /** Show the save / load / reset toolbar. Defaults to true. */
  showDataTools?: boolean;
}

export default function ProtectDataHero({
  lang,
  savedNotification,
  loadedNotification,
  saveToFile,
  loadFromFile,
  fileInputRef,
  resetAllData,
  titleOverride,
  subtitleOverride,
  showDataTools = true,
}: ProtectDataHeroProps) {
  const t = new Translator(dict, lang);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowResetModal(false);
  };

  const handleBackupAndReset = () => {
    saveToFile();
    resetAllData();
    setShowResetModal(false);
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold mb-4">{titleOverride ?? t.t("title")}</h1>
      <p className="text-xl max-w-3xl mx-auto mb-6">
        {subtitleOverride ?? t.t("subtitle")}
      </p>

      {showDataTools && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(savedNotification || loadedNotification) && (
            <span className="text-xs font-medium text-umd-green-700 animate-pulse">
              {savedNotification ? t.t("selectionSaved") : t.t("fileLoaded")}
            </span>
          )}
          <button
            onClick={saveToFile}
            className="inline-flex items-center gap-1.5 rounded-full border border-umd-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-umd-slate-600 transition-colors hover:border-umd-indigo-300 hover:text-umd-indigo-700"
            title={t.t("saveSelection")}
          >
            <Download className="h-3.5 w-3.5" />
            {t.t("saveSelection")}
          </button>
          <label
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-umd-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-umd-slate-600 transition-colors hover:border-umd-indigo-300 hover:text-umd-indigo-700"
            title={t.t("loadSelection")}
          >
            <Upload className="h-3.5 w-3.5" />
            {t.t("loadSelection")}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={loadFromFile}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-umd-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-umd-slate-500 transition-colors hover:border-umd-red-200 hover:text-umd-red-700"
            title={t.t("resetData")}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.t("resetData")}
          </button>
        </div>
      )}

      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-umd-indigo-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-umd-slate-200 bg-white p-7 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-umd-slate-400 transition-colors hover:bg-umd-slate-100 hover:text-umd-slate-700"
              aria-label={t.t("resetDataCancel")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-umd-red-50 text-umd-red-700">
                <Trash2 className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl font-bold text-umd-indigo-900">
                {t.t("resetDataTitle")}
              </h3>
            </div>

            <p className="mb-7 text-[15px] leading-relaxed text-umd-slate-600">
              {t.t("resetDataDesc")}
            </p>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-umd-slate-600 transition-colors hover:bg-umd-slate-100"
              >
                {t.t("resetDataCancel")}
              </button>
              <button
                onClick={handleBackupAndReset}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-umd-indigo-200 bg-white px-5 py-2.5 text-sm font-bold text-umd-indigo-700 transition-colors hover:bg-umd-indigo-50"
              >
                <Download className="h-4 w-4" />
                {t.t("resetDataBackup")}
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-umd-red-600 px-5 py-2.5 text-sm font-display font-bold text-white transition-colors hover:bg-umd-red-700"
              >
                <Trash2 className="h-4 w-4" />
                {t.t("resetDataConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

