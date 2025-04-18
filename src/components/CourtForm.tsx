'use client';
import { useState } from 'react';
import { Venue } from '@/types';
import venuesJson from '@/venues.json';

/* 
 * Renders a court selection form from our venues.json file
*/

const CourtForm = ({ onSearch }: { onSearch: (selectedVenues: string[], selectedDate: string) => void }) => {
    // Create a state object to manage venues with their slug and a boolean
    const [selectedVenues, setSelectedVenues] = useState<Record<string, boolean>>({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Group venues by area
    const groupedVenues = venuesJson.reduce((acc: { [key: string]: Venue[] }, venue: Venue) => {
        const area = venue.area || 'Unknown'; // Default to 'Unknown' if no area is provided
        if (!acc[area]) acc[area] = [];
        acc[area].push(venue);
        return acc;
    }, {});

    const handleCheckboxChange = (venueSlug: string) => {
        setSelectedVenues((prev) => ({
        ...prev,
        [venueSlug]: !prev[venueSlug],
        }));
    };

    const handleSearchClick = () => {
        const selectedVenuesArray = Object.keys(selectedVenues).filter(
            (venueSlug) => selectedVenues[venueSlug]
        );

        if (selectedVenuesArray.length === 0) {
            alert('Please select at least one venue.');
            return;
        }

        onSearch(selectedVenuesArray, selectedDate); // Trigger the search function passed as a prop
    };

   
    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">When do you want to play?</h2>

            <div className="flex items-center mb-4">
                <label htmlFor="date" className="mr-2">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    className="border border-gray-300 rounded px-2 py-1"
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                    }}
                />
            </div>

            <h2 className="text-2xl font-bold mb-4">Select tennis courts</h2>
            
            <div className="space-y-4">
                {Object.entries(groupedVenues).map(([area, venues]) => (
                <div key={area} className="rounded shadow w-80">
                    <button
                        type="button"
                        className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold cursor-pointer transition rounded relative"
                        onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling;
                            if (content) content.classList.toggle('hidden');
                            const icon = e.currentTarget.querySelector('svg');
                            if (icon) icon.classList.toggle('rotate-180');
                        }}
                    >
                        {area}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 inline-block absolute right-4 top-3">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
                        </svg>
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
                    className="mt-4 px-5 py-2 bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer transition rounded flex items-center gap-3"
                    onClick={() => handleSearchClick()}
                >
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.03094 2.56443C0.524809 5.07057 0.233398 7.51842 0.233398 7.51842C0.233398 7.51842 3.91895 8.38793 6.50386 5.50256C8.7426 3.00359 7.86837 0.116577 7.86837 0.116577C7.86837 0.116577 4.83769 0.757682 3.03094 2.56443Z" fill="black"/>
                        <path d="M16.0794 16.3837C18.5855 13.8776 18.877 11.4297 18.877 11.4297C18.877 11.4297 15.1914 10.5602 12.6065 13.4456C10.3678 15.9445 11.242 18.8315 11.242 18.8315C11.242 18.8315 14.2727 18.1904 16.0794 16.3837Z" fill="black"/>
                        <path d="M3.03081 16.6104C0.559645 14.6988 -0.0192912 10.8016 0.0584184 9.20859C1.55433 9.38344 5.10566 8.98712 7.3437 6.93558C9.58174 4.88405 9.7527 1.53476 9.55842 0C10.9572 0.194274 13.8363 0.594479 16.0278 2.50613C18.2192 4.41779 19.039 8.27607 18.9419 9.73313C17.6208 9.46115 14.3259 9.5 11.7149 11.8313C9.10382 14.1626 9.1893 17.5818 9.55842 19C8.37335 18.9223 5.50198 18.5221 3.03081 16.6104Z" fill="black"/>
                    </svg>



                    Search 
                </button>
            </div>
        </div>        
    )
}

export default CourtForm;