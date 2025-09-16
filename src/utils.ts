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


/*
* @description This function generates a URL for the booking page of a venue.
* @param {string} slug - The slug of the venue.
* @param {string} provider - The booking platform of the venue, e.g., 'lta'.
* @param {string} date - The date for which to fetch sessions, formatted as 'YYYY-MM-DD'.
* @returns {string} The complete URL for booking a court.
*/

export function getVenueBookingUrl(slug: string, provider: string, date: string): string {
    switch (provider) {
        case "lta":
            return `https://clubspark.lta.org.uk/${slug}/Booking/BookByDate#?date=${date}`;
        default:
            return `https://clubspark.lta.org.uk/${slug}/Booking/BookByDate#?date=${date}`;
    }
}

/*
* @description Calculate the distance between two points using Haversine formula
* @param {number} lat1 - Latitude of the first point
* @param {number} lon1 - Longitude of the first point  
* @param {number} lat2 - Latitude of the second point
* @param {number} lon2 - Longitude of the second point
* @returns {number} Distance in kilometers
*/
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/*
* @description Parse lat/lng string from venue data
* @param {string} latlng - String in format "lat,lng"
* @returns {object} Object with lat and lng properties
*/
export function parseLatLng(latlng: string): { lat: number; lng: number } {
    const [lat, lng] = latlng.split(',').map(Number);
    return { lat, lng };
}
