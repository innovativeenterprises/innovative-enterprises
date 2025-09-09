
import type { StairspaceListing } from './stairspace.schema';

export const initialStairspaceListings: StairspaceListing[] = [
    {
        id: 1,
        title: "Under-Stairs Pop-up at Muscat Grand Mall",
        location: "Muscat Grand Mall, Oman",
        price: "OMR 25 / day",
        imageUrl: "https://images.unsplash.com/photo-1582545398978-4983a4dff2dc?q=80&w=1920&auto=format&fit=crop",
        aiHint: "modern staircase retail",
        tags: ["High Foot Traffic", "Retail", "Pop-up"],
    },
    {
        id: 2,
        title: "Cozy Nook for Artisan Crafts",
        location: "Al-Khuwair, Muscat",
        price: "OMR 15 / day",
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1920&auto=format&fit=crop",
        aiHint: "artisan shop interior",
        tags: ["Boutique", "Crafts", "Community"],
    },
    {
        id: 3,
        title: "Secure Micro-Storage Space",
        location: "Ruwi, Muscat",
        price: "OMR 50 / month",
        imageUrl: "https://images.unsplash.com/photo-1599299484364-6723c31e9a38?q=80&w=1920&auto=format&fit=crop",
        aiHint: "secure storage space",
        tags: ["Storage", "Secure", "24/7 Access"],
    },
];
