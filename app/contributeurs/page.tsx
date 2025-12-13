"use client";

import stats from "../../public/data/contributors-stats.json";
import { useState } from 'react';
import { FaTrophy, FaEdit, FaUsers, FaCalendar } from 'react-icons/fa';
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
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-orange-400 to-orange-600'
  ];

  const podiumHeights = ['h-48', 'h-40', 'h-36'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Temple des contributeurs & contributrices
          </h1>
          <p className="text-xl text-gray-600">Célébrons nos contributeurs extraordinaires</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FaUsers />
              {stats.totalFiles} Entreprises
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar />
              Mis à jour : {new Date(stats.generatedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-indigo-600">{stats.totalFiles}</div>
            <div className="text-gray-600 mt-2">Entreprises au Total</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600">{stats.topCreators.length}</div>
            <div className="text-gray-600 mt-2">Créateurs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-purple-600">{stats.topUpdaters.length}</div>
            <div className="text-gray-600 mt-2">Éditeurs</div>
          </div>
        </div>

        {/* Top Creators Podium */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Meilleurs Créateurs
          </h2>

          <div className="flex items-end justify-center gap-4 mb-8">
            {stats.topCreators.slice(0, 3).map((creator, index) => {
              const positions = [0, 1, 2]; // Silver (2nd), Gold (1st), Bronze (3rd)
              const actualIndex = positions[index];
              const displayPosition = actualIndex + 1;

              return (
                <div
                  key={creator.name}
                  className={`flex flex-col items-center ${index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3'}`}
                >
                  <div className="text-center mb-3 px-4">
                    <div className="text-6xl mb-2">
                      {displayPosition === 1 ? '🥇' : displayPosition === 2 ? '🥈' : '🥉'}
                    </div>
                    <div className="font-bold text-gray-900 text-lg">{creator.name}</div>
                    <div className="text-3xl font-bold text-indigo-600">{creator.count}</div>
                    <div className="text-sm text-gray-500">entreprises</div>
                  </div>
                  <div className={`w-40 ${podiumHeights[actualIndex]} bg-gradient-to-t ${podiumColors[actualIndex]} rounded-t-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    #{displayPosition}
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
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{creator.name}</div>
                      <div className="text-sm text-gray-500">{creator.count} entreprises créées</div>
                    </div>
                  </div>
                  <FaTrophy className={`text-2xl ${index < 3 ? 'text-yellow-500' : 'text-gray-300'}`} />
                </div>

                {selectedCreator?.name === creator.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Entreprises :</div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {creator.companies.map((company, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex justify-between">
                          <span>{company.name}</span>
                          <span className="text-gray-400">{company.date}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaEdit className="text-purple-500" />
            Meilleurs Éditeurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topUpdaters.map((updater, index) => (
              <div
                key={updater.name}
                onClick={() => setSelectedUpdater(selectedUpdater?.name === updater.name ? null : updater)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{updater.name}</div>
                      <div className="text-sm text-gray-500">{updater.count} mises à jour</div>
                    </div>
                  </div>
                  <FaEdit className={`text-2xl ${index < 3 ? 'text-purple-500' : 'text-gray-300'}`} />
                </div>

                {selectedUpdater?.name === updater.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Entreprises mises à jour :</div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {updater.companies.map((company, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex justify-between">
                          <span>{company.name}</span>
                          <span className="text-gray-400">{company.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Merci à tous les contributeurs pour améliorer Unlock My Data ! 🙏</p>
            <p className="mt-2">Pour contribuer davantage, vous pouvez <Link href={"/contribuer"} className={"bg-green-700 text-white hover:text-black hover:border hover:border-green-700 p-2 rounded-3xl hover:bg-white"} prefetch={false}>lire tout ce qu&apos;il faut savoir</Link></p>
        </div>
      </div>
    </div>
  );
}

