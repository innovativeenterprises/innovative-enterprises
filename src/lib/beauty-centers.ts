
export interface BeautyCenter {
    id: string;
    name: string;
    description: string;
    logo: string;
    contactEmail: string;
    contactPhone: string;
}

export const initialBeautyCenters: BeautyCenter[] = [
    {
        id: 'center_01',
        name: 'Belleza Beauty Lounge',
        description: 'A premium salon offering a wide range of hair, nail, and skin treatments.',
        logo: 'https://placehold.co/100x100/f06292/ffffff/png?text=B',
        contactEmail: 'bookings@belleza.om',
        contactPhone: '+968 2448 8888',
    },
    {
        id: 'center_02',
        name: 'The Modern Man Barbershop',
        description: 'Classic and modern grooming services for gentlemen.',
        logo: 'https://placehold.co/100x100/424242/ffffff/png?text=MM',
        contactEmail: 'appointments@modernman.om',
        contactPhone: '+968 2448 9999',
    }
];
