'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import ImageWithFallback from "@/components/global/ImageWithFallback";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import venuesJson from "@/venues.json"; 


const createCourtIcon = (courts: number) => {
  return L.divIcon({
    className: 'court-marker',
    html: `<span class="courts-label">${courts}</span>`,
    iconAnchor: [12, 32], // Adjust anchor to center the marker properly
    popupAnchor: [5, -28],
  });
}


const createLocationIcon = () => {
  return L.divIcon({
    className: 'your-location',
    iconAnchor: [10, 10], // Adjust anchor to center the marker properly
  });
}

const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();
  if(!position) map.locate();
  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng)
      map.setView(e.latlng, 13);},
  })

  return position ? (
    <Marker position={position} icon={createLocationIcon()}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

const Map = () => {
  const [tilesURL, setTilesURL] = useState("https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png");
  // Check and track if html has class of 'dark
  useEffect(() => {
    const handleClassListChange = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setTilesURL(darkMode ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" : "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png");
    };

    handleClassListChange();
    // Observe changes to the class list
    const observer = new MutationObserver(handleClassListChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
 
    return () => observer.disconnect();
  }
  , []);

  // track changes to html classlist
  useEffect(() => {
    const handleClassListChange = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setTilesURL(darkMode ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" : "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png");
    };

    // Observe changes to the class list
    const observer = new MutationObserver(handleClassListChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} >
      <TileLayer
    	  attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tilesURL}
      />

      { venuesJson.map((venue) => {
        const [ latitude, longitude ] = venue.latlng.split(",").map(Number);
        const customIcon = createCourtIcon(venue.courts); // Create a custom icon for each venue
        return (
          <Marker position={[latitude, longitude]} key={venue.name} icon={customIcon}>
            <Popup>
              <div className="relative h-[100px] w-[200px]">
                <ImageWithFallback 
                  src={`/courts/sm/${venue.slug}.jpg`} 
                  alt={venue.name} 
                  className="rounded-t-xl"
                  fill
                  fallbackSrc="/courts/random-tennis-court.webp"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold">{venue.name}</h3>
                <div className="mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>
                  <span className="ml-1 mr-3">{venue.courts}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
                  <span className="ml-1">{venue.floodlitcourts}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

    <LocationMarker />  
    </MapContainer>
  );
};

export default Map;