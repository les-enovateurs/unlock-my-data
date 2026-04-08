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
    Loader2,
    Trash2,
    Database,
    Zap,
    Info,
    Search
} from "lucide-react";
import dynamic from "next/dynamic";
import dict from "@/i18n/MigrationForm.json";
import Image from "next/image";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
    ssr: false,
});

type GuideType = "migration" | "volume" | "clean";

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
        { id: "migration", icon: ArrowRight, title: t.guideTypeMigration, desc: t.guideTypeMigrationDesc, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "volume", icon: Database, title: t.guideTypeVolume, desc: t.guideTypeVolumeDesc, color: "text-amber-600", bg: "bg-amber-50" },
        { id: "clean", icon: Trash2, title: t.guideTypeClean, desc: t.guideTypeCleanDesc, color: "text-rose-600", bg: "bg-rose-50" }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 text-[#020617]">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-[#0F172A]/10 rounded-full mb-6 shadow-sm">
                        <Zap className="w-10 h-10 text-[#0F172A]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0F172A] to-[#0369A1]">
                        {t.title}
                    </h1>
                    <p className="text-lg text-[#334155]/70 max-w-2xl mx-auto leading-relaxed">
                        {t.description}
                    </p>
                </div>

                <div className="card bg-white shadow-xl border border-[#E2E8F0]">
                    <div className="card-body p-6 md:p-8 space-y-10">
                        {error && (
                            <div role="alert" className="alert alert-error shadow-md">
                                <AlertCircle className="w-6 h-6" />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div role="alert" className="alert alert-success shadow-md">
                                <CheckCircle className="w-6 h-6" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Step 1: Select Service */}
                        <section className="space-y-4">
                            <label className="text-xl font-bold flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F172A] text-white text-sm">1</span>
                                {t.selectServiceTitle}
                            </label>
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
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    control: (base) => ({ ...base, borderColor: "#E2E8F0", borderRadius: "0.5rem", padding: "2px", cursor: "pointer" }),
                                    option: (base) => ({ ...base, cursor: "pointer" })
                                }}
                            />
                        </section>

                        {/* Step 2: Select Guide Type */}
                        {originService && (
                            <section className="space-y-4 animate-fadeIn">
                                <label className="text-xl font-bold flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F172A] text-white text-sm">2</span>
                                    {t.selectGuideTypeTitle}
                                </label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {guideTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setGuideType(type.id as GuideType);
                                                setTargetService(null);
                                            }}
                                            className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left group cursor-pointer ${
                                                guideType === type.id 
                                                ? "border-[#0F172A] bg-[#0F172A]/5 shadow-sm" 
                                                : "border-[#E2E8F0] hover:border-[#334155]/30 hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className={`p-3 rounded-lg mb-4 ${type.bg} ${type.color}`}>
                                                <type.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                                            <p className="text-sm text-[#334155]/70 leading-snug">{type.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Step 3: Target Service (Migration only) */}
                        {originService && guideType === "migration" && (
                            <section className="space-y-4 animate-fadeIn">
                                <label className="text-xl font-bold flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F172A] text-white text-sm">3</span>
                                    {t.targetServiceTitle}
                                </label>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
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
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                control: (base) => ({ ...base, borderColor: "#E2E8F0", borderRadius: "0.5rem", padding: "2px", cursor: "pointer" }),
                                                option: (base) => ({ ...base, cursor: "pointer" })
                                            }}
                                        />
                                    </div>
                                    {!targetService && (
                                        <div className="p-5 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#334155]/60 flex items-center gap-2">
                                                <Info className="w-3 h-3" />
                                                {t.suggestedAlternatives.replace("{service}", originService.name)}
                                            </h4>
                                            {loadingAlternatives ? (
                                                <div className="flex items-center gap-2 text-[#334155]/50 text-sm">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Chargement...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {suggestedAlternatives.map(alt => (
                                                        <button
                                                            key={alt.slug}
                                                            type="button"
                                                            onClick={() => setTargetService(alt)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full hover:border-[#0369A1] hover:bg-blue-50 transition-all text-sm group cursor-pointer"
                                                        >
                                                            <span className="font-medium">{alt.name}</span>
                                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
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
                            <section className="space-y-8 animate-fadeIn pt-4 border-t border-slate-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <label className="text-xl font-bold flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F172A] text-white text-sm">
                                            {guideType === "migration" ? "4" : "3"}
                                        </span>
                                        {t.editorTitle}
                                    </label>
                                    
                                    <div className="form-control">
                                        <label className="label py-0">
                                            <span className="label-text font-bold text-[#334155] flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                {t.author}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="input input-bordered input-sm w-full max-w-xs focus:ring-2 focus:ring-[#0F172A]/20 transition-all"
                                            placeholder={t.authorPlaceholder}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* French Editor */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold flex items-center gap-2 text-[#0F172A]">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">FR</span>
                                            {t.french}
                                        </h3>
                                        <div className="relative group border border-[#E2E8F0] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0F172A]/20 transition-all shadow-sm">
                                            {loadingGuide && (
                                                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                                                    <Loader2 className="w-10 h-10 animate-spin text-[#0F172A]" />
                                                </div>
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
                                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100/50 rounded-lg text-blue-800 text-xs">
                                                <Info className="w-3.5 h-3.5" />
                                                <span>{t.noGuideYet.replace("{lang}", t.french)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* English Editor */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold flex items-center gap-2 text-[#0F172A]">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">EN</span>
                                            {t.english}
                                        </h3>
                                        <div className="relative group border border-[#E2E8F0] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0F172A]/20 transition-all shadow-sm">
                                            {loadingGuide && (
                                                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                                                    <Loader2 className="w-10 h-10 animate-spin text-[#0F172A]" />
                                                </div>
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
                                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100/50 rounded-lg text-blue-800 text-xs">
                                                <Info className="w-3.5 h-3.5" />
                                                <span>{t.noGuideYet.replace("{lang}", t.english)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmModal(true)}
                                        className={`btn text-white bg-[#0369A1] hover:bg-[#025a87] border-none px-10 shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${loading ? "loading" : ""}`}
                                        disabled={(!contentFr && !contentEn) || !author || loading}
                                    >
                                        {loading ? t.submitting : t.submit}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal modal-open animate-fadeIn">
                    <div className="modal-box bg-white border border-[#E2E8F0] max-w-md">
                        <h3 className="font-bold text-xl text-[#0F172A] mb-2">{t.modalTitle}</h3>
                        <p className="py-4 text-[#334155] leading-relaxed">{t.modalDescription}</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost hover:bg-slate-100 cursor-pointer" onClick={() => setShowConfirmModal(false)}>
                                {t.cancel}
                            </button>
                            <button className="btn text-white bg-[#0369A1] hover:bg-[#025a87] border-none px-6 cursor-pointer" onClick={handleConfirmSubmit}>
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-[#0F172A]/40 backdrop-blur-sm cursor-pointer" onClick={() => setShowConfirmModal(false)}></div>
                </div>
            )}
        </div>
    );
}
