'use client';

import { useState } from 'react';

export default function CreateIssue() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Création en cours...');

    try {
      const response = await fetch('https://api.github.com/repos/amapic/test/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          body: body,
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'issue');
      }

      setStatus('Issue créée avec succès !');
      setTitle('');
      setBody('');
    } catch (error) {
      setStatus(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une nouvelle issue GitHub</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2">
            Titre de l'issue
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="body" className="block mb-2">
            Description
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
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
