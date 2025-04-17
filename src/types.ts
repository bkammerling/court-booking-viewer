export interface Venue {
    id: string;
    name: string;
    slug: string;
    provider: string;
    area: string;
    courts: number;
}

export interface Slot {
    start: number;
    end: number;
    cost: number;
}

export interface CourtAvailability {
    courtName: string;
    availableSlots: Slot[];
  }
  