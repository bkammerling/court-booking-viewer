import FavoriteIcon from "./global/FavoriteIcon";
import { Venue, CourtAvailability } from "@/types";
import { getVenueBookingUrl } from "@/utils";

const VenueCard = ({ venue, availability }: { venue: Venue, availability?: CourtAvailability }) => {
  // Check if the venue has a booking URL
  const bookingUrl = availability?.bookingUrl || getVenueBookingUrl(venue.slug, venue.provider, new Date().toISOString().split('T')[0]);
  const fallbackImage = "/courts/random-tennis-court.webp";
  return (
  <div key={venue.slug} className="min-h-[200px] min-w-[180px] flex flex-col w-full mb-5 h-full rounded-lg shadow-lg dark:bg-black relative">
      <img 
        src={`/courts/${venue.slug}.jpg`} 
        alt={venue.name} 
        className={`object-cover rounded-t-lg row-span-1 w-full court-card-image ${availability?.availableSlots.length === 0 ? 'grayscale' : ''}`} 
        onError={(e) => (e.currentTarget.src = fallbackImage)}
      />
      <div className="flex flex-col flex-grow justify-between">
        <div className="p-3">
          <p className="text-xs uppercase">{venue.area}</p>
          <h3 className={`font-bold h4 ${venue.distance ? '' : 'mb-1'}`}>{ venue.name }</h3>
          { venue.distance && 
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{venue.distance.toFixed(1)}km away</p>
          }

          { !availability &&
            <div className="mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>
              <span className="ml-1 mr-3">{venue.courts}</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
              <span className="ml-1">{venue.floodlitcourts}</span>
            </div>
          }
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
          className={`px-5 py-2 ${availability.availableSlots.length > 0 ? 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-black  transition rounded-b-lg w-full`}
          href={ availability?.bookingUrl ? availability.bookingUrl : bookingUrl }
          target="_blank"
        >
          Book on LTA 
        </a>
      </div>
      <div className="absolute top-0 right-0 m-2 w-[24px] h-[24px] flex items-center justify-center">
        <FavoriteIcon slug={venue.slug} />
      </div>
    </div>
  );
}

export default VenueCard;