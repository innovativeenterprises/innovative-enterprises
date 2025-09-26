export interface CommunityFinance {
    id: string;
    communityId: string;
    date: string;
    description: string;
    type: 'Income' | 'Expense';
    category: 'Membership Dues' | 'Donation' | 'Event Ticket Sales' | 'Event Costs' | 'Operational Costs' | 'Charity Payout';
    amount: number;
}

export const initialCommunityFinances: CommunityFinance[] = [
    { id: 'fin_01', communityId: 'comm_01', date: new Date().toISOString(), description: 'Annual membership fees collection', type: 'Income', category: 'Membership Dues', amount: 500 },
    { id: 'fin_02', communityId: 'comm_02', date: new Date().toISOString(), description: 'Venue rental for Diwali Gala', type: 'Expense', category: 'Event Costs', amount: 1200 },
];
