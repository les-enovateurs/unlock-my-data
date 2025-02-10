'use client';
import { useEffect, useState } from 'react';

interface Case {
  id: string;
  url: string;
  title: string;
}

interface CasesData {
  cases: Case[];
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const response = await fetch('/data/cases.json');
        if (!response.ok) {
          throw new Error('Failed to fetch cases data');
        }
        const data: CasesData = await response.json();
        setCases(data.cases);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading cases');
      } finally {
        setIsLoading(false);
      }
    };

    loadCases();
  }, []);

  if (isLoading) {
    return <div>Loading cases...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cases</h1>
      <div className="grid gap-4">
        {cases.map((case_) => (
          <div key={case_.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{case_.title}</h2>
            <p className="text-sm text-gray-600">Case ID: {case_.id}</p>
            <a 
              href={case_.url} 
              className="text-blue-500 hover:text-blue-700"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}