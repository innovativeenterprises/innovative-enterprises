
export interface Worker {
    id: string;
    name: string;
    nationality: string;
    age: number;
    skills: string[];
    experience: string;
    availability: 'Available' | 'Not Available';
    rating: number;
    photo: string;
}

export const initialWorkers: Worker[] = [
    {
        id: 'worker_001',
        name: 'Maria Dela Cruz',
        nationality: 'Filipino',
        age: 32,
        skills: ['Childcare', 'Cooking (Asian)', 'General Cleaning', 'English Speaking'],
        experience: 'Over 8 years of experience working as a housemaid and nanny for families in the UAE and Oman. Excellent with young children and infants.',
        availability: 'Available',
        rating: 4.8,
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'worker_002',
        name: 'Siti Nurhaliza',
        nationality: 'Indonesian',
        age: 28,
        skills: ['Elderly Care', 'Cooking (Arabic)', 'Laundry & Ironing', 'Basic Arabic'],
        experience: '5 years of experience as a caregiver for an elderly couple in Muscat. Patient and compassionate.',
        availability: 'Available',
        rating: 4.6,
        photo: 'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'worker_003',
        name: 'Anjali Sharma',
        nationality: 'Indian',
        age: 35,
        skills: ['Deep Cleaning', 'Cooking (Indian)', 'Organizing', 'Pet Care'],
        experience: '10 years of experience managing large households in India and Bahrain. Expert in deep cleaning and home organization.',
        availability: 'Not Available',
        rating: 4.9,
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'worker_004',
        name: 'Fatuma Mohammed',
        nationality: 'Ethiopian',
        age: 25,
        skills: ['General Cleaning', 'Cooking (Basic)', 'Washing', 'Hardworking'],
        experience: '3 years of experience in Oman as a general housemaid. Learns quickly and is very diligent.',
        availability: 'Available',
        rating: 4.4,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
    },
     {
        id: 'worker_005',
        name: 'Amina Begum',
        nationality: 'Bangladeshi',
        age: 30,
        skills: ['General Cleaning', 'Cooking (Bangladeshi)', 'Laundry', 'Follows Instructions Well'],
        experience: '4 years of experience with a family in Sohar. Known for being reliable and efficient.',
        availability: 'Available',
        rating: 4.5,
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop'
    },
     {
        id: 'worker_006',
        name: 'Kumari Perera',
        nationality: 'Sri Lankan',
        age: 40,
        skills: ['Childcare (All Ages)', 'Cooking (International)', 'First Aid Certified', 'Excellent English'],
        experience: '15 years of experience as a nanny and house manager for expatriate families in Dubai. Highly recommended.',
        availability: 'Available',
        rating: 5.0,
        photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600&auto=format&fit=crop'
    }
];
