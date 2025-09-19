
import { z } from 'zod';

export const BookingResponseInputSchema = z.object({
  listingTitle: z.string(),
  clientName: z.string(),
  clientMessage: z.string().optional(),
});

export const BookingResponseOutputSchema = z.object({
  response: z.string().describe("A professional and friendly response to the client."),
});
