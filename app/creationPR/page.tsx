'use client';

import { useState } from 'react';
import { socialNetworks } from '@/app/config/socialNetworks';

export default function CreatePR() {
  const [nom, setNom] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Création du PR en cours...');

    try {
      // 1. D'abord, on encode le fichier en base64
      const base64Content = file ? await fileToBase64(file) : '';

      // 2. On crée une nouvelle branche
      const branchName = `upload-${nom}-${Date.now()}`;
      const mainRef = await getMainRef();
      await createBranch(branchName, mainRef);

      // 3. On upload le fichier dans la nouvelle branche
      await createOrUpdateFile({
        path: `${file?.name}`,
        content: base64Content,
        branch: branchName,
        message: `Upload ${file?.name}`
      });

      // 4. On crée la PR
      const response = await fetch('https://api.github.com/repos/amapic/test/pulls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Upload fichier : ${nom}`,
          body: `Nouvelle demande d'upload de ${nom}\n\nFichier : ${file?.name}`,
          head: branchName,
          base: 'master',
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du PR');
      }

      setStatus('PR créée avec succès !');
      setNom('');
      setFile(null);
    } catch (error) {
      setStatus(`Erreur: ${error.message}`);
    }
  };

  // Fonctions utilitaires
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const getMainRef = async () => {
    const response = await fetch('https://api.github.com/repos/amapic/test/git/ref/heads/master', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();
    return data.object.sha;
  };

  const createBranch = async (branchName: string, sha: string) => {
    await fetch('https://api.github.com/repos/amapic/test/git/refs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sha
      })
    });
  };

  const createOrUpdateFile = async ({
    path,
    content,
    branch,
    message
  }: {
    path: string;
    content: string;
    branch: string;
    message: string;
  }) => {
    await fetch(`https://api.github.com/repos/amapic/test/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content,
        branch
      })
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload de fichier via PR</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="network" className="block mb-2">
            Réseau social
          </label>
          <select
            id="network"
            value={selectedNetwork}
            onChange={(e) => {
              setSelectedNetwork(e.target.value);
              setNom(socialNetworks[e.target.value]?.name || '');
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Sélectionnez un réseau social</option>
            {Object.entries(socialNetworks).map(([key, network]) => (
              <option key={key} value={key}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block mb-2">
            Fichier à uploader
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Créer la PR
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