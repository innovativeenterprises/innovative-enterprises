
export interface CommunityFinance {
  id: string;
  date: string; // ISO Date string
  description: string;
  type: 'Income' | 'Expense';
  category: 'Membership Dues' | 'Donation' | 'Event Ticket Sales' | 'Event Costs' | 'Operational Costs' | 'Charity Payout';
  amount: number;
}

export const initialFinances: CommunityFinance[] = [
    {
        id: 'fin_1',
        date: '2024-07-01',
        description: 'Annual Membership Dues Collection',
        type: 'Income',
        category: 'Membership Dues',
        amount: 5250
    },
    {
        id: 'fin_2',
        date: '2024-07-15',
        description: 'Venue booking for Gala Dinner',
        type: 'Expense',
        category: 'Event Costs',
        amount: 1500
    },
    {
        id: 'fin_3',
        date: '2024-07-20',
        description: 'Donation from Corporate Partner',
        type: 'Income',
        category: 'Donation',
        amount: 2000
    },
    {
        id: 'fin_4',
        date: '2024-07-25',
        description: 'Website hosting and maintenance',
        type: 'Expense',
        category: 'Operational Costs',
        amount: 120
    }
];
