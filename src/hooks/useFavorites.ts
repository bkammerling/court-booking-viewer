import { useState, useEffect } from "react";

export function useFavorites(key = "favorites") {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setFavorites(stored ? JSON.parse(stored) : []);
  }, [key]);
  
// Toggle favorite: add if not present, remove if present
const toggleFavorite = (slug: string) => {
  let updated: string[];
  if (favorites.includes(slug)) {
    updated = favorites.filter(fav => fav !== slug);
  } else {
    updated = [...favorites, slug];
  }
  setFavorites(updated);
  localStorage.setItem(key, JSON.stringify(updated));
};

return { favorites, toggleFavorite };
}