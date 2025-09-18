
import type { UsedItem } from './used-items.schema';

export const initialUsedItems: UsedItem[] = [
    {
        id: 'item_1',
        name: 'Used iPhone 12',
        description: 'A slightly used iPhone 12, 128GB, in blue. No scratches on the screen. Battery health at 88%.',
        category: 'Electronics',
        condition: 'Used - Good',
        price: 150.00,
        imageUrl: 'https://images.unsplash.com/photo-1607936854259-c2b71bda4f8a?q=80&w=600&auto=format&fit=crop',
        seller: 'Ahmed Al-Farsi',
        listingType: 'For Sale',
    },
    {
        id: 'item_2',
        name: 'Leather Sofa Set',
        description: 'A 3-seater and 2-seater brown leather sofa set. Some minor wear and tear but overall in great condition. Very comfortable.',
        category: 'Furniture',
        condition: 'Used - Good',
        price: 250.00,
        imageUrl: 'https://images.unsplash.com/photo-1540574163024-573506e6c469?q=80&w=600&auto=format&fit=crop',
        seller: 'Fatima Al-Balushi',
        listingType: 'For Sale',
    },
     {
        id: 'item_3',
        name: 'Children\'s Bicycles',
        description: 'Two bicycles for children aged 5-8. A bit rusty but in good working order. Perfect for a family looking for starter bikes.',
        category: 'Sports & Outdoors',
        condition: 'Used - Fair',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1574637651733-4125232145dc?q=80&w=600&auto=format&fit=crop',
        seller: 'Community Donations',
        listingType: 'For Donation',
    },
];
