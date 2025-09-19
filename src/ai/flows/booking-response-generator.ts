
'use server';

/**
 * @fileOverview An AI agent that generates a response to a booking request.
 */
import { ai } from '@/ai/genkit';
import { BookingResponseInputSchema, BookingResponseOutputSchema } from './booking-response-generator.schema';

const prompt = ai.definePrompt({
  name: 'bookingResponsePrompt',
  input: { schema: BookingResponseInputSchema },
  output: { schema: BookingResponseOutputSchema },
  prompt: `You are a professional property manager for "StairSpace".
Your task is to draft a polite and helpful response to a client's booking inquiry.

**Booking Details:**
- **Space:** {{{listingTitle}}}
- **Client Name:** {{{clientName}}}
- **Client's Message:** "{{#if clientMessage}}{{{clientMessage}}}{{else}}No message provided.{{/if}}"

**Instructions:**
1.  **Acknowledge the Request:** Thank {{{clientName}}} for their interest in the "{{{listingTitle}}}".
2.  **Address their Message:** If they left a message, acknowledge its content briefly.
3.  **Propose Next Steps:** Politely inform them that you are reviewing their request and will confirm availability shortly. Suggest that the next step will be to finalize dates and process the payment to confirm the booking.
4.  **Maintain a Professional Tone:** Be warm, professional, and encouraging.

**Example Response Structure:**

Dear {{{clientName}}},

Thank you for your interest in booking the "{{{listingTitle}}}" space! 

We've received your message and are currently confirming its availability for your requested dates. We're excited about the possibility of hosting your pop-up.

Our team will be in touch within the next 24 hours to confirm the details and proceed with the payment to finalize your booking.

Best regards,
The StairSpace Team

---
Draft a suitable response based on these instructions.
`,
});

export const generateBookingResponse = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: BookingResponseInputSchema,
    outputSchema: BookingResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
