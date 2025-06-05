'use client';
import { useState, useRef } from 'react';

const LocationSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions from Photon API
  const fetchSuggestions = async (q: string) => {
    setIsLoading(true);
    try {
        // Get suggestions from photon API with Lonodon preference
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=51.505&lon=-0.09`);
        const data = await res.json();
        setSuggestions(data.features || []);
    } catch {
        setSuggestions([]);
    }
    setIsLoading(false);
  };

  // Handle input changes with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(!!value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length > 1) {
      timeoutRef.current = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.properties.name || '');
    setShowSuggestions(false);
    // You can also pass the coordinates or other info here
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-1000">
      <input
        type="text"
        className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="Search for a place..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(!!query)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={`${s.properties.osm_id}-${idx}`}
              className="px-4 py-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-800"
              onClick={() => handleSuggestionClick(s)}
            >
              {s.properties.name}
              {s.properties.city ? `, ${s.properties.city}` : ""}
              {s.properties.country ? `, ${s.properties.country}` : ""}
            </li>
          ))}
        </ul>
      )}
      {isLoading && (
        <div className="absolute right-3 top-2 text-gray-400 text-xs">Loading...</div>
      )}
    </div>
  );
};

export default LocationSearch;