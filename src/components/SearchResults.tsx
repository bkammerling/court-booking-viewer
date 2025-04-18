'use client';

const SearchResults = ({ data }: { data: any }) => {
  if (!data) {
      return <p>No results to display.</p>;
  }

  const allSessions = data.flatMap(( venue:any ) => venue.venueSessions);
  console.log(allSessions);
  // Check if allSessions is empty
  if (allSessions.length === 0) {
    return <p>No courts available. Try selecting more courts or a different day.</p>;
  }


  return (
    <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Venue Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Free Sessions</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                </tr>
            </thead>
            <tbody>
                {data.map((venueData: any) => (
                    <tr key={venueData.venue}>
                        <td className="border border-gray-300 px-4 py-2">
                          <a href={venueData.bookingUrl} target="_blank" className="text-blue-500 hover:underline">
                            {venueData.venue}
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
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default SearchResults;