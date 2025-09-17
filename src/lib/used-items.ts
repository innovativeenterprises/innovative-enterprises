
export interface UsedItem {
    id: string;
    name: string;
    category: string;
    description: string;
    condition: 'New' | 'Like New' | 'Used - Good' | 'Used - Fair';
    price: number;
    listingType: 'For Sale' | 'For Donation' | 'Gift';
    imageUrl: string;
    seller: string;
}

export const initialUsedItems: UsedItem[] = [
    {
        id: 'item_1',
        name: 'Vintage Leather Armchair',
        category: 'Furniture',
        description: 'A classic leather armchair with a beautiful patina. Very comfortable and adds a touch of vintage charm to any room. Shows some signs of wear consistent with its age.',
        condition: 'Used - Good',
        price: 75.00,
        listingType: 'For Sale',
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1920&auto=format&fit=crop',
        seller: 'Anwar Ahmed'
    },
    {
        id: 'item_2',
        name: 'Set of 4 Dining Chairs',
        category: 'Furniture',
        description: 'A set of four sturdy wooden dining chairs. Perfect for a family dining table. Some minor scratches but in great structural condition.',
        condition: 'Used - Good',
        price: 40.00,
        listingType: 'For Sale',
        imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1920&auto=format&fit=crop',
        seller: 'Anwar Ahmed'
    },
    {
        id: 'item_3',
        name: "Children's Bicycle",
        category: 'Toys & Hobbies',
        description: "A small bicycle suitable for a child aged 5-7. It has been well-loved and has a few scuffs but is in perfect working order. Ready for a new adventure!",
        condition: 'Used - Fair',
        price: 0,
        listingType: 'Gift',
        imageUrl: 'https://images.unsplash.com/photo-1574763523472-ac16e1c6014b?q=80&w=1920&auto=format&fit=crop',
        seller: 'Fatima Al-Hinai'
    },
     {
        id: 'item_4',
        name: 'Assorted Story Books',
        category: 'Books',
        description: "A box of 20+ assorted children's story books. Perfect for starting a small library for your little ones. All books are in good condition.",
        condition: 'Used - Good',
        price: 0,
        listingType: 'For Donation',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1920&auto=format&fit=crop',
        seller: 'Community Initiative'
    }
];
