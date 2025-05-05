'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import venuesJson from "@/venues.json"; 


// Fix for default marker icons not displaying correctly (needs 'require')
const markerIcon = require("leaflet/dist/images/marker-icon.png");
const markerShadow = require("leaflet/dist/images/marker-shadow.png");

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41], // Adjust anchor to center the marker properly
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapCourts = () => {
  const map = useMap()
  // Get users current location using browser
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
    map.setView([position.coords.latitude, position.coords.longitude], 13); // Set map view to user's location
  });
  return null;
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
      <MapCourts />
      
      { venuesJson.map((venue) => {
        const [ latitude, longitude ] = venue.latlng.split(",").map(Number);
        return (
          <Marker position={[latitude, longitude]} key={venue.name}>
            <Popup>
              <div>
                <h3 className="font-semibold">{venue.name}</h3>
                <p>Courts: {venue.courts}</p>
                <p>Floodlit: {venue.floodlitcourts}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
    </MapContainer>
  );
};

export default Map;