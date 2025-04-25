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

export interface Option {
    readonly value: string;
    readonly label: string;
    readonly isDisabled?: boolean;
}

export interface GroupedOption {
    readonly label: string;
    readonly options: Option[];
}