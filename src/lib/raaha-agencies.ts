
import type { Agency } from './raaha-agencies.schema';

export const initialRaahaAgencies: Agency[] = [
    {
        id: 'agency_01',
        name: 'Happy Homes Agency',
        description: 'Providing trusted domestic helpers for families across Oman for over 10 years.',
        logo: 'https://placehold.co/100x100/3498db/ffffff/png?text=HHA',
        contactEmail: 'contact@happyhomes.om',
        contactPhone: '+968 2447 1234',
        primaryColor: 'hsl(207, 70%, 50%)',
    },
    {
        id: 'agency_02',
        name: 'Premier Maids',
        description: 'Specializing in highly-trained, professional domestic staff for high-end residences.',
        logo: 'https://placehold.co/100x100/e74c3c/ffffff/png?text=PM',
        contactEmail: 'info@premiermaids.net',
        contactPhone: '+968 2447 5678',
        primaryColor: 'hsl(354, 70%, 54%)',
    }
];
