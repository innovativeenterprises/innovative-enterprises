
import { z } from 'zod';

export const BookingRequestSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  listingTitle: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  clientPhone: z.string(),
  message: z.string().optional(),
  requestDate: z.string().datetime(), // ISO date string
  status: z.enum(['Pending', 'Contacted', 'Booked', 'Closed', 'Confirmed']),
  interviewDate: z.string().datetime().optional(), // ISO date string
  interviewNotes: z.string().optional(),
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;


export const initialStairspaceRequests: BookingRequest[] = [];
