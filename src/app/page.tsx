'use client';
import { useState } from "react";
import CourtList from "@/components/CourtList";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [mapView, setMapView] = useState(true);

  return (
    <>
      { mapView ? (
          <Map />
       ) : (
        <div className="py-10 px-4 md:px-8">
          <CourtList  /> 
        </div>
       )}

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
        <button
          onClick={() => setMapView(!mapView)}
          aria-label="Switch to list view"
          className="px-5 py-3 bg-gray-100 rounded-full shadow-lg hover:bg-gray-200 cursor-pointer flex items-center gap-2 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          { mapView ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M144-528v-288h288v288H144Zm0 384v-288h288v288H144Zm384-384v-288h288v288H528Zm0 384v-288h288v288H528ZM216-600h144v-144H216v144Zm384 0h144v-144H600v144Zm0 384h144v-144H600v144Zm-384 0h144v-144H216v144Zm384-384Zm0 240Zm-240 0Zm0-240Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m600-144-240-72-153 51q-23 8-43-6t-20-40v-498q0-16 9.5-28.5T177-755l183-61 240 72 153-51q23-10 43 5t20 41v498q0 16-9 29t-24 17l-183 61Zm-36-86v-450l-168-50v450l168 50Zm72-2 108-36v-448l-108 36v448Zm-420-12 108-36v-448l-108 36v448Zm420-436v448-448Zm-312-48v448-448Z"/></svg>
          )}
          { mapView ? "Card" : "Map"} View
        </button>
      </div>
    </>
  );
}
