'use client';

import { useState } from 'react';

export default function CreateIssue() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [export_link, setExportLink] = useState('');
  const [logo, setLogo] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [besoinID, setBesoinID] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Création de l\'issue en cours...');

    const issueBody = "```json\n" + JSON.stringify({
      nom: nom,
      email_export: email,
      lien_export: export_link,
      logo: logo,
      nationalite: nationalite || null,
      besoin_carte_identite: besoinID
    }, null, 3) + "\n```";

    

    try {
      const response = await fetch('https://api.github.com/repos/amapic/test/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Nouvelle demande : ${nom}`,
          body: issueBody,
          labels: ['rgpd-export']
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'issue');
      }

      setStatus('Issue créée avec succès !');
      setNom('');
      setEmail('');
      setExportLink('');
      setLogo('');
      setNationalite('');
      setBesoinID(false);
    } catch (error) {
      setStatus(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une nouvelle demande RGPD</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block mb-2">
            Nom de l'application ou entreprise
          </label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">
            L'adresse e-mail / DPO - pour demander l'export des données
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="export_link" className="block mb-2">
            Lien vers la page d'export RGPD
          </label>
          <input
            type="url"
            id="export_link"
            value={export_link}
            onChange={(e) => setExportLink(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="logo" className="block mb-2">
            Lien vers le logo Wikipedia (optionnel)
          </label>
          <input
            type="url"
            id="logo"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="nationalite" className="block mb-2">
            Nationalité (optionnel)
          </label>
          <input
            type="text"
            id="nationalite"
            value={nationalite}
            onChange={(e) => setNationalite(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="besoinID"
            checked={besoinID}
            onChange={(e) => setBesoinID(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="besoinID" className="cursor-pointer">
            Besoin de la carte d'identité pour faire la demande
          </label>
        </div>

        <button
          type="submit"
          className="bg-red-500 text-black px-4 py-2 rounded"
        >
          Créer l'issue
        </button>

        {status && (
          <p className={status.includes('Erreur') ? 'text-red-500' : 'text-green-500'}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
