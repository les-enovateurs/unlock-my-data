"use client";

import React from "react";

type SearchBarProps = {
  nameSite: string;
  setNameSite: React.Dispatch<React.SetStateAction<string>>;
  findSite: () => void;
};
export default function SearchBar({
  nameSite,
  setNameSite,
  findSite,
}: SearchBarProps) {
  const handleSite = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNameSite(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      findSite()
    }
  }

  return (
    <div className="relative flex items-center my-4 pb-4 tablet:w-9/12 md:w-1/2 lg:w-1/4">
      <input
        type="text"
        className="bg-gray-300 w-full rounded-3xl px-4 py-2"
        placeholder="Rechercher un site"
        value={nameSite}
        onChange={handleSite}
        onKeyUp={handleKeyPress}
      />
      <img
        src="/icons/magnifying-glass-solid.svg"
        alt="loupe de recherche"
        className="size-5 absolute right-3"
        onClick={findSite}
      />
    </div>
  );
}
