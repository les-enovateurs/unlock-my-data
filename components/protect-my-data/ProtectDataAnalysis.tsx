import {
  ShieldAlert,
  Eye,
  Trash2,
  AlertTriangle,
  Zap,
  Server,
  ArrowRight,
  ChevronLeft,
  Map,
  RefreshCw,
  Shield,
} from "lucide-react";
import DataTransferMap from "../DataTransferMap";
import { getScoreColor, getScoreBg } from "../helpers";
import { AnalysisResult, Service } from "@/constants/protectData";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

interface ProtectDataAnalysisProps {
  lang: string;
  analyzing: boolean;
  analysisResult: AnalysisResult | null;
  selectedSlugsSize: number;
  setStep: (step: number) => void;
  selectedServices: Service[];
  showDataMap: boolean;
  setShowDataMap: (show: boolean) => void;
  goToDeletion: () => void;
  handleActionClick: (action: AnalysisResult["actions"][0]) => void;
}

export default function ProtectDataAnalysis({
  lang,
  analyzing,
  analysisResult,
  selectedSlugsSize,
  setStep,
  selectedServices,
  showDataMap,
  setShowDataMap,
  goToDeletion,
  handleActionClick,
}: ProtectDataAnalysisProps) {
  const t = new Translator(dict, lang);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setStep(1)} className="btn btn-ghost gap-2">
        <ChevronLeft className="w-4 h-4" />
        {t.t("backToSelection")}
      </button>

      {analyzing ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center py-16">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="card-title">{t.t("calculating")}</h2>
            <p className="text-base-content/70">
              {selectedSlugsSize} {t.t("servicesAnalyzed")}
            </p>
          </div>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6">
          {/* Data Transfer Map */}
          {showDataMap && (
            <DataTransferMap lang={lang} selectedServices={selectedServices} />
          )}

          {/* Toggle Map Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowDataMap(!showDataMap)}
              className="btn btn-sm btn-ghost gap-2"
            >
              <Map className="w-4 h-4" />
              {showDataMap ? t.t("hideDataMap") : t.t("showDataMap")}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Score & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Score Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <h3 className="text-sm text-base-content/70 mb-4">
                    {t.t("yourScore")}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`text-7xl font-bold ${getScoreColor(
                        analysisResult.score
                      )}`}
                    >
                      {analysisResult.score}
                    </div>
                    <span className="text-2xl text-base-content/50 ml-1">
                      /100
                    </span>
                  </div>
                  <div
                    className={`py-2 px-4 rounded-lg bg-linear-to-r ${getScoreBg(
                      analysisResult.score
                    )}`}
                  >
                    <span className="font-bold text-white">
                      {t.t("riskLevel")}: {analysisResult.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <Eye className="w-5 h-5 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {analysisResult.totalTrackers}
                    </div>
                    <div className="text-xs text-base-content/70 mt-1">
                      {t.t("trackers")}
                    </div>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {analysisResult.breachCount}
                    </div>
                    <div className="text-xs text-base-content/70 mt-1">
                      {t.t("dataBreaches")}
                    </div>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <ShieldAlert className="w-5 h-5 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {analysisResult.sanctionCount}
                    </div>
                    <div className="text-xs text-base-content/70 mt-1">
                      {t.t("cnilSanctions")}
                    </div>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <Server className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {analysisResult.outsideEUCount}
                    </div>
                    <div className="text-xs text-base-content/70 mt-1">
                      {t.t("outsideEU")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue to Delete Button */}
              <button
                onClick={goToDeletion}
                className="btn btn-error btn-block gap-2 text-white"
              >
                <Trash2 className="w-5 h-5" />
                {t.t("continueToDelete")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Worst Services */}
              {analysisResult.worstServices.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-lg gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      {t.t("worstServices")}
                    </h3>
                    <div className="space-y-3 mt-4">
                      {analysisResult.worstServices.map((service) => (
                        <div
                          key={service.slug}
                          className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-base-content/70">
                              {service.reasons.join(" • ")}
                            </div>
                          </div>
                          <div
                            className={`text-2xl font-bold ${getScoreColor(
                              service.score
                            )}`}
                          >
                            {service.score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Plan */}
              {analysisResult.actions.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-lg gap-2">
                      <Zap className="w-5 h-5 text-green-500" />
                      {t.t("actionPlan")}
                    </h3>
                    <div className="space-y-3 mt-4">
                      {analysisResult.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
                          onClick={() => handleActionClick(action)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{action.service}</span>
                            <span
                              className={`badge ${
                                action.priority === "urgent"
                                  ? "badge-error text-white"
                                  : action.priority === "recommended"
                                  ? "badge-warning"
                                  : "badge-ghost"
                              }`}
                            >
                              {t.t(action.priority)}
                            </span>
                          </div>
                          <div className="text-sm text-blue-800 font-medium mb-1 flex items-center gap-2">
                            {action.type === "find_alternative" && (
                              <RefreshCw className="w-4 h-4" />
                            )}
                            {action.type === "delete_account" && (
                              <Trash2 className="w-4 h-4" />
                            )}
                            {action.type === "change_password" && (
                              <Shield className="w-4 h-4" />
                            )}
                            <span>{action.action}</span>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </div>
                          <div className="text-sm text-base-content/70">
                            {action.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

