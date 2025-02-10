"use client"

import { useState, useEffect, useRef } from 'react';

interface TosdrService {
  id: number;
  name: string;
  urls?: string[];
  rating?: string;
  points?: number;
}

class TosdrChecker {
  private results: TosdrService[] = [];
  private isRunning: boolean = false;
  private currentId: number = 1;
  private maxId: number = 2000;
  private step: number = 10;

  constructor(
    private onProgress?: (current: number, max: number) => void,
    private onResult?: (service: TosdrService) => void
  ) {}

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.results = [];

    for (let id = this.currentId; id <= this.maxId; id += this.step) {
      if (!this.isRunning) break;

      try {
        const response = await fetch(`https://api.tosdr.org/service/v3/?id=${id}`);
        const data = await response.json();

        if (!data.detail || data.detail !== "Service not found") {
          const service: TosdrService = {
            id: id,
            name: data.parameters?.name || 'Nom non disponible',
            urls: data.parameters?.urls || [],
            rating: data.parameters?.rating || 'Non évalué',
            points: data.parameters?.points || 0
          };

          this.results.push(service);
          this.onResult?.(service);
        }

        this.onProgress?.(id, this.maxId);
        console.log("caca")
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Erreur pour l'ID ${id}:`, error);
      }
    }

    this.isRunning = false;
    return this.results;
  }

  stop() {
    this.isRunning = false;
  }

  getResults() {
    return this.results;
  }
}

// Exemple d'utilisation avec une interface utilisateur
export default function TosdrServiceChecker() {
  const [progress, setProgress] = useState(0);
  const [services, setServices] = useState<TosdrService[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const checkerRef = useRef<TosdrChecker>();


  useEffect(() => {
    checkerRef.current = new TosdrChecker(
      (current, max) => {
        setProgress((current / max) * 100);
      },
      (service) => {
        setServices(prev => [...prev, service]);
      }
    );
  }, []);

  const handleStart = async () => {
    setIsChecking(true);
    setServices([]);
    await checkerRef.current?.start();
    setIsChecking(false);
  };

  const handleStop = () => {
    checkerRef.current?.stop();
    setIsChecking(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={isChecking ? handleStop : handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isChecking ? 'Arrêter' : 'Démarrer'} la vérification
        </button>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded">
          <div 
            className="bg-blue-500 rounded h-2" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center">{Math.round(progress)}%</div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>URLs</th>
              <th>Note</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.urls?.join(', ')}</td>
                <td>{service.rating}</td>
                <td>{service.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
