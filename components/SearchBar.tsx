"use client";

import React from "react";
import Image from "next/image";

type SearchBarProps = {
  nameSite: string;
  setNameSite: React.Dispatch<React.SetStateAction<string>>;
  findSite: (nameSite: string) => void;
};

export default function SearchBar({
  nameSite,
  setNameSite,
  findSite,
}: SearchBarProps) {
  const handleSite = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const nameValue = e.target.value;
    setNameSite(nameValue);
    findSite(nameValue);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          className="px-5 py-3 pl-12 bg-white rounded-xl border border-gray-200 
                   text-gray-700 placeholder-gray-400
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   transition-all duration-200"
          placeholder="Rechercher un service..."
          value={nameSite}
          onChange={handleSite}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        {nameSite && (
          <button
            onClick={() => {
              setNameSite("");
              findSite("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
