import { RefObject, useState } from "react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Trash2, X } from "lucide-react";

interface ProtectDataHeroProps {
  lang: string;
  savedNotification: boolean;
  loadedNotification: boolean;
  saveToFile: () => void;
  loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  resetAllData: () => void;
}

export default function ProtectDataHero({
  lang,
  savedNotification,
  loadedNotification,
  saveToFile,
  loadFromFile,
  fileInputRef,
  resetAllData,
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
      <h1 className="text-5xl font-bold mb-4">{t.t("title")}</h1>
      <p className="text-xl max-w-3xl mx-auto mb-6">{t.t("subtitle")}</p>

      <div className="flex justify-center gap-4 flex-wrap items-center">
        {savedNotification && (
          <span className="text-green-600 text-sm animate-pulse">
            {t.t("selectionSaved")}
          </span>
        )}
        {loadedNotification && (
          <span className="text-blue-600 text-sm animate-pulse">
            {t.t("fileLoaded")}
          </span>
        )}
        <button
          onClick={saveToFile}
          className="btn btn-outline gap-2"
          title={t.t("saveSelection")}
        >
          <span>💾</span> {t.t("saveSelection")}
        </button>
        <label
          className="btn btn-outline gap-2 cursor-pointer"
          title={t.t("loadSelection")}
        >
          <span>📂</span> {t.t("loadSelection")}
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
          className="btn btn-outline btn-error gap-2"
          title={t.t("resetData")}
        >
          <Trash2 className="w-4 h-4" /> {t.t("resetData")}
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-base-100 rounded-xl p-8 max-w-lg w-full shadow-xl text-left relative">
            <button 
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
              aria-label={t.t("resetDataCancel")}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-error flex items-center gap-2">
              <Trash2 className="w-7 h-7" />
              {t.t("resetDataTitle")}
            </h3>
            <p className="mb-8 text-base-content/80 text-lg">
              {t.t("resetDataDesc")}
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={handleBackupAndReset}
                className="btn btn-outline btn-primary"
              >
                {t.t("resetDataBackup")}
              </button>
              <button
                onClick={handleReset}
                className="btn btn-error text-white"
              >
                {t.t("resetDataConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

