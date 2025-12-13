"use client";

import React, {useState, useEffect, useRef} from "react";
import Image from "next/image";
import services from "../../public/data/services.json"
import Link from "next/link";


interface Service {
    mode: number;
    slug: string;
    name: string;
    logo: string;
    easy_access_data: string | number;
    contact_mail_export: string;
    contact_mail_delete: string;
    recipient_address: string | null;
    how_to_export: string;
    url_delete: string | null;
    url_export: string | null;
    need_id_card: boolean | null;
    data_access_via_postal: boolean | null;
    data_access_via_form: boolean | null | string;
    data_access_via_email: boolean | null;
    last_update_breach: string | null;
    country_name: string;
    country_code: string;
    nationality: string;
    exodus?: boolean;
    tosdr?: any;
}

interface SaveData {
    selectedServices: string[];
    completedServices: string[];
    skippedServices?: string[];
    notes: { [key: string]: string };
    timestamp: string;
}

export default function SupprimerMesDonnees() {
    const [step, setStep] = useState(1);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [completedServices, setCompletedServices] = useState<string[]>([]);
    const [skippedServices, setSkippedServices] = useState<string[]>([]);
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const serviceCardRef = useRef<HTMLDivElement>(null);
    const isNavigatingHistory = useRef(false);
    const isFirstRender = useRef(true);

    // Warn before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (selectedServices.length > 0 && step < 3) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [selectedServices, step]);

    // History management
    useEffect(() => {
        // Initial state
        if (typeof window !== 'undefined') {
            window.history.replaceState({step: 1, serviceIndex: 0}, "");
        }

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                isNavigatingHistory.current = true;
                setStep(event.state.step);
                if (event.state.serviceIndex !== undefined) {
                    setCurrentServiceIndex(event.state.serviceIndex);
                }
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (isNavigatingHistory.current) {
            isNavigatingHistory.current = false;
            return;
        }
        const state = { step, serviceIndex: step === 2 ? currentServiceIndex : undefined };
        window.history.pushState(state, "");
    }, [step, currentServiceIndex]);

    useEffect(() => {
        if (step === 2 && serviceCardRef.current) {
            serviceCardRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentServiceIndex, step]);

    useEffect(() => {
        const filtered = (services as unknown as Service[]).filter((service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
    }, [searchTerm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && step === 1 && selectedServices.length > 0) {
                setStep(2);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [step, selectedServices]);

    const toggleServiceSelection = (slug: string) => {
        setSelectedServices((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    const markAsCompleted = (slug: string) => {
        if (!completedServices.includes(slug)) {
            setCompletedServices((prev) => [...prev, slug]);
        }
        // Remove from skipped if it was there
        if (skippedServices.includes(slug)) {
            setSkippedServices((prev) => prev.filter((s) => s !== slug));
        }
    };

    const markAsSkipped = (slug: string) => {
        if (!skippedServices.includes(slug)) {
            setSkippedServices((prev) => [...prev, slug]);
        }
        // Remove from completed if it was there (though unlikely in this flow)
        if (completedServices.includes(slug)) {
            setCompletedServices((prev) => prev.filter((s) => s !== slug));
        }
    };

    const saveProgress = () => {
        const saveData: SaveData = {
            selectedServices,
            completedServices,
            skippedServices,
            notes,
            timestamp: new Date().toISOString(),
        };
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `suppression-donnees-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const loadProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data: SaveData = JSON.parse(e.target?.result as string);
                    setSelectedServices(data.selectedServices || []);
                    setCompletedServices(data.completedServices || []);
                    setSkippedServices(data.skippedServices || []);
                    setNotes(data.notes || {});
                    alert("Progression chargée avec succès !");
                } catch (error) {
                    alert("Erreur lors du chargement du fichier");
                }
            };
            reader.readAsText(file);
        }
    };

    const selectedServicesList = (services as unknown as Service[]).filter((s) => selectedServices.includes(s.slug));
    const currentService = selectedServicesList[currentServiceIndex];
    const progress = selectedServices.length > 0
        ? Math.round((completedServices.length / selectedServices.length) * 100)
        : 0;

    useEffect(() => {
        if (currentService) {
            const subject = `Demande de suppression de données personnelles (RGPD - Art. 17)`;
            const body = `Madame, Monsieur,

En application de l'article 17.1 du Règlement général sur la protection des données (RGPD), je vous prie d'effacer de vos fichiers les données personnelles suivantes me concernant :

Toutes les données personnelles associées à mon compte et mon utilisation de ${currentService.name}.

Je demande que ces informations soient supprimées car :

Je n'utilise plus ce service et souhaite exercer mon droit à l'effacement.

Vous voudrez bien également notifier cette demande d'effacement de mes données aux organismes auxquels vous les auriez communiquées (article 19 du RGPD).

Enfin, je vous prie de m'informer de ces éléments dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de la réception de ce courrier (article 12.3 du RGPD).

À défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;
            setEmailSubject(subject);
            setEmailBody(body);
        }
    }, [currentService]);

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Assistant de suppression</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-6">
                        Sélectionnez les services que vous n&apos;utilisez plus et générez automatiquement vos demandes de suppression de données (RGPD).
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={saveProgress}
                            className="btn btn-outline gap-2"
                            title="Sauvegarder votre progression"
                        >
                            💾 Sauvegarder
                        </button>
                        <label
                            className="btn btn-outline gap-2 cursor-pointer"
                            title="Charger une progression"
                        >
                            📂 Charger
                            <input
                                type="file"
                                accept=".json"
                                onChange={loadProgress}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <nav className="bg-base-100 border border-base-300 rounded-box shadow-sm sticky top-4 z-10 mb-8">
                    <div className="px-4 py-4">
                        <ul className="steps steps-horizontal w-full">
                            <li
                                className={`step ${step >= 1 ? "step-primary" : ""} cursor-pointer`}
                                onClick={() => setStep(1)}
                                role="button"
                                tabIndex={0}
                            >
                                Sélection
                            </li>
                            <li
                                className={`step ${step >= 2 ? "step-primary" : ""} ${selectedServices.length > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                                onClick={() => selectedServices.length > 0 && setStep(2)}
                                role="button"
                                tabIndex={selectedServices.length > 0 ? 0 : -1}
                            >
                                Suppression
                            </li>
                            <li
                                className={`step ${step >= 3 ? "step-primary" : ""} ${selectedServices.length > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                                onClick={() => selectedServices.length > 0 && setStep(3)}
                                role="button"
                                tabIndex={selectedServices.length > 0 ? 0 : -1}
                            >
                                Terminé
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Step 1: Service Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl">
                                    📋 Sélectionnez les services dont vous souhaitez supprimer vos données
                                </h2>
                                <p className="text-base-content/70">
                                    Cochez tous les services que vous n&apos;utilisez plus et dont vous voulez effacer les
                                    données personnelles.
                                </p>

                                <div className="form-control mt-4">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            className="px-5 py-3 pl-12 bg-white rounded-xl border border-gray-200
                   text-gray-700 placeholder-gray-400
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   transition-all duration-200"
                                            placeholder={"Rechercher un service..."}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {selectedServices.length > 0 && (
                                    <div className="alert alert-info mt-4">
                                        <span>✓ {selectedServices.length} service{selectedServices.length > 1 ? "s": ""} sélectionné{selectedServices.length > 1 ? "s": ""}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredServices.map((service) => (
                                <div
                                    key={service.slug}
                                    className={`card shadow-lg bg-white hover:shadow-xl  ${
                                        selectedServices.includes(service.slug)
                                            ? ""
                                            : ""
                                    }`}
                                    onClick={() => toggleServiceSelection(service.slug)}
                                >
                                    <div className="card-body p-4">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedServices.includes(service.slug)}
                                                onChange={() => {
                                                }}
                                                className="checkbox checkbox-success text-white mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="relative w-32 h-16">
                                                        <Image
                                                            fill
                                                            src={service.logo}
                                                            alt={`Logo de ${service.name}`}
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-3 flex-wrap justify-end">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              {service.nationality || "International"}
            </span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                className="btn btn-primary btn-lg"
                                disabled={selectedServices.length === 0}
                                onClick={() => setStep(2)}
                            >
                                Continuer avec {selectedServices.length} service(s)
                                →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Deletion Process */}
                {step === 2 && currentService && (
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold">Progression globale</span>
                                    <span className="text-sm">{progress}%</span>
                                </div>
                                <progress
                                    className="progress progress-primary w-full"
                                    value={progress}
                                    max="100"
                                ></progress>
                                <p className="text-xs text-base-content/70 mt-1">
                                    {completedServices.length} sur {selectedServices.length} services traités
                                </p>
                            </div>
                        </div>

                        {/* Current Service */}
                        <div ref={serviceCardRef} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-start gap-4 mb-4">
                                    {currentService.logo && (
                                        <div
                                            className="relative w-44 h-20 rounded-2xl">
                                            <Image
                                                src={currentService.logo}
                                                alt={currentService.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h2 className="card-title text-3xl">{currentService.name}</h2>
                                        <div className="flex gap-2 mt-2">
                                            <span className="badge">{currentService.nationality}</span>
                                            {completedServices.includes(currentService.slug) && (
                                                <span className="badge badge-success">✓ Traité</span>
                                            )}
                                            {skippedServices.includes(currentService.slug) && (
                                                <span className="badge badge-warning">⚠ En attente</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="space-y-4">
                                    <div className="alert alert-warning alert-outline">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="stroke-current shrink-0 h-6 w-6" fill="none"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                        </svg>
                                        <span>La suppression de vos données est définitive et irréversible.</span>
                                    </div>

                                    {!currentService.url_delete && !currentService.contact_mail_delete && (
                                        <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
                                            <div className="alert alert-info shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>Nous n&apos;avons pas d&apos;information précise pour supprimer les données de ce service.</span>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-bold">Conseils pour supprimer vos données :</h3>
                                                <ul className="list-disc list-inside space-y-1 text-sm">
                                                    <li>Vérifiez les <strong>Paramètres du compte</strong> {'>'} <strong>Confidentialité</strong> ou <strong>Sécurité</strong>.</li>
                                                    <li>Recherchez une adresse email de contact dans les <strong>Mentions Légales</strong> ou la <strong>Politique de Confidentialité</strong> du site.</li>
                                                    <li>Essayez d&apos;envoyer un email à <code>privacy@...</code>, <code>dpo@...</code> ou <code>contact@...</code> avec le nom de domaine du service.</li>
                                                </ul>
                                            </div>

                                            <div className="card bg-base-100 shadow-sm">
                                                <div className="card-body p-4">
                                                    <h4 className="font-bold text-sm">🤝 Contribuez au projet</h4>
                                                    <p className="text-xs">Si vous trouvez comment supprimer ce compte, aidez les autres utilisateurs !</p>
                                                    <Link
                                                        href={`/contribuer/modifier-fiche?slug=${currentService.slug}`}
                                                        target="_blank"
                                                        prefetch={false}
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary btn-sm gap-2 mt-2 w-64"
                                                    >
                                                        ✏️ Suggérer une modification
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentService.url_delete && (
                                        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <span>✓</span> Suppression en ligne disponible
                                            </h3>
                                            <a
                                                href={currentService.url_delete}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-success btn-sm"
                                            >
                                                Accéder au formulaire de suppression →
                                            </a>
                                        </div>
                                    )}

                                    {currentService.contact_mail_delete && (
                                        <div className="bg-base-200/50 p-6 rounded-xl border border-base-300">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Left Column: Editable Template */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">✉️</span>
                                                        <h3 className="font-bold text-lg">Modèle d&apos;email personnalisable</h3>
                                                    </div>

                                                    <div className="form-control w-full">
                                                        <label className="label">
                                                            <span className="label-text font-semibold mb-2">Objet du mail</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="input input-bordered w-full"
                                                            value={emailSubject}
                                                            onChange={(e) => setEmailSubject(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="form-control w-full">
                                                        <label className="label w-full mb-2">
                                                            <span className="label-text font-semibold">Corps du message</span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered h-96 text-sm leading-relaxed w-full"
                                                            value={emailBody}
                                                            onChange={(e) => setEmailBody(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                {/* Right Column: Recipient & Actions */}
                                                <div className="space-y-6 lg:pt-12">
                                                    <div className="card bg-base-100 shadow-sm border border-base-200">
                                                        <div className="card-body p-5">
                                                            <h4 className="font-bold text-sm uppercase text-base-content/70 mb-3">Destinataire</h4>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    className="input input-bordered w-full bg-base-200 font-mono text-sm"
                                                                    value={currentService.contact_mail_delete}
                                                                />
                                                                <button
                                                                    className="btn btn-square btn-ghost border-base-300"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(currentService.contact_mail_delete);
                                                                        alert("Email copié !");
                                                                    }}
                                                                    title="Copier l'adresse email"
                                                                >
                                                                    📋
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <a
                                                            href={`mailto:${currentService.contact_mail_delete}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                                                            className="btn btn-primary btn-block btn-lg shadow-lg hover:shadow-xl transition-all"
                                                        >
                                                            🚀 Envoyer l&apos;email
                                                            <span className="text-xs font-normal opacity-80 block">(ouvre votre messagerie)</span>
                                                        </a>

                                                        <div className="divider text-xs text-base-content/50 font-medium">OU COPIER MANUELLEMENT</div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(emailSubject);
                                                                    alert("Objet copié !");
                                                                }}
                                                            >
                                                                Copier l&apos;objet
                                                            </button>
                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(emailBody);
                                                                    alert("Message copié !");
                                                                }}
                                                            >
                                                                Copier le message
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="alert alert-info text-xs mt-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <span>
                                                            Ce modèle inclut les références aux articles 17.1, 19 et 12.3 du RGPD pour garantir le traitement de votre demande.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentService.need_id_card && (
                                        <div className="alert alert-info">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 className="stroke-current shrink-0 w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span>Une pièce d&apos;identité peut être requise pour cette demande</span>
                                        </div>
                                    )}

                                    <div className="form-control">
                                        <label className="label">
                                            <span
                                                className="label-text font-semibold w-full mb-2">📝 Notes personnelles</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-24 w-full"
                                            placeholder="Date de la demande, numéro de référence, remarques..."
                                            value={notes[currentService.slug] || ""}
                                            onChange={(e) =>
                                                setNotes((prev) => ({
                                                    ...prev,
                                                    [currentService.slug]: e.target.value,
                                                }))
                                            }
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="flex justify-center gap-4 flex-wrap">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => {
                                            if (currentServiceIndex > 0) {
                                                setCurrentServiceIndex(currentServiceIndex - 1);
                                            }
                                        }}
                                        disabled={currentServiceIndex === 0}
                                    >
                                        ← Précédent
                                    </button>

                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            markAsSkipped(currentService.slug);
                                            if (currentServiceIndex < selectedServicesList.length - 1) {
                                                setCurrentServiceIndex(currentServiceIndex + 1);
                                            } else {
                                                setStep(3);
                                            }
                                        }}
                                    >
                                        Passer pour plus tard
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            markAsCompleted(currentService.slug);
                                            if (currentServiceIndex < selectedServicesList.length - 1) {
                                                setCurrentServiceIndex(currentServiceIndex + 1);
                                            } else {
                                                setStep(3);
                                            }
                                        }}
                                    >
                                        {completedServices.includes(currentService.slug) ? "Suivant" : "Marquer comme traité "}
                                        →
                                    </button>
                                </div>

                                <p className="text-center text-sm text-base-content/60 mt-4">
                                    Service {currentServiceIndex + 1} sur {selectedServicesList.length}
                                </p>
                            </div>
                        </div>

                        {/* Quick navigation */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body p-4">
                                <h3 className="font-semibold text-sm mb-2">Navigation rapide</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedServicesList.map((service, index) => (
                                        <button
                                            key={service.slug}
                                            className={`btn btn-xs ${
                                                index === currentServiceIndex
                                                    ? "btn-primary"
                                                    : completedServices.includes(service.slug)
                                                        ? "btn-success"
                                                        : skippedServices.includes(service.slug)
                                                            ? "btn-warning"
                                                            : "btn-ghost"
                                            }`}
                                            onClick={() => setCurrentServiceIndex(index)}
                                        >
                                            {completedServices.includes(service.slug) && "✓ "}
                                            {skippedServices.includes(service.slug) && "⚠ "}
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Completion */}
                {step === 3 && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="text-6xl mb-4">
                                    {completedServices.length === selectedServices.length ? "🎉" : "📊"}
                                </div>
                                <h2 className="card-title text-3xl justify-center">
                                    {completedServices.length === selectedServices.length ? "Félicitations !" : "Bilan de la session"}
                                </h2>
                                <p className="text-lg">
                                    {completedServices.length === selectedServices.length
                                        ? "Vous avez traité tous les services sélectionnés pour la suppression de vos données."
                                        : `Vous avez traité ${completedServices.length} service(s) sur ${selectedServices.length}.`}
                                </p>

                                <div className="stats shadow mt-6">
                                    <div className="stat">
                                        <div className="stat-title">Services traités</div>
                                        <div className="stat-value text-primary">{completedServices.length}</div>
                                        <div className="stat-desc">sur {selectedServices.length} sélectionnés</div>
                                    </div>
                                </div>

                                {/* Skipped Services Action */}
                                {skippedServices.length > 0 && (
                                    <div className="card bg-warning/10 border-2 border-warning shadow-lg">
                                        <div className="card-body">
                                            <h3 className="card-title text-warning-content flex items-center gap-2">
                                                <span>⚠</span>
                                                Services en attente ({skippedServices.length})
                                            </h3>
                                            <p className="text-sm">
                                                Vous avez passé ces services. Cliquez sur l&apos;un d&apos;eux pour reprendre le traitement :
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedServicesList
                                                    .filter((s) => skippedServices.includes(s.slug))
                                                    .map((service) => (
                                                        <button
                                                            key={service.slug}
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => {
                                                                const index = selectedServicesList.findIndex(
                                                                    (s) => s.slug === service.slug
                                                                );
                                                                setCurrentServiceIndex(index);
                                                                setStep(2);
                                                            }}
                                                        >
                                                            {service.name} →
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {selectedServices.length > 0 && (
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body">
                                            <h3 className="card-title">📋 Récapitulatif</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra">
                                                    <thead>
                                                    <tr>
                                                        <th>Service</th>
                                                        <th>Statut</th>
                                                        <th>Notes</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selectedServicesList.map((service) => (
                                                        <tr key={service.slug}>
                                                            <td className="font-medium">{service.name}</td>
                                                            <td>
                                                                {completedServices.includes(service.slug) ? (
                                                                    <span className="badge badge-success">✓ Traité</span>
                                                                ) : skippedServices.includes(service.slug) ? (
                                                                    <button
                                                                        className="badge badge-warning gap-1 cursor-pointer hover:scale-105 transition-transform"
                                                                        onClick={() => {
                                                                            const index = selectedServicesList.findIndex(
                                                                                (s) => s.slug === service.slug
                                                                            );
                                                                            setCurrentServiceIndex(index);
                                                                            setStep(2);
                                                                        }}
                                                                    >
                                                                        ⚠ En attente
                                                                    </button>
                                                                ) : (
                                                                    <span className="badge badge-ghost">À faire</span>
                                                                )}
                                                            </td>
                                                            <td className="text-sm text-base-content/70">
                                                                {notes[service.slug] || "-"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="alert alert-info mt-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         className="stroke-current shrink-0 w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-left">
                                        <h3 className="font-bold">Prochaines étapes</h3>
                                        <ul className="text-sm mt-2 space-y-1">
                                            <li>• Surveillez vos emails pour les confirmations</li>
                                            <li>• Les entreprises ont généralement 30 jours pour répondre (RGPD)</li>
                                            <li>• Conservez vos preuves de demandes</li>
                                            <li>• En cas de non-réponse, vous pouvez saisir la CNIL</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={saveProgress}
                                    >
                                        💾 Sauvegarder mon suivi
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setStep(1);
                                            setSelectedServices([]);
                                            setCompletedServices([]);
                                            setNotes({});
                                            setCurrentServiceIndex(0);
                                            setSearchTerm("");
                                        }}
                                    >
                                        🔄 Recommencer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
