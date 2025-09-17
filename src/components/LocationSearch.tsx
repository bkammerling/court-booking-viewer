'use client';
import { useState, useRef } from 'react';

interface LocationSearchProps {
  onLocationSelect?: (location: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
  showCurrentLocationButton?: boolean;
}

const LocationSearch = ({ 
  onLocationSelect, 
  placeholder = "Search for a place...",
  showCurrentLocationButton = true 
}: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get location name
          const res = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&radius=1`);
          const data = await res.json();
          
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const locationName = feature.properties.name || 
                               feature.properties.district || 
                               feature.properties.town || 
                               'Current Location';
            setQuery(locationName);
            if (onLocationSelect) {
              onLocationSelect(locationName, { lat: latitude, lng: longitude });
            }
          } else {
            setQuery('Current Location');
            if (onLocationSelect) {
              onLocationSelect('Current Location', { lat: latitude, lng: longitude });
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setQuery('Current Location');
          if (onLocationSelect) {
            onLocationSelect('Current Location', { lat: latitude, lng: longitude });
          }
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please search manually.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Fetch suggestions from Photon API
  const fetchSuggestions = async (q: string) => {
    setIsLoading(true);
    try {
        // Get suggestions from photon API with London preference
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=51.505&lon=-0.09&limit=5`);
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

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length > 1) {
      timeoutRef.current = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setSuggestions([]);
    }
  };

  // Handle when user selects from datalist
  const handleInputSelect = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    
    // Check if this value matches one of our suggestions
    const matchingSuggestion = suggestions.find(s => {
      const locationName = s.properties.name || s.properties.city || s.properties.town || '';
      return locationName === value;
    });

    if (matchingSuggestion) {
      // Clear suggestions and blur the input
      setSuggestions([]);
      inputRef.current?.blur();
      
      // Call the callback with coordinates
      if (onLocationSelect) {
        const coordinates = matchingSuggestion.geometry?.coordinates 
          ? { lat: matchingSuggestion.geometry.coordinates[1], lng: matchingSuggestion.geometry.coordinates[0] }
          : undefined;
        onLocationSelect(value, coordinates);
      }
    }
  };

  // Handle selection when user manually types and leaves input
  const handleInputBlur = () => {
    // Small delay to allow for datalist selection
    setTimeout(() => {
      const matchingSuggestion = suggestions.find(s => {
        const locationName = s.properties.name || s.properties.city || s.properties.town || '';
        return locationName === query;
      });

      if (matchingSuggestion && onLocationSelect) {
        const coordinates = matchingSuggestion.geometry?.coordinates 
          ? { lat: matchingSuggestion.geometry.coordinates[1], lng: matchingSuggestion.geometry.coordinates[0] }
          : undefined;
        onLocationSelect(query, coordinates);
      }
    }, 100);
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          list="location-suggestions"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onInput={handleInputSelect}
          onBlur={handleInputBlur}
          autoComplete="off"
        />
        
        <datalist id="location-suggestions">
          {suggestions.map((s, idx) => {
            const locationName = s.properties.name || s.properties.city || s.properties.town || '';
            const displayText = locationName + 
              (s.properties.city && s.properties.city !== locationName ? `, ${s.properties.city}` : '') +
              (s.properties.country ? `, ${s.properties.country}` : '');
            
            return (
              <option key={`${s.properties.osm_id}-${idx}`} value={locationName}>
                {displayText}
              </option>
            );
          })}
        </datalist>
        
        {showCurrentLocationButton && (
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            title="Use current location"
          >
            {isGettingLocation ? (
              <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="text-gray-600 dark:text-gray-400">
                <path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q109 0 184.5-75.5T740-460q0-109-75.5-184.5T480-720q-109 0-184.5 75.5T220-460q0 109 75.5 184.5T480-200Zm0-120q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T540-460q0-25-17.5-42.5T480-520q-25 0-42.5 17.5T420-460q0 25 17.5 42.5T480-400Zm0-60Z"/>
              </svg>
            )}
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute right-12 top-2 text-gray-400 text-xs">Loading...</div>
      )}
    </div>
  );
};

export default LocationSearch;
