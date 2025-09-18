
export interface BeautyAppointment {
    id: string;
    agencyId: string;
    clientName: string;
    service: string;
    specialist: string;
    dateTime: string; // ISO string
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export const initialBeautyAppointments: BeautyAppointment[] = [
    {
        id: 'appt_01',
        agencyId: 'center_01',
        clientName: 'Aisha Al-Habsi',
        service: 'Classic Manicure',
        specialist: 'Fatima',
        dateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'Confirmed',
    },
    {
        id: 'appt_02',
        agencyId: 'center_01',
        clientName: 'Sara Al-Farsi',
        service: 'Hydrating Facial',
        specialist: 'Maria',
        dateTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'Confirmed',
    },
     {
        id: 'appt_03',
        agencyId: 'center_02',
        clientName: 'Mohammed Al-Said',
        service: 'Classic Haircut',
        specialist: 'Ali',
        dateTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000).toISOString(),
        status: 'Confirmed',
    },
];
