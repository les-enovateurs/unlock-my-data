"use client";

import Image from "next/image";
import Link from "next/link";

import { useRef, useState } from "react";

type Entreprise = {
  name: string;
  logo: string;
  accessibilite: string;
  sortirAlgo: string;
  pub: string;
  captation: string;
  biaisCognitif: string;
  selected: boolean;
};

type Critere = {
  name: string;
  selected: boolean;
};

export default function FicheEntreprise() {

  const ref = useRef<HTMLInputElement>(null);

  function handleAccordionClick() {
    console.log(!ref.current!.checked,ref.current!.checked);
    ref.current!.checked = !ref.current!.checked;
  }
  const criteres: Critere[] = [
    { name: "accessibilite", selected: true },
    { name: "sortirAlgo", selected: true },
    { name: "pub", selected: true },
    { name: "captation", selected: true },
    { name: "biaisCognitif", selected: true },
  ];
  const entreprises: Entreprise[] = [
    {
      name: "Tiktok",
      logo: "/tiktok.png",
      accessibilite: "Access Tiktok",
      sortirAlgo: "Sortir Tiktok",
      pub: "Pub Tiktok",
      captation: "Captation Tiktok",
      biaisCognitif: "Biais Cognitif Tiktok",
      selected: true,
    },
    {
      name: "Mastodon",
      logo: "/mastodon.png",
      accessibilite: "Access Mastodon",
      sortirAlgo: "Sortir Mastodon",
      pub: "Pub Mastodon",
      captation: "Captation Mastodon",
      biaisCognitif: "Biais Cognitif Mastodon",
      selected: true,
    },
    {
      name: "Facebook",
      logo: "/facebook.png",
      accessibilite: "Access Facebook",
      sortirAlgo: "Sortir Facebook",
      pub: "Pub Facebook",
      captation: "Captation Facebook",
      biaisCognitif: "Biais Cognitif Facebook",
      selected: true,
    },
  ];
  const [selectedCompanies, setSelectedCompanies] =
    useState<Entreprise[]>(entreprises);
  const [selectedCriteres, setSelectedCriteres] = useState<Critere[]>(criteres);

  const handleCheckboxChange = (entrepriseName: string) => {
    setSelectedCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.name === entrepriseName
          ? { ...company, selected: !company.selected }
          : company
      )
    );
  };

  const handleCheckboxCritereChange = (critereName: string) => {
    setSelectedCriteres((prevCriteres) =>
      prevCriteres.map((critere) =>
        critere.name === critereName
          ? { ...critere, selected: !critere.selected }
          : critere
      )
    );
  };

  return (
    <section className="my-6 px-4">
      <div className="flex justify-center items-center bg-gray-100 p-8 rounded-lg shadow-sm mb-12">
        <Image
          src="/tiktok.png"
          alt="logo"
          width={100}
          height={100}
          className="mr-6"
        />
        <div className="text-4xl font-bold text-gray-800">Tiktok</div>
      </div>

      <div className="w-full max-w-6xl mx-auto my-8 text-gray-600 leading-relaxed bg-white p-6 rounded-lg shadow-sm">
      Lorem ipsum dolor sit amet consectetur. Leo non condimentum faucibus vitae vulputate faucibus. Suspendisse sodales velit magna pulvinar posuere et nulla ac. Aliquet lobortis pulvinar morbi magna viverra. Ultrices interdum hendrerit id pellentesque scelerisque ultrices posuere.
      </div>

      <div className="max-w-6xl grid grid-cols-2 gap-8 w-full max-w-3xl mx-auto p-4 join">
        <div className="card  p-8 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          A
        </div>
        <div className="card  p-8 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          B
        </div>
        <div className="card  p-8 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          C
        </div>
        <div className="card  p-8 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          D
        </div>
      </div>

      <div className="flex gap-12 w-full max-w-6xl mx-auto my-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Entreprises
          </h3>
          {selectedCompanies.map((entreprise) => (
            <div
              key={entreprise.name}
              className="flex items-center gap-3 mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={entreprise.selected}
                onChange={() => handleCheckboxChange(entreprise.name)}
                className="checkbox w-4 h-4 text-color3-600"
              />
              <span className="text-gray-600">{entreprise.name}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Critères</h3>
          {criteres.map((critere) => (
            <div
              key={critere.name}
              className="flex items-center gap-3 mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={critere.selected}
                onChange={() => handleCheckboxCritereChange(critere.name)}
                className="checkbox w-4 h-4 text-color3-600"
              />
              <span className="text-gray-600">{critere.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto my-8 bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="bg-gray-50 border-b p-3"></th>
              {selectedCompanies
                .filter((company) => company.selected)
                .map((company) => (
                  <th
                    key={company.name}
                    className="bg-gray-50 border-b p-3 text-gray-700"
                  >
                    {company.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {selectedCriteres
              .filter((critere) => critere.selected)
              .map((critere) => (
                <tr key={critere.name} className="hover:bg-gray-50">
                  <td className="border-b p-3 text-gray-600 font-medium">
                    {critere.name}
                  </td>
                  {selectedCompanies
                    .filter((company) => company.selected)
                    .map((company) => (
                      <td
                        key={company.name}
                        className="border-b p-3 text-center"
                      >
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100">
                          {company[critere.name as keyof Entreprise]}
                        </span>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-6xl mx-auto my-8 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Quelles sont les données collectées ?
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Adresse Email
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Contacts
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Parametres de compte Gmail
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Localisation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Utilisation de services Google
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Pourquoi ces données sont collectées ?
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Améliorer continuellement les fonctionnalités
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Personnaliser l'expérience utilisateur
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto my-8 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700">
          Procédure pas à pas pour supprimer vos données
        </h3>
        <div className="join join-vertical w-full">
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input ref={ref} type="radio" name="my-accordion-1" onClick={handleAccordionClick}  />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-2"  />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-3"  />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
