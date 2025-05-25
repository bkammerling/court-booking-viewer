import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import VenueCard from "@/components/VenueCard";
import venues from "@/venues.json";
import { Filter } from "@/types";


const CourtList = ({ customFilter }: { customFilter?: Filter }) => {
  const [filter, setFilter] = useState(customFilter || {
    area: "",
    favorite: false,
    floodlit: false,
  });
  const { favorites } = useFavorites();

  // Get unique areas
  const areas = Array.from(new Set(venues.map(v => v.area)));

  return (
    <>
      {/* Styled Native Select Dropdown */}
      <div className="mb-5 w-64 relative">
        <select
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-left shadow-sm transition appearance-none pr-10"
          value={filter.area}
          onChange={e => setFilter({ ...filter, area: e.target.value })}
        >
          <option value="">All Areas</option>
          {areas.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Add buttons for favorites and floodlit courts */}
      <div className="flex gap-4 mb-5">
        <button
          className={`px-4 py-2 rounded-full ${filter.favorite ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          onClick={() => setFilter({ ...filter, favorite: !filter.favorite })}
        >
          
          Favorites
        </button>
        <button
          className={`px-4 py-2 rounded-full ${filter.floodlit ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
          onClick={() => setFilter({ ...filter, floodlit: !filter.floodlit })}
        >
          {filter.floodlit ? "Show All Courts" : "Show Floodlit Courts"}
        </button>
      </div>  

      {/* Venue Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        {venues
          .filter(venue => {
            // Filter by area
            const areaMatch = !filter.area || venue.area === filter.area;
            // Filter by favorite
            const favoriteMatch = !filter.favorite || favorites.includes(venue.slug);
            // Filter by floodlit
            const floodlitMatch = !filter.floodlit || venue.floodlitcourts > 0;
            return areaMatch && favoriteMatch && floodlitMatch;
          })  
          .map(venue => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
      </div>
    </>
  );
};

export default CourtList;