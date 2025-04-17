// Add comment block explaining function

/*
* @description This function generates a URL for fetching venue sessions.
* @param {string} slug - The slug of the venue.
* @param {string} provider - The booking platform of the venue, e.g., 'lta'.
* @param {string} date - The date for which to fetch sessions, formatted as 'YYYY-MM-DD'.
* @returns {string} The complete URL for fetching venue sessions.
*/

export function getVenueSessionsUrl(slug: string, provider: string, date: string): string {
    switch (provider) {
        case "lta":
            return `https://clubspark.lta.org.uk/v0/VenueBooking/${slug}/GetVenueSessions?startDate=${date}&endDate=${date}`;
        default:
            return `https://clubspark.lta.org.uk/v0/VenueBooking/${slug}/GetVenueSessions?startDate=${date}&endDate=${date}`;
    }
}
