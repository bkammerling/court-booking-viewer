'use client';
import { useState } from 'react';
import { Venue } from '@/types';
import venuesJson from '@/venues.json';
import { getVenueSessionsUrl } from '@/utils';

/* 
 * Renders a court selection form from our venues.json file
*/

const CourtForm = () => {
    // Group venues by area
    const groupedVenues = venuesJson.reduce((acc: { [key: string]: Venue[] }, venue: Venue) => {
        const area = venue.area || 'Unknown'; // Default to 'Unknown' if no area is provided
        if (!acc[area]) acc[area] = [];
        acc[area].push(venue);
        return acc;
    }, {});

    // Create a state object to manage venues with their slug and a boolean
    const [selectedVenues, setSelectedVenues] = useState<Record<string, boolean>>({});

    const handleCheckboxChange = (venueSlug: string) => {
        setSelectedVenues((prev) => ({
        ...prev,
        [venueSlug]: !prev[venueSlug],
        }));
    };

    const handleSearch = async () => {
        const selectedVenuesArray = Object.entries(selectedVenues)
            .filter(([_, isSelected]) => isSelected)
            .map(([venueSlug]) => venueSlug);

        if (selectedVenuesArray.length === 0) {
            alert('Please select at least one venue.');
            return;
        }

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        const params = new URLSearchParams();
        params.append('slugs', selectedVenuesArray.join(','));
        params.append('date', formattedDate);
        params.append('provider', 'lta'); // Assuming 'lta' is the provider for all venues
        console.log(`/api/venues?${params.toString()}`);
        // Fetch data from the API
        const response = await fetch(`/api/venues?${params.toString()}`);
        const data = await response.json();
        console.log('Selected venues data:', data);
       
    }

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">Select tennis courts</h2>
            <div className="space-y-4">
                {Object.entries(groupedVenues).map(([area, venues]) => (
                <div key={area} className="rounded shadow w-80">
                    <button
                        type="button"
                        className="w-full text-left px-4 py-2 bg-gray-100 font-semibold"
                        onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling;
                            if (content) content.classList.toggle('hidden');
                        }}
                    >
                    {area}
                    </button>
                    <div className="hidden px-4 py-2 transition">
                    {venues.map((venue) => (
                        <div key={venue.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`venue-${venue.id}`}
                            checked={!!selectedVenues[venue.slug]}
                            onChange={() => handleCheckboxChange(venue.slug)}
                        />
                        <label htmlFor={`venue-${venue.id}`}>{venue.name}</label>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
                <button 
                    className="mt-4 px-5 py-2 bg-yellow-300 hover:bg-yellow-400 cursor-pointer transition rounded"
                    onClick={() => handleSearch()}
                >
                    Search 
                </button>
            </div>
        </div>        
    )
}

export default CourtForm;