"use client";

import stats from "../../public/data/contributors-stats.json";
import { useState } from 'react';
import { Trophy, Edit3, Users, Calendar, Sparkles, Medal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Link from "next/link";

interface Contributor {
  name: string;
  count: number;
  companies: { name: string; date: string }[];
}

export default function ContributeursPage() {
  const [selectedCreator, setSelectedCreator] = useState<Contributor | null>(null);
  const [selectedUpdater, setSelectedUpdater] = useState<Contributor | null>(null);

  const podiumColors = [
    'from-yellow-300 to-yellow-500',
    'from-gray-300 to-gray-400',
    'from-orange-300 to-orange-400'
  ];

  const podiumHeights = ['h-48', 'h-40', 'h-36'];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/5 to-base-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 mb-8 animate-fade-in shadow-sm">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-sm tracking-wide uppercase">Hall of Fame</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Nos Pros de la <span className="text-primary">Transparence</span>
          </h1>

          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-12">
            Voici les contributeurs et contributrices présentent pour libérer les données et redonner le pouvoir aux citoyens.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-base-content/60">
            <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-lg">
              <Users className="w-4 h-4" />
              {stats.totalFiles} Entreprises référencées
            </div>
            <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              Mis à jour le {new Date(stats.generatedAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary/50 transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary">{stats.totalFiles}</div>
              <div className="text-base-content/60 font-medium">Entreprises au Total</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-green-500/50 transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-green-600">{stats.topCreators.length}</div>
              <div className="text-base-content/60 font-medium">Créateurs</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-purple-500/50 transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
                <Edit3 className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-purple-600">{stats.topUpdaters.length}</div>
              <div className="text-base-content/60 font-medium">Éditeurs</div>
            </div>
          </div>
        </div>

        {/* Top Creators Podium */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-base-content mb-12 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500 w-8 h-8" />
            Meilleurs Créateurs
          </h2>

          <div className="flex items-end justify-center gap-4 md:gap-8 mb-12">
            {stats.topCreators.slice(0, 3).map((creator, index) => {
              const positions = [0, 1, 2]; // Silver (2nd), Gold (1st), Bronze (3rd)
              const actualIndex = positions[index];
              const displayPosition = actualIndex + 1;

              return (
                <div
                  key={creator.name}
                  className={`flex flex-col items-center ${index === 1 ? 'order-1 z-10' : index === 0 ? 'order-2' : 'order-3'}`}
                >
                  <div className="text-center mb-4 relative group">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${podiumColors[actualIndex]} opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity`}></div>
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {displayPosition === 1 ? '🥇' : displayPosition === 2 ? '🥈' : '🥉'}
                    </div>
                    <div className="font-bold text-base-content text-lg">{creator.name}</div>
                    <div className="text-2xl font-bold text-primary">{creator.count}</div>
                    <div className="text-xs text-base-content/50 uppercase tracking-wider">fiches</div>
                  </div>
                  <div className={`w-24 md:w-40 ${podiumHeights[actualIndex]} bg-gradient-to-t ${podiumColors[actualIndex]} rounded-t-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 skew-y-12 transform origin-bottom-left"></div>
                    <span className="relative drop-shadow-md">#{displayPosition}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Creators List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topCreators.map((creator, index) => (
              <div
                key={creator.name}
                onClick={() => setSelectedCreator(selectedCreator?.name === creator.name ? null : creator)}
                className={`bg-base-100 rounded-xl p-6 cursor-pointer border transition-all duration-200 ${
                    selectedCreator?.name === creator.name 
                    ? 'border-primary shadow-lg ring-1 ring-primary' 
                    : 'border-base-200 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-base-200 text-base-content/60'
                    }`}>
                        {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{creator.name}</div>
                      <div className="text-sm text-base-content/60">{creator.count} entreprises créées</div>
                    </div>
                  </div>
                  {index < 3 && <Trophy className="w-5 h-5 text-yellow-500" />}
                </div>

                {selectedCreator?.name === creator.name && (
                  <div className="mt-4 pt-4 border-t border-base-200 animate-fade-in">
                    <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-3">Entreprises créées :</div>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-base-300">
                      {creator.companies.map((company, idx) => (
                        <div key={idx} className="text-sm bg-base-200/50 p-2 rounded flex justify-between items-center">
                          <span className="font-medium">{company.name}</span>
                          <span className="text-xs text-base-content/50">{company.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Updaters */}
        <div>
          <h2 className="text-3xl font-bold text-base-content mb-12 flex items-center gap-3">
            <Edit3 className="text-purple-500 w-8 h-8" />
            Meilleurs Éditeurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topUpdaters.map((updater, index) => (
              <div
                key={updater.name}
                onClick={() => setSelectedUpdater(selectedUpdater?.name === updater.name ? null : updater)}
                className={`bg-base-100 rounded-xl p-6 cursor-pointer border transition-all duration-200 ${
                    selectedUpdater?.name === updater.name 
                    ? 'border-purple-500 shadow-lg ring-1 ring-purple-500' 
                    : 'border-base-200 hover:border-purple-500/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        index < 3 ? 'bg-purple-100 text-purple-700' : 'bg-base-200 text-base-content/60'
                    }`}>
                        {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{updater.name}</div>
                      <div className="text-sm text-base-content/60">{updater.count} mises à jour</div>
                    </div>
                  </div>
                  {index < 3 && <Medal className="w-5 h-5 text-purple-500" />}
                </div>

                {selectedUpdater?.name === updater.name && (
                  <div className="mt-4 pt-4 border-t border-base-200 animate-fade-in">
                    <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-3">Mises à jour :</div>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-base-300">
                      {updater.companies.map((company, idx) => (
                        <div key={idx} className="text-sm bg-base-200/50 p-2 rounded flex justify-between items-center">
                          <span className="font-medium">{company.name}</span>
                          <span className="text-xs text-base-content/50">{company.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New CTA Section */}
        <div className="mt-24 relative overflow-hidden rounded-3xl bg-primary text-primary-content shadow-xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl"></div>

            <div className="relative px-8 py-16 md:py-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Envie de voir votre nom ici ?</h2>
                <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                    Chaque contribution compte. Ajoutez un service ou mettez à jour une fiche existante pour aider la communauté.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/contribuer/nouvelle-fiche"
                        className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none shadow-lg group"
                    >
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500 group-hover:rotate-12 transition-transform" />
                        Ajouter une fiche
                    </Link>
                    <Link
                        href="/contribuer"
                        className="btn btn-lg btn-outline text-white border-white hover:bg-white/20 hover:border-white"
                    >
                        Comment contribuer ?
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
