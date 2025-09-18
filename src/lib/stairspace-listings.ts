
import type { StairspaceListing } from './stairspace.schema';

export const initialStairspaceListings: StairspaceListing[] = [
    {
        id: 'stair_1',
        title: 'High-Traffic Spot near Cinema',
        location: 'Avenues Mall, Muscat',
        price: 'OMR 50 / day',
        imageUrl: 'https://images.unsplash.com/photo-1588507652933-2c6d2e4a8a8c?q=80&w=600&auto=format&fit=crop',
        aiHint: 'modern mall interior',
        tags: ['Retail', 'High Foot Traffic', 'Promotional'],
    },
    {
        id: 'stair_2',
        title: 'Cozy Corner for Art Display',
        location: 'Opera Galleria, Muscat',
        price: 'OMR 35 / day',
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1a730016e3d0?q=80&w=600&auto=format&fit=crop',
        aiHint: 'art gallery space',
        tags: ['Art', 'Exhibition', 'Quiet'],
    },
    {
        id: 'stair_3',
        title: 'Secure Micro-Storage',
        location: 'Al Ghubra Residential Complex',
        price: 'OMR 80 / month',
        imageUrl: 'https://images.unsplash.com/photo-1598632621746-9f42b3b05b38?q=80&w=600&auto=format&fit=crop',
        aiHint: 'storage units',
        tags: ['Storage', 'Secure', '24/7 Access'],
    }
];
