import { getVenueSessionsUrl, getVenueBookingUrl } from '@/utils';
import { Slot, CourtAvailability } from '@/types';

export async function GET(request: Request) {
    
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get('slugs');
    if (!slugsParam) {
      return new Response(JSON.stringify({ error: 'Missing required parameter: slugs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const slugs = slugsParam.split(',');
    const provider = searchParams.get('provider') || 'lta'; // Default to 'lta' if not provided
    const formattedDate = searchParams.get('date') || new Date().toISOString().split('T')[0]; // Default to today if not provided

    try {

      const resourceDataArray = await Promise.all(
        slugs.map(async (venueSlug: string) => {
  
          const url = getVenueSessionsUrl(venueSlug, provider, formattedDate);
          const response = await fetch(url, {
            next: {
              revalidate: 900, // 15 mins
            },
          });
  
          if (!response.ok) {
            return { sessions: null, error: true };
          }
  
          const sessions = await response.json();
          return { sessions, venueSlug, error: false };
        })
      );

      const sessionData = resourceDataArray.map((resourceData) => { 
        if(!resourceData.venueSlug || resourceData.error) return;
        const availableSlots = getAvailableSessions(resourceData.sessions, formattedDate);
        const bookingUrl = getVenueBookingUrl(resourceData.venueSlug, provider, formattedDate);
        return { courtSlug: resourceData.venueSlug, availableSlots, bookingUrl };
      })
      

      return new Response(JSON.stringify(sessionData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) { 
      console.error('Error fetching venue sessions:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch venue sessions' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
}

// Function to get available sessions for a single venue

const getAvailableSessions = (resourceData: any, formattedDate: string) => {
  // check if formatted date is today
  const isToday = new Date(formattedDate).toDateString() === new Date().toDateString();
  const currentTimeInMinutes = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : 0;

  const allCourtsAvailability: CourtAvailability[] = [];

  resourceData.Resources.forEach((court: any) => {
    // Only consider courts that are standard size
    if (court.Size !== 0) return;
    // For this court, collect its available sessions
    const courtAvailable = court.Days.flatMap((day: any) => 
      day.Sessions.filter((session: any) => session.Capacity >= 1 && session.StartTime >= currentTimeInMinutes)
      .map((session: any) => ({
        start: session.StartTime,
        end: session.EndTime,
        cost: session.Cost
      }))
    );

    console.log(courtAvailable);

    allCourtsAvailability.push({
      courtSlug: court.Name,
      availableSlots: courtAvailable
    });
  });



  const allAvailableSlots = allCourtsAvailability.flatMap(
    court => court.availableSlots
  );

  if (allAvailableSlots.length === 0) {
    return [];
  }
  
  // Merge overlapping/adjacent slots across courts
  const mergedAvailableSlots = mergeTimeSlots(allAvailableSlots);

  const formattedSlots = mergedAvailableSlots
  .filter(slot => slot.end - slot.start >= 30) // Filter out slots less than 30 minutes
  .map(slot => ({
    start: minutesToHHMM(slot.start),
    end: minutesToHHMM(slot.end),
    cost: slot.cost,
    duration: slot.end - slot.start
  }));

  return formattedSlots;

}


// Utility function
const minutesToHHMM = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

const mergeTimeSlots = (slots: Slot[]): Slot[] => {
  // Sort by start time
  slots.sort((a, b) => a.start - b.start);

  // Merge overlapping intervals
  const merged: Slot[] = [];
  let current = slots[0];

  for (const slot of slots) {
    // Check if the current slot overlaps with the last merged slot
    if (slot.start <= current.end) {
      // Merge the slots by extending the end time
      current.end = Math.max(current.end, slot.end);
    } else {
      // If not overlapping, push the current slot to merged and start a new one
      merged.push(current);
      current = slot;
    }
  }
  // Push the last merged slot
  merged.push(current);

  return merged;
};

/*  
* Example output of LTA API call
{
  TimeZone: "Europe/London",
  EarliestStartTime: 420,
  LatestEndTime: 1320,
  MinimumInterval: 30,
  HideResourceProperties: false,
  ResourceGroups: [
  {
    ID: "12e87a80-3f5f-4985-9e81-eb064ba8f71b",
    Name: "default",
    SortOrder: 0,
    HideResourceProperties: false
  }],
  Resources: [{
    ID: "4869094a-872f-4b0d-be61-a5da0a05e90b",
    ResourceGroupID: "12e87a80-3f5f-4985-9e81-eb064ba8f71b",
    Name: "Crt 1",
    Number: 0,
    Location: 0,
    Lighting: 1,
    Surface: 7,
    Size: 0,
    Category: 1,
    Days: [{
      Date: "2025-04-17T00:00:00",
      Sessions: [{
        ID: "fe40360f-84c8-48fe-ae72-043acacf48ed",
        Category: 1000,
        SubCategory: 0,
        Name: "Booking",
        Colour: "#fcfabd",
        StartTime: 420,
        EndTime: 480,
        Interval: 60,
        IsCompletedEarly: false,
        MaxSinglesSlots: 0,
        MaxDoublesSlots: 0,
        Capacity: 0,
        Recurrence: false,
        CostFrom: 0,
        CourtCost: 7.2,
        LightingCost: 0,
        MemberPrice: 0,
        GuestPrice: 0
      }
      ...more sessions]
    }
    ...more days (if requested)]
  }
  ...more courts]
}
*/