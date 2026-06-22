"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { Service } from "@/types/form";
import { createGuidePR } from "@/tools/github";
import allServices from "@/public/data/services.json";
import { getAlternatives } from "@/constants/protectData";
import {
    ArrowRight,
    CheckCircle,
    AlertCircle,
    User,
    ChevronRight,
    Trash2,
    Database,
    Zap,
    Info
} from "lucide-react";
import dynamic from "next/dynamic";
import dict from "@/i18n/MigrationForm.json";
import Image from "next/image";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
    ssr: false,
});

type GuideType = "migration" | "volume" | "clean";

// react-select styled to match the umd-* design system.
const umdSelectStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    control: (base: any) => ({
        ...base,
        minHeight: "48px",
        borderColor: "var(--slate-300)",
        borderWidth: "1.5px",
        borderRadius: "var(--umd-radius-md)",
        boxShadow: "none",
        fontSize: "15px",
        cursor: "pointer",
        ":hover": { borderColor: "var(--slate-300)" },
    }),
    placeholder: (base: any) => ({ ...base, color: "var(--slate-400)" }),
    option: (base: any, state: any) => ({
        ...base,
        cursor: "pointer",
        backgroundColor: state.isSelected ? "var(--indigo-50)" : state.isFocused ? "var(--slate-50)" : "#fff",
        color: state.isSelected ? "var(--indigo-800)" : "var(--fg1)",
    }),
};

interface GuidesFormProps {
    lang: "fr" | "en";
}

