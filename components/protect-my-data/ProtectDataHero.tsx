import { RefObject } from "react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

interface ProtectDataHeroProps {
  lang: string;
  savedNotification: boolean;
  loadedNotification: boolean;
  saveToFile: () => void;
  loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export default function ProtectDataHero({
  lang,
  savedNotification,
  loadedNotification,
  saveToFile,
  loadFromFile,
  fileInputRef,
}: ProtectDataHeroProps) {
  const t = new Translator(dict, lang);

  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold mb-4">{t.t("title")}</h1>
      <p className="text-xl max-w-3xl mx-auto mb-6">{t.t("subtitle")}</p>

      <div className="flex justify-center gap-4 flex-wrap">
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
      </div>
    </div>
  );
}

