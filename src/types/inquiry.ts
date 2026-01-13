export type Phase = "new" | "sent_to_hotels" | "offers_received" | "completed" 
export type Inquiry = {
    id: string;
    clientName: string;
    contactPerson: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    potentialValue: number;
    phase: Phase;
    hotels: string[];
    notes: string;
    createdAt: string;
    updatedAt: string;
}