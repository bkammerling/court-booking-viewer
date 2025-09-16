import { useState, useEffect } from "react";

export function useFavorites(key = "favorites") {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Get favorites on mount
    setFavorites(getFavorites());
  }, [key]);

  const getFavorites = () => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  };

  // Toggle favorite: add if not present, remove if present
  const toggleFavorite = (slug: string) => {
    let updated: string[];
    const currentFavorites = getFavorites();
    if (currentFavorites.includes(slug)) {
      updated = currentFavorites.filter((fav: string) => fav !== slug);
    } else {
      updated = [...currentFavorites, slug];
    }
  setFavorites(updated);
  localStorage.setItem(key, JSON.stringify(updated));
};

// Check if a venue is favorited
const isFavorite = (slug: string) => favorites.includes(slug);

return { favorites, toggleFavorite, isFavorite };
}