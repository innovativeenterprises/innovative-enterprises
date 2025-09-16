
export interface BeautyAppointment {
    id: string;
    clientName: string;
    service: string;
    specialist: string;
    dateTime: string; // ISO String
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export const initialBeautyAppointments: BeautyAppointment[] = [
    {
        id: 'appt_1',
        clientName: 'Aisha Al-Harthy',
        service: 'Luxury Manicure & Pedicure',
        specialist: 'Fatima',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'Confirmed'
    },
    {
        id: 'appt_2',
        clientName: 'Sara Al-Balushi',
        service: 'Haircut & Blowdry',
        specialist: 'Nadia',
        dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        status: 'Confirmed'
    },
    {
        id: 'appt_3',
        clientName: 'Asma Al-Riyami',
        service: 'Deep Tissue Massage (60 min)',
        specialist: 'Maria',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'Pending'
    }
];
