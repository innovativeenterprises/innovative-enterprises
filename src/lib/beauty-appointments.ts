export interface BeautyAppointment {
    id: string;
    centerId: string;
    serviceId: string;
    specialistId: string;
    clientName: string;
    clientContact: string;
    appointmentDate: string; // ISO date string
    status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export const initialBeautyAppointments: BeautyAppointment[] = [
    {
        id: 'appt_01',
        centerId: 'center_01',
        serviceId: 'serv_01',
        specialistId: 'spec_01',
        clientName: 'Aisha Mohammed',
        clientContact: '+968 99223344',
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        status: 'Confirmed',
    },
    {
        id: 'appt_02',
        centerId: 'center_02',
        serviceId: 'serv_08',
        specialistId: 'spec_04',
        clientName: 'Yousuf Al-Busaidi',
        clientContact: 'yousuf.b@example.com',
        appointmentDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        status: 'Confirmed',
    },
];
