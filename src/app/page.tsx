'use client';
import { useState } from "react";
import LocationSearch from "@/components/LocationSearch";
import DateSelector from "@/components/DateSelector";
import VenueCard from "@/components/VenueCard";
import { CourtAvailability, Venue } from "@/types";
import { calculateDistance, parseLatLng } from "@/utils";
import venuesJson from "@/venues.json";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nearbyVenues, setNearbyVenues] = useState<{ venue: Venue; availability: CourtAvailability }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLocationSelect = (location: string, coordinates?: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setSelectedCoordinates(coordinates || null);
    setHasSearched(false);
  };

  const handleSearch = async (firstSearch: boolean) => {
    if (!selectedLocation || !selectedCoordinates) {
      alert('Please select a location first.');
      return;
    }

    setIsSearching(true);

    // Calculate distances and get 8 closest venues
    const venuesWithDistance = venuesJson.map((venue: Venue) => {
      const venueCoords = parseLatLng(venue.latlng);
      const distance = calculateDistance(
        selectedCoordinates.lat,
        selectedCoordinates.lng,
        venueCoords.lat,
        venueCoords.lng
      );
      return { ...venue, distance };
    });

    const sliceFrom = firstSearch ? 0 : nearbyVenues.length;

    // Sort by distance and take top 8
    const closestVenues = venuesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(sliceFrom, sliceFrom + 8);

    // Get availability for these venues
    const params = new URLSearchParams({
      slugs: closestVenues.map(venue => venue.slug).join(','),
      date: selectedDate,
      provider: 'lta',
    });

    const response = await fetch(`/api/venues?${params.toString()}`);
    const availabilityData = await response.json();
    const closestVenuesWithAvailability = closestVenues.map(venue => {
      const availability = availabilityData.sessionData?.find((item: any) => item.courtSlug === venue.slug);
      return { venue, availability };
    });
    setNearbyVenues(prev => [...prev, ...closestVenuesWithAvailability]);
    setHasSearched(true);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 container  max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect
            <span className="text-yellow-500"> Court</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover tennis courts near you. Search by location and find the closest available courts.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Location Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Where do you want to play?
              </label>
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                placeholder="Search for a location or use current location"
              />
            </div>

            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              showLabel={true}
              className=""
            />

            {/* Search Button */}
            <button
              onClick={() => handleSearch(true)}
              disabled={isSearching || !selectedLocation}
              className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-full font-semibold flex items-center justify-center gap-2 text-lg transition ${
                isSearching || !selectedLocation ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  Searching nearby courts...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>
                  Find Nearby Courts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="md:px-2 lg:px-10 xl:px-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {nearbyVenues.length > 0 ? (
                <>Closest Courts to <span className="text-yellow-500">{selectedLocation}</span></>
              ) : (
                'No courts found'
              )}
            </h2>
            
            {nearbyVenues.length > 0 ? (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {nearbyVenues.map((venue) => (
                  <VenueCard key={venue.venue.id} venue={venue.venue} availability={venue.availability} />
                ))}
              </div>
              { venuesJson.length > nearbyVenues.length + 8 && (
                <button 
                  className="mt-8 py-4 px-6 rounded-lg border border-yellow-500 dark:border-yellow-300 text-black dark:text-gray-200 hover:bg-yellow-400 dark:hover:bg-yellow-500 dark:hover:text-black cursor-pointer transition mx-auto block"
                  onClick={() => handleSearch(false)}>
                  View More Courts
                </button>
              )}
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  No courts found near this location. Try searching for a different area.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
