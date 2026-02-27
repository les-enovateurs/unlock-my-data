"use client";
import { useState } from "react";
import Select, { components } from "react-select";
import { Service, Leak } from "@/types/form";
import { createGitHubPR } from "@/tools/github";
import services from "../public/data/services.json";
import { AlertTriangle, Upload, Calendar, FileText, User, CheckCircle, AlertCircle, Info } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/LeakForm.json";

interface LeakFormProps {
    lang: "fr" | "en";
}

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export default function LeakForm({ lang }: LeakFormProps) {
    const t = new Translator(dict as any, lang);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isNewService, setIsNewService] = useState(false);
    const [newServiceName, setNewServiceName] = useState("");
    const [formData, setFormData] = useState<Partial<Leak>>({});
    // local state for optional media link (keeps types simple)
    const [mediaLink, setMediaLink] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    const serviceOptions = (services as unknown as Service[]).map(s => ({
        value: s.slug,
        label: s.name,
        service: s
    }));

    const existingServiceMatch = isNewService && newServiceName.trim().length > 1
        ? (services as unknown as Service[]).find(s =>
            s.name.toLowerCase() === newServiceName.trim().toLowerCase() ||
            s.slug === newServiceName.trim().toLowerCase()
        )
        : null;

    const handleServiceSelect = async (option: any) => {
        setSelectedService(option ? option.service : null);
        setIsNewService(false);
        setNewServiceName("");
        setSuccess("");
        setError("");

        if (option) {
            setLoading(true);
            try {
                const response = await fetch(`/data/manual/${option.service.slug}.json`);
                if (response.ok) {
                    await response.json();
                }
            } catch (e) {
                console.error("Error loading service data", e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError(t.t('invalidFileType'));
                return;
            }
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isNewService && !selectedService) {
            setError(t.t('error'));
            return;
        }

        if (isNewService && !newServiceName.trim()) {
            setError(t.t('error'));
            return;
        }

        if (!proofFile || !formData.date || !formData.type) {
            setError(t.t('error')); // Basic validation
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let currentSlug = "";
            let currentServiceName = "";
            let serviceData: any = {};
            let isUpdate = true;

            // Read file as base64 (without prefix)
            const base64Content = proofPreview?.split(',')[1];
            if (!base64Content) throw new Error("File reading error");

            if (isNewService) {
                currentSlug = slugify(newServiceName);
                currentServiceName = newServiceName;
                isUpdate = false;

                // Check if likely exists
                const existing = serviceOptions.find(o => o.value === currentSlug);
                if (existing) {
                    setError("This service seems to exist already. Please search for it.");
                    setLoading(false);
                    return;
                }

                serviceData = {
                    slug: currentSlug,
                    name: currentServiceName,
                    url: "",
                    leaks: []
                };
            } else if (selectedService) {
                currentSlug = selectedService.slug;
                currentServiceName = selectedService.name;

                // Prepare updated service data
                const response = await fetch(`/data/manual/${currentSlug}.json`);
                if (!response.ok) throw new Error("Service data not found");
                serviceData = await response.json();
            }

            const proofFileName = `proof-${currentSlug}-${Date.now()}.${proofFile.name.split('.').pop()}`;
            const proofPath = `public/proofs/${proofFileName}`;
            const proofUrl = `/proofs/${proofFileName}`;

            const newLeak: Leak = {
                date: formData.date,
                type: formData.type,
                type_en: formData.type_en || "",
                proof_url: proofUrl,
                contributor: formData.contributor || "Anonymous",
                // include optional media link when provided
                ...(mediaLink ? { media_link: mediaLink } : {})
            };

            const updatedServiceData = {
                ...serviceData,
                leaks: [...(serviceData.leaks || []), newLeak]
            };

            const serviceContent = JSON.stringify(updatedServiceData, null, 2);

            const prUrl = await createGitHubPR(
                updatedServiceData,
                `${currentSlug}.json`,
                serviceContent,
                `Report leak for ${currentServiceName}`,
                `Reporting a leak for ${currentServiceName}${isNewService ? ' (New Service)' : ''}`,
                "leak-report",
                isUpdate,
                currentSlug,
                [{
                    path: proofPath,
                    content: base64Content,
                    isBinary: true
                }]
            );

            setSuccess(t.t('success') + " " + prUrl);
            setProofFile(null);
            setProofPreview(null);
            setFormData({});
            setMediaLink("");
            setSelectedService(null);
            setIsNewService(false);
            setNewServiceName("");
        } catch (err) {
            console.error(err);
            setError(t.t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {t.t('title')}
                        </h1>
                    </div>

                    <p className="mb-8 text-gray-500 leading-relaxed">
                        {t.t('description')}
                    </p>

                    <div className="mb-8">
                        {!isNewService ? (
                            <>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t.t('selectServiceTitle')}
                                </label>
                                <Select
                                    options={serviceOptions}
                                    onChange={handleServiceSelect}
                                    placeholder={t.t('selectServicePlaceholder')}
                                    className="text-sm"
                                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                    components={{
                                        IndicatorSeparator: () => null,
                                        DropdownIndicator: (props) => (
                                            <components.DropdownIndicator {...props}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                                                </svg>
                                            </components.DropdownIndicator>
                                        ),
                                        NoOptionsMessage: (props) => (
                                            <components.NoOptionsMessage {...props}>
                                                <div className="text-center py-2">
                                                    <span className="text-gray-600">{t.t('serviceNotFoundWithMessage')}</span>
                                                    <button
                                                        type="button"
                                                        onMouseDown={(e) => { e.preventDefault(); setIsNewService(true); }}
                                                        className="text-blue-600 hover:underline font-medium ml-1"
                                                    >
                                                        {t.t('createServiceAction')}
                                                    </button>
                                                </div>
                                            </components.NoOptionsMessage>
                                        )
                                    }}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        control: (base) => ({
                                            ...base,
                                            padding: '4px',
                                            borderRadius: '0.75rem',
                                            borderColor: '#E5E7EB',
                                            backgroundColor: '#F9FAFB',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: '#3B82F6'
                                            }
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? '#EFF6FF' : state.isFocused ? '#F9FAFB' : 'white',
                                            color: state.isSelected ? '#1D4ED8' : '#374151',
                                        })
                                    }}
                                />
                            </>
                        ) : (
                            <div className="space-y-4 animate-fadeIn">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t.t('newServiceName')}
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newServiceName}
                                        onChange={(e) => setNewServiceName(e.target.value)}
                                        placeholder={t.t('newServiceNamePlaceholder')}
                                        className="flex-1 rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsNewService(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                                    >
                                        {t.t('cancelNewService')}
                                    </button>
                                </div>

                                {existingServiceMatch ? (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                                        <div className="flex items-start sm:items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                                <Info className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-900">
                                                    {t.t('serviceAlreadyExists')} <strong className="font-semibold">{existingServiceMatch.name}</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleServiceSelect({ service: existingServiceMatch });
                                            }}
                                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
                                        >
                                            {t.t('useExistingService')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
                                        {t.t('newServiceInfo')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {(selectedService || (isNewService && newServiceName)) && (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
                            <div className="border-t border-gray-100 pt-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                    {t.t('leakDetails')}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.t('date')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="date"
                                                required
                                                className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all duration-200 ease-in-out"
                                                value={formData.date || ''}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.t('type')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder={t.t('typePlaceholder')}
                                                className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all duration-200 ease-in-out"
                                                value={formData.type || ''}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.t('typeEn')}
                                        </label>
                                        <div className="relative group">
                                            <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder={t.t('typePlaceholderEn')}
                                                className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all duration-200 ease-in-out"
                                                value={formData.type_en || ''}
                                                onChange={e => setFormData({ ...formData, type_en: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                                <div className="flex gap-4">
                                    <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-bold text-amber-800">
                                            {t.t('warningTitle')}
                                        </h3>
                                        <p className="mt-1 text-sm text-amber-700 leading-relaxed">
                                            {t.t('proofWarning')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t.t('proof')} <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className={`relative mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${proofPreview ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
                                >
                                    <div className="space-y-2 text-center">
                                        {proofPreview ? (
                                            <div className="relative inline-block">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={proofPreview} alt="Proof preview" className="max-h-48 rounded-lg shadow-sm" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setProofFile(null); setProofPreview(null); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                    <Upload className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            required
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t.t('contributor')}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all duration-200 ease-in-out"
                                        value={formData.contributor || ''}
                                        onChange={e => setFormData({ ...formData, contributor: e.target.value })}
                                        placeholder="Anonymous"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t.t('mediaLink')}
                                </label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all duration-200 ease-in-out"
                                        value={mediaLink}
                                        onChange={e => setMediaLink(e.target.value)}
                                        placeholder={t.t('mediaLinkPlaceholder')}
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Lien facultatif vers un article de presse ou une source externe</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.01] hover:shadow-xl ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t.t('submitting')}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 mr-2" />
                                            {t.t('submit')}
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center animate-pulse">
                                    <AlertTriangle className="h-5 w-5 mr-3 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center shadow-sm">
                                    <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: success }} />
                                </div>
                            )}
                        </form>
                    )}

                    {/* Service not found section - Footer of card */}
                    {serviceOptions.length > 0 && !selectedService && !isNewService && (
                        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-sm leading-relaxed flex items-center gap-3">
                            <span className="flex-1">
                                {t.t('serviceNotFoundWithMessage')}
                                <button
                                    type="button"
                                    onClick={() => setIsNewService(true)}
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors ml-1 decoration-2 hover:underline offset-2"
                                >
                                    {t.t('createServiceAction')}
                                </button>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
