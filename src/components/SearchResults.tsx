'use client';
import { useState } from 'react';
import VenueCard from './VenueCard';
import venues from '@/venues.json';
import { CourtAvailability, Venue } from '@/types';

const SearchResults = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
  const [isGridView, setIsGridView] = useState(true);

  // Check if data is null or undefined
  if (!data && !isLoading) {
      return;
  }

  if(isLoading) {
    return (
      <div className="flex justify-center items-center pt-20">
        <svg 
            viewBox="0 0 19 19" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`h-32 w-32 fill-current text-yellow-400 ${isLoading ? 'animate-spin' : ''}`}
        >
            <path d="M3.03094 2.56443C0.524809 5.07057 0.233398 7.51842 0.233398 7.51842C0.233398 7.51842 3.91895 8.38793 6.50386 5.50256C8.7426 3.00359 7.86837 0.116577 7.86837 0.116577C7.86837 0.116577 4.83769 0.757682 3.03094 2.56443Z" fill=""/>
            <path d="M16.0794 16.3837C18.5855 13.8776 18.877 11.4297 18.877 11.4297C18.877 11.4297 15.1914 10.5602 12.6065 13.4456C10.3678 15.9445 11.242 18.8315 11.242 18.8315C11.242 18.8315 14.2727 18.1904 16.0794 16.3837Z" fill=""/>
            <path d="M3.03081 16.6104C0.559645 14.6988 -0.0192912 10.8016 0.0584184 9.20859C1.55433 9.38344 5.10566 8.98712 7.3437 6.93558C9.58174 4.88405 9.7527 1.53476 9.55842 0C10.9572 0.194274 13.8363 0.594479 16.0278 2.50613C18.2192 4.41779 19.039 8.27607 18.9419 9.73313C17.6208 9.46115 14.3259 9.5 11.7149 11.8313C9.10382 14.1626 9.1893 17.5818 9.55842 19C8.37335 18.9223 5.50198 18.5221 3.03081 16.6104Z" fill=""/>
        </svg>
      </div>
    )
  }

  const allSessions = data.flatMap(( venue:any ) => venue.venueSessions);
  // Check if allSessions is empty
  if (allSessions.length === 0) {
    return <p>No courts available. Try selecting more courts or a different day.</p>;
  }


  return (
    // Button group to toggle between grid and table view
    <>
    <div className="flex justify-end mb-4">
      <button
        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-l flex items-center ${isGridView ? 'bg-gray-300' : 'cursor-pointer'}`}
        onClick={() => setIsGridView(true)}
      >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 -960 960 960"
            className="h-4 w-4 fill-current mr-2 inline"
          >
            <path d="M80-560v-320h320v320H80Zm80-80h160v-160H160v160ZM80-80v-320h320v320H80Zm80-80h160v-160H160v160Zm400-400v-320h320v320H560Zm80-80h160v-160H640v160ZM560-80v-320h320v320H560Zm80-80h160v-160H640v160ZM320-640Zm0 320Zm320-320Zm0 320Z" />
          </svg>
        Grid View
      </button>
      <button 
        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-r flex items-center ${!isGridView ? 'bg-gray-300' : 'cursor-pointer'}`}
        onClick={() => setIsGridView(false)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 -960 960 960"
          className="h-6 w-6 fill-current mr-2 inline"
        >
          <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
        </svg>
        Table View
      </button>
    </div>
    { isGridView ? (
      <ResultsGrid data={data} />
    ) : (
      <ResultsTable data={data} />
    )}
    </>
  );
};

const ResultsGrid = ({ data }: { data: any }) => {
  return (
    <div className={`${
        data.length <= 10
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' // Row layout for 2 or fewer items
          : 'gap-4 columns-2 md:columns-3 lg:columns-4' // Masonry layout for more than 2 items
      }`}>
      { data.map((venueData: CourtAvailability) => {
        const venue = venues.find((venue: Venue) => venue.slug == venueData.courtSlug);
        // Check if venueData.venueSessions is empty
        if (!venue) {
          return null; // Skip if venue is not found
        }
        return (
          <div className="flex-grow basis-[calc(25%-1rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(25%-1rem)]">
            <VenueCard key={venue.slug} venue={venue} availability={venueData} />
          </div>
        );
      })}
    </div>
  );
}

const ResultsTable = ({ data }: { data: any }) => {
  return (
    <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 px-4 py-2 text-left">Venue Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Available Sessions</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                </tr>
            </thead>
            <tbody>
                {data.map((venueData: CourtAvailability) => {
                  const venue = venues.find((venue: Venue) => venue.slug == venueData.courtSlug) || { name: venueData.courtSlug };
                  // Check if venueData.venueSessions is empty
                  return (
                  <tr key={venueData.courtSlug}>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href={venueData.bookingUrl} target="_blank" className="text-yellow-500 hover:underline">
                          { venue.name }
                        </a>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 min-w-min">
                        { venueData.availableSlots.length > 0 ? (
                            venueData.availableSlots.map((session: any, index: number) => (
                                <div key={index}>
                                    {session.start} - {session.end}
                                </div>
                            ))
                          ):(
                            <div className="text-gray-500">No available sessions</div>
                          )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                          {venueData.availableSlots.map((session: any, index: number) => (
                              <div key={index}>£{session.cost.toFixed(2)}</div>
                          ))}
                      </td>
                  </tr>
                  )
                })}
            </tbody>
        </table>
    </div>
  );

}

export default SearchResults;