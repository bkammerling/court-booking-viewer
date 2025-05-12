'use client';
import { useState } from "react";
import venues from "@/venues.json";
import VenueCard from "@/components/VenueCard";

export default function MyCourts() {
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Extract unique areas from venues.json
  const areas = Array.from(new Set(venues.map((venue) => venue.area)));

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-10">My courts</h1>
      <p className="text-lg my-3">
        Select your favourite courts and book them easily.
      </p>
      

      

    </div>
  );
}
