
export interface CommunityEvent {
    id: string;
    communityId: string;
    title: string;
    date: string;
    location: string;
}

export const initialEvents: CommunityEvent[] = [
    { id: 'event_01', communityId: 'comm_01', title: 'Annual General Meeting', date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), location: 'Online (Zoom)' },
    { id: 'event_02', communityId: 'comm_02', title: 'Diwali Gala Dinner', date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), location: 'ISC Main Hall, Muscat' },
];

