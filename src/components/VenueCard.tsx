import { Venue, CourtAvailability } from "@/types";
import { getVenueBookingUrl } from "@/utils";

const VenueCard = ({ venue, availability }: { venue: Venue, availability?: CourtAvailability }) => {
  // Check if the venue has a booking URL
  const bookingUrl = availability?.bookingUrl || getVenueBookingUrl(venue.slug, venue.provider, new Date().toISOString().split('T')[0]);
  const fallbackImage = "/courts/random-tennis-court.webp";
  return (
  <div key={venue.slug} className="min-h-[200px] min-w-[200px] flex flex-col w-full mb-5 h-full rounded-lg shadow-lg dark:bg-black ">
      <img 
        src={`/courts/${venue.slug}.jpg`} 
        alt={venue.name} 
        className="object-cover rounded-t-lg row-span-1 w-full court-card-image" 
        onError={(e) => (e.currentTarget.src = fallbackImage)}
      />
      <div className="flex flex-col flex-grow justify-between">
        <div className="p-3">
          <p className="text-xs uppercase">{venue.area}</p>
          <h3 className="font-bold mb-1">{ venue.name }</h3>
          { availability && 
            <div className="sessions">
              {  availability.availableSlots.length > 0 ? (
                availability.availableSlots.map((session: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {session.start} - {session.end}
                  </div>
                )) 
                ):(
                  <div className="text-sm text-gray-600 dark:text-gray-300">No available sessions</div>
                )
              }
            </div>
          }

        </div>
        <a
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer transition rounded-b-lg w-full"
          href={ availability?.bookingUrl ? availability.bookingUrl : bookingUrl }
          target="_blank"
        >
          Book on LTA 
        </a>
      </div>
    </div>
  );
}

export default VenueCard;