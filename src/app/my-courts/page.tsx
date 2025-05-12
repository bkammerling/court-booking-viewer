'use client';
import { useState } from "react";
import venues from "@/venues.json";
import VenueCard from "@/components/VenueCard";

export default function MyCourts() {
  // type of object with key as area and value as boolean
  type SelectedAreas = {
    [key: string]: boolean;
  };

  // Initialize selectedAreas state
  const [selectedAreas, setSelectedAreas] = useState<SelectedAreas>(() => {
    const areas: SelectedAreas = {};
    venues.forEach((venue) => {
      areas[venue.area] = false; // Default all areas to false
    });
    return areas;
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-10">My courts</h1>
      <p className="text-lg my-3">
        Select your favourite courts and book them easily.
      </p>

      {/* Show tags for each area which can be selected */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(selectedAreas).map((area) => (
          <div
            key={area}
            className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
              selectedAreas[area] ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setSelectedAreas({
                ...selectedAreas,
                [area]: !selectedAreas[area], // Toggle the selected state
              });
            }}
          >
            {area}
          </div>
        ))}
      </div>

      {/* Venue Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
        {venues
          .filter((venue) => {
            // Show venues only for selected areas
            const selected = Object.keys(selectedAreas).filter(
              (area) => selectedAreas[area]
            );
            return selected.length === 0 || selected.includes(venue.area);
          })
          .map((venue) => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
      </div>
    </div>
  );
}
