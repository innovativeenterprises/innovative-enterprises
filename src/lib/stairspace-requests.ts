
export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message?: string;
  requestDate: string; // ISO string
  status: 'Pending' | 'Contacted' | 'Booked' | 'Closed' | 'Confirmed';
  interviewDate?: string;
  interviewNotes?: string;
}

export const initialStairspaceRequests: BookingRequest[] = [
    {
        id: 'req_stair_01',
        listingId: 'stair_1',
        listingTitle: 'High-Traffic Spot near Cinema',
        clientName: 'Anwar Ahmed',
        clientEmail: 'anwar.ahmed@example.com',
        clientPhone: '+968 99887766',
        message: 'Interested in booking for the first week of September for a new coffee brand promotion.',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    },
    {
        id: 'req_stair_02',
        listingId: 'stair_2',
        listingTitle: 'Cozy Corner for Art Display',
        clientName: 'Fatima Al-Busaidi',
        clientEmail: 'fatima.art@example.com',
        clientPhone: '+968 91234567',
        message: 'Looking to rent for the entire month of October to display my paintings.',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Booked',
    }
];
