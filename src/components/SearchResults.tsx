'use client';
import venues from '@/venues.json';
import { Venue } from '@/types';

const SearchResults = ({ data }: { data: any }) => {
  if (!data) {
      return <p>No results to display.</p>;
  }

  const allSessions = data.flatMap(( venue:any ) => venue.venueSessions);
  // Check if allSessions is empty
  if (allSessions.length === 0) {
    return <p>No courts available. Try selecting more courts or a different day.</p>;
  }

  return (
    <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 px-4 py-2 text-left">Venue Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Free Sessions</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                </tr>
            </thead>
            <tbody>
                {data.map((venueData: any) => {
                  const venue = venues.find((venue: Venue) => venue.slug == venueData.venue) || { name: venueData.venue };
                  // Check if venueData.venueSessions is empty
                  if (!venueData.venueSessions || venueData.venueSessions.length === 0) return;
                  return (
                  <tr key={venueData.venue}>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href={venueData.bookingUrl} target="_blank" className="text-yellow-500 hover:underline">
                          { venue.name }
                        </a>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                          {venueData.venueSessions.map((session: any, index: number) => (
                              <div key={index}>
                                  {session.start} - {session.end}
                              </div>
                          ))}
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
};

export default SearchResults;