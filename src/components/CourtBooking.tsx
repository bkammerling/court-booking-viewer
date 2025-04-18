'use client';
import { useState } from 'react';
import CourtForm from './CourtForm';
import SearchResults from './SearchResults';

const CourtBooking = () => {
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = async (selectedVenues: string[], selectedDate: string) => {
        const params = new URLSearchParams({
            slugs: selectedVenues.join(','),
            date: selectedDate,
            provider: 'lta',
        });

        try {
            const response = await fetch(`/api/venues?${params.toString()}`);
            const data = await response.json();
            console.log(data);
            setSearchResults(data); // Store the results in state
        } catch (error) {
            console.error('Error fetching venue data:', error);
        }
    };

    return (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CourtForm onSearch={handleSearch} />
            <SearchResults data={searchResults} />
          </div>
        </div>
    );
};

export default CourtBooking;