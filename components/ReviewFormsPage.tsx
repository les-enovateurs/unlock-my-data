"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Eye, EyeOff, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";

interface ReviewItem {
  field: string;
  message: string;
  reviewer?: string;
  timestamp?: string;
}

interface ReviewService {
  slug: string;
  name: string;
  logo?: string;
  status: "draft" | "changes_requested" | "published";
  created_at: string;
  created_by: string;
  review?: ReviewItem[];
}

interface ReviewFormsPageProps {
  lang: "fr" | "en";
  contributePath: string;
}

export default function ReviewFormsPage({ lang, contributePath }: ReviewFormsPageProps) {
  const t = new Translator(dict as any, lang);
  const [services, setServices] = useState<ReviewService[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      // For a static site, we would need to generate a JSON file at build time
      // containing all the draft and changes_requested services.
      const response = await fetch("/data/reviews.json").catch(() => null);
      if (response?.ok) {
        const data = await response.json();
        setServices(data.filter((s: ReviewService) => s.status === "draft" || s.status === "changes_requested"));
      } else {
        setServices([]);
      }
    } catch (err) {
      console.warn("Could not load reviews:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReview = (slug: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const getStatusBadgeClass = (status: "draft" | "changes_requested" | "published") => {
    return status === "draft" ? "badge-warning" : "badge-info";
  };

  const getStatusLabel = (status: "draft" | "changes_requested" | "published") => {
    const statusMap = {
      draft: t.t("statusDraft"),
      changes_requested: t.t("statusChangesRequested"),
      published: t.t("statusPublished")
    };
    return statusMap[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t.t("title")}</h1>
          <p className="text-lg text-base-content/70">
            {t.t("description")}
          </p>
        </div>

        <div className="alert alert-info mb-8">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">{t.t("howItWorks")}</h3>
            <div className="text-sm mt-2">
              {t.t("howItWorksDesc")}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : services.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body text-center py-12">
              <Eye className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.t("noDrafts")}</h3>
              <p className="text-base-content/70 mb-6">
                {t.t("noDraftsDesc")}
              </p>
              <p className="text-sm text-base-content/60 mb-4 italic">
                {t.t("githubNote")}
              </p>
              <Link href={contributePath} className="btn btn-primary">
                {t.t("contribute")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.slug} className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {service.logo && (
                        <Image
                          src={service.logo}
                          alt={service.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold">{service.name}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`badge ${getStatusBadgeClass(service.status)}`}>
                            {getStatusLabel(service.status)}
                          </span>
                          <span className="badge badge-ghost flex gap-1 items-center">
                            <User className="w-3 h-3" />
                            {service.created_by || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleReview(service.slug)}
                      className="btn btn-sm btn-ghost"
                    >
                      {expandedReviews.has(service.slug) ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {expandedReviews.has(service.slug) && (
                    <div className="mt-6 pt-6 border-t border-base-300 space-y-4">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                          <MessageSquare className="w-4 h-4" />
                          {t.t("moderatorComments")}
                        </h4>
                        {service.review && service.review.length > 0 ? (
                          <div className="space-y-3">
                            {service.review.map((review, idx) => (
                              <div key={idx} className="bg-base-200 p-4 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-semibold text-sm">{review.reviewer || "Moderator"}</div>
                                    <div className="text-xs text-base-content/60">
                                      {t.t("field")}: <code className="bg-base-300 px-1 rounded">{review.field}</code>
                                    </div>
                                  </div>
                                  <div className="text-xs text-base-content/50">
                                    {review.timestamp ? formatDate(review.timestamp) : ""}
                                  </div>
                                </div>
                                <p className="text-sm">{review.message}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-base-content/60 italic">
                            {t.t("noComments")}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-base-300">
                        <h4 className="font-bold mb-3">{t.t("publicationInfo")}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-base-content/60">{t.t("createdDate")}</div>
                            <div className="font-semibold">
                              {service.created_at ? formatDate(service.created_at) : "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="text-base-content/60">{t.t("author")}</div>
                            <div className="font-semibold">{service.created_by || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