export default function GuidesForm({ lang }: GuidesFormProps) {
    const t = (dict as any)[lang] || (dict as any).fr;
    const searchParams = useSearchParams();

    const [originService, setOriginService] = useState<Service | null>(null);
    const [fullServiceData, setFullServiceData] = useState<any | null>(null);
    const [guideType, setGuideType] = useState<GuideType | null>(null);
    const [targetService, setTargetService] = useState<Service | null>(null);
    const [suggestedAlternatives, setSuggestedAlternatives] = useState<Service[]>([]);
    
    // Dual content
    const [contentFr, setContentFr] = useState("");
    const [contentEn, setContentEn] = useState("");
    
    const [author, setAuthor] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [loadingAlternatives, setLoadingAlternatives] = useState(false);
    const [loadingGuide, setLoadingGuide] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Parent group info
    const [parentGroup, setParentGroup] = useState<{ name: string, slug: string } | null>(null);

    // Helper to get guide paths
    const getPaths = (slug: string, type: GuideType, target?: Service | null, fullData?: any) => {
        if (type === "migration" && target) {
            if (fullData?.migrations) {
                const customMigration = fullData.migrations.find((m: any) => 
                    m.name.toLowerCase() === target.name.toLowerCase() || 
                    (m.slug && m.slug === target.slug)
                );
                if (customMigration) {
                    return {
                        fr: customMigration.link_fr,
                        en: customMigration.link_en
                    };
                }
            }
            return {
                fr: `/data/migrations/${slug}/${target.slug}.fr.md`,
                en: `/data/migrations/${slug}/${target.slug}.en.md`
            };
        }
        
        if (type === "volume" && fullData) {
            if (fullData.volume_guide_fr || fullData.volume_guide_en) {
                return {
                    fr: fullData.volume_guide_fr || `/data/cleanup/${slug}/volume.fr.md`,
                    en: fullData.volume_guide_en || `/data/cleanup/${slug}/volume.en.md`
                };
            }
        }
        
        if (type === "clean" && fullData) {
            if (fullData.clean_guide_fr || fullData.clean_guide_en) {
                return {
                    fr: fullData.clean_guide_fr || `/data/cleanup/${slug}/clean.fr.md`,
                    en: fullData.clean_guide_en || `/data/cleanup/${slug}/clean.en.md`
                };
            }
        }

        return {
            fr: `/data/cleanup/${slug}/${type}.fr.md`,
            en: `/data/cleanup/${slug}/${type}.en.md`
        };
    };

    // Current paths for the guides
    const currentPaths = originService && guideType 
        ? getPaths(originService.slug, guideType, targetService, fullServiceData) 
        : { fr: "", en: "" };

    // Handle search params for pre-filling
    useEffect(() => {
        const originSlug = searchParams.get("origin");
        const targetSlug = searchParams.get("target");
        const typeParam = searchParams.get("type");

        if (originSlug) {
            const origin = (allServices as unknown as Service[]).find(s => s.slug === originSlug);
            if (origin) setOriginService(origin);
        }
        if (targetSlug) {
            const target = (allServices as unknown as Service[]).find(s => s.slug === targetSlug);
            if (target) setTargetService(target);
        }
        if (typeParam) {
            setGuideType(typeParam as GuideType);
        }
    }, [searchParams]);

    // Detect parent group and fetch full service data when origin service changes
    useEffect(() => {
        if (!originService) {
            setFullServiceData(null);
            setParentGroup(null);
            return;
        }

        const fetchServiceData = async () => {
            try {
                const response = await fetch(`/data/manual/${originService.slug}.json`);
                if (response.ok) {
                    const data = await response.json();
                    setFullServiceData(data);
                    
                    if (data.belongs_to_group && data.group_name) {
                        const knownGroups = ["google", "meta", "microsoft", "apple", "amazon"];
                        const matchedGroup = knownGroups.find(g => data.group_name.toLowerCase().includes(g));
                        if (matchedGroup) {
                            setParentGroup({ name: data.group_name, slug: matchedGroup });
                        }
                    }
                }
            } catch (err) {
                console.warn("Could not load service data");
            }
        };
        fetchServiceData();
    }, [originService]);

    // Fetch alternatives when origin service changes
    useEffect(() => {
        if (!originService || guideType !== "migration") {
            setSuggestedAlternatives([]);
            return;
        }

        const fetchAlternatives = async () => {
            setLoadingAlternatives(true);
            try {
                const manualAlts = fullServiceData?.alternatives || [];
                const altSlugs = getAlternatives(originService.slug, { [originService.slug]: manualAlts });
                const alts = (allServices as unknown as Service[]).filter(s => altSlugs.includes(s.slug));
                setSuggestedAlternatives(alts);
            } catch (err) {
                console.error("Error loading alternatives", err);
            } finally {
                setLoadingAlternatives(false);
            }
        };

        fetchAlternatives();
    }, [originService, guideType, fullServiceData]);

    // Fetch existing guides (FR and EN) when parameters change
    useEffect(() => {
        if (!originService || !guideType) {
            setContentFr("");
            setContentEn("");
            return;
        }
        if (guideType === "migration" && !targetService) {
            setContentFr("");
            setContentEn("");
            return;
        }

        const fetchGuides = async () => {
            setLoadingGuide(true);
            setError("");
            
            // Important: Reset content before fetching to avoid showing stale data from previous selection
            setContentFr("");
            setContentEn("");
            
            const paths = getPaths(originService.slug, guideType, targetService, fullServiceData);

            try {
                // 1. Try to fetch the guides
                const [resFr, resEn] = await Promise.all([
                    fetch(paths.fr),
                    fetch(paths.en)
                ]);
                
                let frOk = resFr.ok;
                let enOk = resEn.ok;
                let finalFr = frOk ? await resFr.text() : "";
                let finalEn = enOk ? await resEn.text() : "";

                // 2. If BOTH guides missing and parent exists, attempt fallback (Cleanup only)
                if (guideType !== "migration" && parentGroup && !frOk && !enOk) {
                    const parentPaths = {
                        fr: `/data/cleanup/${parentGroup.slug}/${guideType}.fr.md`,
                        en: `/data/cleanup/${parentGroup.slug}/${guideType}.en.md`
                    };
                    const [pResFr, pResEn] = await Promise.all([
                        fetch(parentPaths.fr),
                        fetch(parentPaths.en)
                    ]);

                    if (pResFr.ok || pResEn.ok) {
                        // Switch to parent service automatically
                        const groupService = (allServices as unknown as Service[]).find(s => s.slug === parentGroup.slug);
                        if (groupService) {
                            setOriginService(groupService);
                            return; // The useEffect will re-run with the parent service
                        }
                    }
                }
                
                setContentFr(finalFr);
                setContentEn(finalEn);
            } catch (err) {
                console.error("Error loading guides", err);
                setContentFr("");
                setContentEn("");
            } finally {
                setLoadingGuide(false);
            }
        };

        fetchGuides();
    }, [originService, guideType, targetService, parentGroup, fullServiceData]);

    const handleConfirmSubmit = async () => {
        setLoading(true);
        setShowConfirmModal(false);
        setError("");
        setSuccess("");

        try {
            const titleFr = `Guide ${guideType}: ${originService?.name}${targetService ? ` to ${targetService.name}` : ''} (FR)`;
            const titleEn = `Guide ${guideType}: ${originService?.name}${targetService ? ` to ${targetService.name}` : ''} (EN)`;
            
            const paths = getPaths(originService!.slug, guideType!, targetService, fullServiceData);

            // Submit FR if content changed
            const prs = [];
            if (contentFr) {
                prs.push(createGuidePR(
                    author,
                    originService!.slug,
                    guideType!,
                    "fr",
                    contentFr,
                    titleFr,
                    `Update FR guide for ${originService?.name}`,
                    targetService?.slug,
                    paths.fr
                ));
            }
            
            // Submit EN if content changed
            if (contentEn) {
                prs.push(createGuidePR(
                    author,
                    originService!.slug,
                    guideType!,
                    "en",
                    contentEn,
                    titleEn,
                    `Update EN guide for ${originService?.name}`,
                    targetService?.slug,
                    paths.en
                ));
            }

            const urls = await Promise.all(prs);
            setSuccess(`${t.success} ${urls.join(", ")}`);
            setContentFr("");
            setContentEn("");
            } catch (err: any) {
            setError(err.message || t.error);
            } finally {
            setLoading(false);
            }
            };

    const serviceOptionLabel = (option: Service) => (
        <div className="flex items-center gap-3 cursor-pointer">
            {option.logo && (
                <div className="relative w-6 h-6 shrink-0">
                    <Image src={option.logo} alt={option.name} fill className="object-contain" />
                </div>
            )}
            <span className="font-medium">{option.name}</span>
        </div>
    );

    const guideTypes = [
        { id: "migration", icon: ArrowRight, title: t.guideTypeMigration, desc: t.guideTypeMigrationDesc, bg: "var(--indigo-50)", color: "var(--indigo-700)" },
        { id: "volume", icon: Database, title: t.guideTypeVolume, desc: t.guideTypeVolumeDesc, bg: "var(--amber-50)", color: "#9a6a00" },
        { id: "clean", icon: Trash2, title: t.guideTypeClean, desc: t.guideTypeCleanDesc, bg: "var(--red-50)", color: "var(--red-600)" }
    ];

    const loadingText = lang === "fr" ? "Chargement…" : "Loading…";

    const StepHead = ({ n, children }: { n: React.ReactNode; children: React.ReactNode }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--indigo-800)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{n}</span>
            <span className="umd-heading-3" style={{ fontSize: 20 }}>{children}</span>
        </div>
    );

    return (
        <div>
            {/* Hero */}
            <section style={{ background: "linear-gradient(180deg, var(--indigo-50), #fff)", borderBottom: "1px solid var(--slate-200)" }}>
                <div className="umd-wrap" style={{ maxWidth: 980, padding: "36px 24px 32px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 46, height: 46, borderRadius: "var(--umd-radius-md)", background: "var(--indigo-50)", border: "1px solid var(--indigo-200)", color: "var(--indigo-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Zap style={{ width: 22, height: 22 }} />
                    </span>
                    <div>
                        <h1 className="umd-heading-3" style={{ marginBottom: 4 }}>{t.title}</h1>
                        <p style={{ margin: 0, fontSize: 14.5, color: "var(--fg2)" }}>{t.description}</p>
                    </div>
                </div>
            </section>

            <div className="umd-wrap" style={{ maxWidth: 980, padding: "28px 24px 80px" }}>
                <div className="umd-card" style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 32 }}>
                    {error && (
                        <div role="alert" className="umd-alert umd-alert-danger">
                            <span className="umd-alert-ic"><AlertCircle /></span>
                            <p className="umd-alert-desc">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div role="alert" className="umd-alert umd-alert-safe">
                            <span className="umd-alert-ic"><CheckCircle /></span>
                            <p className="umd-alert-desc">{success}</p>
                        </div>
                    )}

                    {/* Step 1: Select Service */}
                    <section>
                        <StepHead n="1">{t.selectServiceTitle}</StepHead>
                        <Select
                            options={allServices as unknown as Service[]}
                            value={originService}
                            onChange={(s) => {
                                setOriginService(s);
                                setGuideType(null);
                                setTargetService(null);
                            }}
                            placeholder={t.selectServicePlaceholder}
                            isClearable
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.slug}
                            formatOptionLabel={serviceOptionLabel}
                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                            styles={umdSelectStyles}
                        />
                    </section>

                    {/* Step 2: Select Guide Type */}
                    {originService && (
                        <section>
                            <StepHead n="2">{t.selectGuideTypeTitle}</StepHead>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                                {guideTypes.map((type) => {
                                    const on = guideType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setGuideType(type.id as GuideType);
                                                setTargetService(null);
                                            }}
                                            style={{
                                                display: "flex", flexDirection: "column", alignItems: "flex-start",
                                                padding: 20, borderRadius: "var(--umd-radius-lg)",
                                                border: `1.5px solid ${on ? "var(--indigo-500)" : "var(--slate-200)"}`,
                                                background: on ? "var(--indigo-50)" : "#fff",
                                                textAlign: "left", cursor: "pointer",
                                            }}
                                        >
                                            <span style={{ padding: 12, borderRadius: "var(--umd-radius-md)", background: type.bg, color: type.color, marginBottom: 14, display: "inline-flex" }}>
                                                <type.icon style={{ width: 24, height: 24 }} />
                                            </span>
                                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 4 }}>{type.title}</h3>
                                            <p style={{ fontSize: 13.5, color: "var(--fg3)", lineHeight: 1.5, margin: 0 }}>{type.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Step 3: Target Service (Migration only) */}
                    {originService && guideType === "migration" && (
                        <section>
                            <StepHead n="3">{t.targetServiceTitle}</StepHead>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                                <div>
                                    <Select
                                        options={allServices as unknown as Service[]}
                                        value={targetService}
                                        onChange={setTargetService}
                                        placeholder={t.targetServicePlaceholder}
                                        isClearable
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.slug}
                                        formatOptionLabel={serviceOptionLabel}
                                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                        styles={umdSelectStyles}
                                    />
                                </div>
                                {!targetService && (
                                    <div style={{ padding: 20, background: "var(--slate-50)", borderRadius: "var(--umd-radius-lg)", border: "1px solid var(--slate-200)" }}>
                                        <h4 className="umd-divider-label" style={{ margin: "0 0 12px" }}>
                                            <Info style={{ width: 13, height: 13 }} />
                                            {t.suggestedAlternatives.replace("{service}", originService.name)}
                                        </h4>
                                        {loadingAlternatives ? (
                                            <p style={{ fontSize: 14, color: "var(--fg3)", margin: 0 }}>{loadingText}</p>
                                        ) : (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                {suggestedAlternatives.map(alt => (
                                                    <button
                                                        key={alt.slug}
                                                        type="button"
                                                        onClick={() => setTargetService(alt)}
                                                        className="umd-btn umd-btn-outline umd-btn-sm"
                                                    >
                                                        {alt.name}
                                                        <ChevronRight style={{ width: 14, height: 14 }} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Dual Language Editor */}
                    {originService && guideType && (guideType !== "migration" || targetService) && (
                        <section style={{ borderTop: "1px solid var(--slate-100)", paddingTop: 24 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                                <StepHead n={guideType === "migration" ? "4" : "3"}>{t.editorTitle}</StepHead>
                                <div style={{ minWidth: 240 }}>
                                    <label className="umd-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <User style={{ width: 14, height: 14 }} />
                                        {t.author}
                                    </label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="umd-input"
                                        placeholder={t.authorPlaceholder}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
                                {/* French Editor */}
                                <div>
                                    <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--fg1)", marginBottom: 10 }}>
                                        <span style={{ background: "var(--slate-100)", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>FR</span>
                                        {t.french}
                                    </h3>
                                    <div style={{ position: "relative", border: "1px solid var(--slate-200)", borderRadius: "var(--umd-radius-md)", overflow: "hidden" }}>
                                        {loadingGuide && (
                                            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.7)", fontSize: 14, color: "var(--fg2)" }}>{loadingText}</div>
                                        )}
                                        <MarkdownEditor
                                            key={`fr-${currentPaths.fr}-${loadingGuide}`}
                                            value={contentFr}
                                            onChange={setContentFr}
                                            placeholder={t.guidePlaceholder}
                                            showCounter
                                            maxLength={8000}
                                        />
                                    </div>
                                    {!contentFr && !loadingGuide && (
                                        <div className="umd-alert umd-alert-info" style={{ marginTop: 12, padding: "10px 14px" }}>
                                            <span className="umd-alert-ic" style={{ width: 28, height: 28 }}><Info /></span>
                                            <p className="umd-alert-desc">{t.noGuideYet.replace("{lang}", t.french)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* English Editor */}
                                <div>
                                    <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--fg1)", marginBottom: 10 }}>
                                        <span style={{ background: "var(--slate-100)", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>EN</span>
                                        {t.english}
                                    </h3>
                                    <div style={{ position: "relative", border: "1px solid var(--slate-200)", borderRadius: "var(--umd-radius-md)", overflow: "hidden" }}>
                                        {loadingGuide && (
                                            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.7)", fontSize: 14, color: "var(--fg2)" }}>{loadingText}</div>
                                        )}
                                        <MarkdownEditor
                                            key={`en-${currentPaths.en}-${loadingGuide}`}
                                            value={contentEn}
                                            onChange={setContentEn}
                                            placeholder={t.guidePlaceholder}
                                            showCounter
                                            maxLength={8000}
                                        />
                                    </div>
                                    {!contentEn && !loadingGuide && (
                                        <div className="umd-alert umd-alert-info" style={{ marginTop: 12, padding: "10px 14px" }}>
                                            <span className="umd-alert-ic" style={{ width: 28, height: 28 }}><Info /></span>
                                            <p className="umd-alert-desc">{t.noGuideYet.replace("{lang}", t.english)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmModal(true)}
                                    className="umd-btn umd-btn-primary umd-btn-lg"
                                    disabled={(!contentFr && !contentEn) || !author || loading}
                                    style={{ opacity: ((!contentFr && !contentEn) || !author || loading) ? 0.6 : 1, cursor: ((!contentFr && !contentEn) || !author || loading) ? "not-allowed" : "pointer" }}
                                >
                                    {loading ? t.submitting : t.submit}
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div onClick={() => setShowConfirmModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.45)", cursor: "pointer" }} />
                    <div className="umd-card" style={{ position: "relative", maxWidth: 420, width: "100%", padding: "24px 26px" }}>
                        <h3 className="umd-heading-3" style={{ fontSize: 20, marginBottom: 8 }}>{t.modalTitle}</h3>
                        <p style={{ color: "var(--fg2)", lineHeight: 1.6, margin: "0 0 20px" }}>{t.modalDescription}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button className="umd-btn umd-btn-ghost" onClick={() => setShowConfirmModal(false)}>
                                {t.cancel}
                            </button>
                            <button className="umd-btn umd-btn-primary" onClick={handleConfirmSubmit}>
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
