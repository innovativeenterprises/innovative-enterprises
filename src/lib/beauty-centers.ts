
export interface BeautyCenter {
    id: string;
    name: string;
    description: string;
    logo: string;
    contactEmail: string;
    contactPhone: string;
    primaryColor?: string;
}

export const initialBeautyCenters: BeautyCenter[] = [
    {
        id: 'center_01',
        name: 'Gloss & Glam Salon',
        description: 'Your one-stop destination for luxury beauty treatments and relaxation.',
        logo: 'https://placehold.co/100x100/ec4899/ffffff/png?text=G&G',
        contactEmail: 'bookings@glossandglam.om',
        contactPhone: '+968 2447 9999',
        primaryColor: 'hsl(327, 75%, 50%)',
    },
    {
        id: 'center_02',
        name: 'The Modern Man Barbershop',
        description: 'Classic cuts and modern styles, providing a premium grooming experience for men.',
        logo: 'https://placehold.co/100x100/1e293b/ffffff/png?text=MM',
        contactEmail: 'info@modernman.om',
        contactPhone: '+968 2447 8888',
        primaryColor: 'hsl(222, 24%, 15%)',
    }
];
