'use client';
import { useState } from 'react';
import venues from '@/venues.json';
import { Venue } from '@/types';

const SearchResults = ({ data }: { data: any }) => {
  const [isGridView, setIsGridView] = useState(true);

  // Check if data is null or undefined
  if (!data) {
      return <p>No results to display.</p>;
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
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-l"
        onClick={() => setIsGridView(true)}
      >
        Grid View
      </button>
      <button 
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-r"
        onClick={() => setIsGridView(false)}
      >
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
  const fallbackImage = "/courts/random-tennis-court.webp";
  return (
    <div className="overflow-x-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      { data.map((venueData: any) => {
        const venue = venues.find((venue: Venue) => venue.slug == venueData.venue) || { name: venueData.venue };
        // Check if venueData.venueSessions is empty
        return (
          <div key={venueData.venue} className="shadow-lg mb-4">
            <img 
              src={`/courts/${venueData.venue}.jpg`} 
              alt={venue.name} 
              className="w-full h-32 object-cover" 
              onError={(e) => (e.currentTarget.src = fallbackImage)}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">
                <a href={venueData.bookingUrl} target="_blank" className="text-yellow-500 hover:underline">
                  { venue.name }
                </a>
              </h3>
              <div>
                { venueData.venueSessions.length > 0 ? (
                  venueData.venueSessions.map((session: any, index: number) => (
                    <div key={index}>
                      {session.start} - {session.end}
                    </div>
                  )) 
                  ):(
                    <div className="text-gray-500">No available sessions</div>
                  )
                }
              </div>
              <a
                className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer transition rounded flex items-center gap-3"
                href={venueData.bookingUrl}
              >
                Search 
              </a>
            </div>
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
                {data.map((venueData: any) => {
                  const venue = venues.find((venue: Venue) => venue.slug == venueData.venue) || { name: venueData.venue };
                  // Check if venueData.venueSessions is empty
                  return (
                  <tr key={venueData.venue}>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href={venueData.bookingUrl} target="_blank" className="text-yellow-500 hover:underline">
                          { venue.name }
                        </a>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 min-w-min">
                        { venueData.venueSessions.length > 0 ? (
                            venueData.venueSessions.map((session: any, index: number) => (
                                <div key={index}>
                                    {session.start} - {session.end}
                                </div>
                            ))
                          ):(
                            <div className="text-gray-500">No available sessions</div>
                          )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                          {venueData.venueSessions.map((session: any, index: number) => (
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