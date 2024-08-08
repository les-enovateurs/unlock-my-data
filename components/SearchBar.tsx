'use client'

import React, { useState } from "react";

export default function SearchBar() {
    const [nameSite, setNameSite] = useState("")

    const handleSite = (e: any) => {
        e.preventDefault()
        setNameSite(e.target.value)
    }
    console.log("nameSite : ", nameSite);
    
  return (
    <div className="relative flex items-center">
      <input
        type="text"
        className="bg-gray-300 w-full rounded-3xl px-4 py-2"
        placeholder="Rechercher un site"
        value={nameSite}
        onChange={handleSite}
      />
      <img
        src="/magnifying-glass-solid.svg"
        alt="loupe de recherche"
        className="size-5 absolute right-3"
      />
    </div>
  );
}
