"use client";
import { useState, useEffect } from "react";

interface DateConfig {
  lastUpdate: string;
}

export default function AdminPage() {
  const [date, setDate] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Charger la date actuelle au chargement de la page
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch('/api/config');
        const data: DateConfig = await response.json();
        setDate(data.lastUpdate);
      } catch (error) {
        setStatus("Erreur lors du chargement de la date");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDate();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Mise à jour en cours...");

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastUpdate: date }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      setStatus("Date mise à jour avec succès !");
    } catch (error) {
      setStatus("Erreur lors de la mise à jour");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-btnblue">
          Administration - Mise à jour de la date
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date de dernière mise à jour
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-btnblue"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-btnblue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Mettre à jour
          </button>

          {status && (
            <div className={`mt-4 p-3 rounded-md ${
              status.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}