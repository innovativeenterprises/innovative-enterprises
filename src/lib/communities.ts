
export interface Community {
    id: string;
    name: string;
    description: string;
}

export const initialCommunities: Community[] = [
    { id: 'comm_01', name: 'Omani Students Society UK', description: 'A society for Omani students studying in the United Kingdom.' },
    { id: 'comm_02', name: 'Indian Social Club - Muscat', description: 'One of the largest social clubs for the Indian diaspora in Oman.' },
];
