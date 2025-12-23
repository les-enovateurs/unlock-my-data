"use client";

import React from 'react';
import wantedServices from '@/public/data/wanted-services.json';
import servicesData from '@/public/data/services.json';
import { CheckCircle, Github, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper to normalize names for comparison
const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function MissionsPage() {
    // Create a set of existing service slugs/names for fast lookup
    const existingServices = new Set((servicesData as any[]).map(s => normalize(s.name)));

    const getStatus = (serviceName: string) => {
        if (existingServices.has(normalize(serviceName))) {
            return 'done';
        }
        return 'todo';
    };

    const generateIssueUrl = (serviceName: string) => {
        const title = encodeURIComponent(`[Mission] Analyse de ${serviceName}`);
        const body = encodeURIComponent(`Je souhaite travailler sur l'analyse de ${serviceName}.\n\nStatus: En cours`);
        return `https://github.com/les-enovateurs/unlock-my-data/issues/new?title=${title}&body=${body}&labels=mission`;
    };

    const generateSearchUrl = (serviceName: string) => {
        const query = encodeURIComponent(`is:issue "${serviceName}"`);
        return `https://github.com/les-enovateurs/unlock-my-data/issues?q=${query}`;
    };

    return (
        <div className="min-h-screen bg-base-100 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8">
                    <Link href="/contribuer" className="btn btn-ghost gap-2 pl-0 hover:bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la contribution
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Missions Communautaires</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Aidez-nous à cartographier les services les plus utilisés.
                        Choisissez une mission, vérifiez qu'elle n'est pas déjà prise sur GitHub, et lancez-vous !
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-12">
                    {wantedServices.map((category, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">{category.category}</h2>
                                <p className="text-gray-600">{category.description}</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.services.map((serviceName, sIdx) => {
                                        const status = getStatus(serviceName);
                                        return (
                                            <div key={sIdx} className={`p-4 rounded-lg border ${status === 'done' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary/50 transition-colors'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-lg">{serviceName}</h3>
                                                    {status === 'done' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <span className="badge badge-ghost text-xs">À faire</span>
                                                    )}
                                                </div>

                                                {status === 'done' ? (
                                                    <div className="text-sm text-green-700 font-medium flex items-center gap-2">
                                                        Déjà analysé
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2 mt-4">
                                                        <a
                                                            href={generateSearchUrl(serviceName)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-xs btn-ghost border-gray-200 justify-start h-auto py-2"
                                                        >
                                                            <Search className="w-3 h-3 mr-2" />
                                                            Vérifier si pris
                                                        </a>
                                                        <a
                                                            href={generateIssueUrl(serviceName)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-xs btn-primary justify-start h-auto py-2"
                                                        >
                                                            <Github className="w-3 h-3 mr-2" />
                                                            Je m'en occupe
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-primary/5 rounded-xl border border-primary/10">
                    <h3 className="text-xl font-bold mb-2">Vous ne trouvez pas le service que vous cherchez ?</h3>
                    <p className="mb-6 text-gray-600">Vous pouvez proposer n'importe quel service, même s'il n'est pas dans cette liste.</p>
                    <Link href="/contribuer/nouvelle-fiche" className="btn btn-primary">
                        Ajouter un autre service
                    </Link>
                </div>
            </div>
        </div>
    );
}

