
export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // ISO Date string 'YYYY-MM-DDTHH:mm:ss.sssZ'
  location: string;
  description?: string;
  rsvps: number;
}

export const initialEvents: CommunityEvent[] = [
    {
        id: "event_1",
        title: "Annual Community Gala Dinner",
        date: new Date(new Date().getFullYear(), 11, 15).toISOString(),
        location: "Grand Hyatt Muscat",
        description: "A formal event to celebrate the year's achievements and raise funds for charity.",
        rsvps: 128
    },
    {
        id: "event_2",
        title: "Family Fun Day & Sports Carnival",
        date: new Date(new Date().getFullYear(), 8, 20).toISOString(),
        location: "Qurum Natural Park",
        description: "A fun-filled day for all families with games, food stalls, and activities.",
        rsvps: 350
    },
    {
        id: "event_3",
        title: "Charity Auction for Education",
        date: new Date(new Date().getFullYear(), 9, 25).toISOString(),
        location: "Al Bustan Palace Hotel",
        description: "An auction of goods and services to raise funds for student scholarships.",
        rsvps: 75
    }
];
