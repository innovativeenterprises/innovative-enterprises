
export interface Student {
    id: string;
    name: string;
    major: string;
    year: number;
    status: 'On Track' | 'Needs Attention' | 'At Risk';
    photo: string;
    tuitionBilled?: number;
    scholarshipAmount?: number;
    amountPaid?: number;
}

export const initialStudents: Student[] = [
    {
        id: 'SQU-2021-001',
        name: 'Fatima Al-Habsi',
        major: 'Computer Science',
        year: 4,
        status: 'On Track',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 5000,
        scholarshipAmount: 1000,
        amountPaid: 4000,
    },
    {
        id: 'GU-2022-045',
        name: 'Ahmed Al-Saidi',
        major: 'Business Administration',
        year: 3,
        status: 'On Track',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 4500,
        scholarshipAmount: 0,
        amountPaid: 4500,
    },
    {
        id: 'SQU-2020-112',
        name: 'Maryam Al-Balushi',
        major: 'Electrical Engineering',
        year: 5,
        status: 'At Risk',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 5500,
        scholarshipAmount: 500,
        amountPaid: 2000,
    },
    {
        id: 'NCT-2023-088',
        name: 'Yousef Al-Khanjari',
        major: 'Information Technology',
        year: 2,
        status: 'Needs Attention',
        photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 4000,
        scholarshipAmount: 0,
        amountPaid: 0,
    },
    {
        id: 'SQU-2022-019',
        name: 'Noora Al-Riyami',
        major: 'Medicine',
        year: 3,
        status: 'On Track',
        photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 8000,
        scholarshipAmount: 8000,
        amountPaid: 0,
    },
     {
        id: 'GU-2023-061',
        name: 'Khalid Al-Maamari',
        major: 'Marketing',
        year: 2,
        status: 'On Track',
        photo: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 4500,
        scholarshipAmount: 500,
        amountPaid: 2000,
    },
     {
        id: 'SQU-2021-033',
        name: 'Salma Al-Ismaili',
        major: 'Petroleum Engineering',
        year: 4,
        status: 'Needs Attention',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
        tuitionBilled: 6000,
        scholarshipAmount: 1500,
        amountPaid: 4500,
    },
];
