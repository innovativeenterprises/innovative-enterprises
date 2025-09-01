
export interface Community {
    id: string;
    name: string;
    country: string;
    description: string;
    manager: string; // The name of the assigned manager
}

export const initialCommunities: Community[] = [
    {
        id: 'comm_1',
        name: 'Sudanese Community in Oman',
        country: 'Oman',
        description: 'A hub for the Sudanese expatriate community living and working in the Sultanate of Oman.',
        manager: 'ABDULJABBAR AL FAKI',
    },
    {
        id: 'comm_2',
        name: 'Omani Student Society in the UK',
        country: 'United Kingdom',
        description: 'Connecting Omani students studying across various universities in the United Kingdom.',
        manager: 'HUDA AL SALMI',
    },
    {
        id: 'comm_3',
        name: 'Egyptian Engineers Association - UAE',
        country: 'UAE',
        description: 'A professional network for Egyptian engineers based in the United Arab Emirates.',
        manager: 'ABDULJABBAR AL FAKI',
    }
];
