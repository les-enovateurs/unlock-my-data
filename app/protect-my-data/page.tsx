"use client";

import { useState } from "react";
import dict from "@/i18n/ProtectMyData.json";
import Translator from "@/components/tools/t";
import { useProtectData } from "@/context/ProtectDataContext";
import ProtectDataHero from "@/components/protect-my-data/ProtectDataHero";
import ProtectEasy from "@/components/protect-my-data/ProtectEasy";
import ProtectAdvanced from "@/components/protect-my-data/ProtectAdvanced";
import ProtectModeTabs, { ProtectMode } from "@/components/protect-my-data/ProtectModeTabs";
import { Shield } from "lucide-react";

export default function SelectionPage() {
  const [mode, setMode] = useState<ProtectMode>("easy");
  const {
    lang,
    loading,
    saveToFile,
    loadFromFile,
    fileInputRef,
    resetAllData,
    savedNotification,
    loadedNotification,
  } = useProtectData();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-12">
        <ProtectDataHero
          lang={lang}
          savedNotification={savedNotification}
          loadedNotification={loadedNotification}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          fileInputRef={fileInputRef}
          resetAllData={resetAllData}
          titleOverride={new Translator(dict, lang).t("heroH1")}
          subtitleOverride={new Translator(dict, lang).t("heroLead")}
          showDataTools={mode === "advanced"}
        />

        <div className="mb-8 max-w-3xl mx-auto">
          <ProtectModeTabs lang={lang} mode={mode} setMode={setMode} />
        </div>

        <div className="max-w-5xl mx-auto">
          {mode === "easy" ? (
            <ProtectEasy lang={lang} onSwitchAdvanced={() => setMode("advanced")} />
          ) : (
            <ProtectAdvanced lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
}
