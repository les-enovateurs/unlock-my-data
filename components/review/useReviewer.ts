"use client";
import { useState, useEffect } from "react";

const KEY = "unlock-my-data:contributor-name";

export function useReviewer() {
  const [name, setName] = useState("");
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) setName(saved);
  }, []);
  useEffect(() => {
    if (name) sessionStorage.setItem(KEY, name);
    else sessionStorage.removeItem(KEY);
  }, [name]);
  return { name, setName };
}
