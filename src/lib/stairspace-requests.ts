
export interface BookingRequest {
  id: string;
  listingId: number;
  listingTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message?: string;
  requestDate: string; // ISO date string
  status: 'Pending' | 'Contacted' | 'Booked' | 'Closed';
}

export const initialStairspaceRequests: BookingRequest[] = [];
