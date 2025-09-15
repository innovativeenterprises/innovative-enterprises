
export interface Specialist {
    id: string;
    name: string;
    specialty: string;
    photo: string;
}

export interface BeautyService {
    id: string;
    name: string;
    category: 'Hair' | 'Nails' | 'Skincare' | 'Massage' | 'Grooming';
    duration: number; // in minutes
    price: number;
    description: string;
    specialistIds: string[];
    centerId: string;
}

export const initialSpecialists: Specialist[] = [
    { id: 'spec_01', name: 'Fatima', specialty: 'Lead Hair Stylist', photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop' },
    { id: 'spec_02', name: 'Aisha', specialty: 'Nail Technician', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
    { id: 'spec_03', name: 'Layla', specialty: 'Esthetician', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' },
    { id: 'spec_04', name: 'Khalid', specialty: 'Master Barber', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
    { id: 'spec_05', name: 'Hassan', specialty: 'Barber', photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop' },
];

export const initialBeautyServices: BeautyService[] = [
    // Belleza Beauty Lounge Services
    { id: 'serv_01', name: 'Haircut & Blowdry', category: 'Hair', duration: 60, price: 15.0, description: 'A professional cut and style.', specialistIds: ['spec_01'], centerId: 'center_01' },
    { id: 'serv_02', name: 'Full Color', category: 'Hair', duration: 120, price: 40.0, description: 'Full head permanent or semi-permanent color.', specialistIds: ['spec_01'], centerId: 'center_01' },
    { id: 'serv_03', name: 'Classic Manicure', category: 'Nails', duration: 45, price: 8.0, description: 'Standard manicure with polish.', specialistIds: ['spec_02'], centerId: 'center_01' },
    { id: 'serv_04', name: 'Gel Pedicure', category: 'Nails', duration: 60, price: 12.0, description: 'Long-lasting gel polish for your toes.', specialistIds: ['spec_02'], centerId: 'center_01' },
    { id: 'serv_05', name: 'Deep Cleansing Facial', category: 'Skincare', duration: 75, price: 25.0, description: 'A rejuvenating facial to cleanse and refresh your skin.', specialistIds: ['spec_03'], centerId: 'center_01' },
    { id: 'serv_06', name: 'Swedish Massage', category: 'Massage', duration: 60, price: 30.0, description: 'A relaxing full-body massage.', specialistIds: ['spec_03'], centerId: 'center_01' },

    // The Modern Man Barbershop Services
    { id: 'serv_07', name: 'Classic Haircut', category: 'Grooming', duration: 45, price: 10.0, description: 'A sharp, classic haircut.', specialistIds: ['spec_04', 'spec_05'], centerId: 'center_02' },
    { id: 'serv_08', name: 'Hot Towel Shave', category: 'Grooming', duration: 30, price: 8.0, description: 'A traditional hot towel and straight razor shave.', specialistIds: ['spec_04'], centerId: 'center_02' },
    { id: 'serv_09', name: 'Beard Trim & Shape', category: 'Grooming', duration: 20, price: 5.0, description: 'Professional beard shaping and trimming.', specialistIds: ['spec_04', 'spec_05'], centerId: 'center_02' },
    { id: 'serv_10', name: 'The Works Package', category: 'Grooming', duration: 90, price: 20.0, description: 'Includes haircut, hot towel shave, and a mini facial.', specialistIds: ['spec_04'], centerId: 'center_02' },
];
