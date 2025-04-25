'use client';
import { useState } from 'react';
import CourtForm from './CourtForm';
import SearchResults from './SearchResults';

const CourtBooking = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const handleSearch = async (selectedVenues: string[], selectedDate: string) => {
        setIsFetching(true);
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
        setIsFetching(false);
    };

    return (
        <div>
          <div className="">
            <CourtForm onSearch={handleSearch} isFetching={isFetching} />
            <SearchResults data={searchResults} />
          </div>
        </div>
    );
};

export default CourtBooking;