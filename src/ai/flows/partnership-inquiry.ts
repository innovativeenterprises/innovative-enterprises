
'use server';

/**
 * @fileOverview An AI agent that handles new partnership inquiries.
 *
 * This file contains the server-side logic for the flow.
 * - handlePartnershipInquiry - A function that handles the inquiry submission.
 */

import { ai } from '@/ai/genkit';
import {
    PartnershipInquiryInput,
    PartnershipInquiryInputSchema,
    PartnershipInquiryOutput,
    PartnershipInquiryOutputSchema
} from './partnership-inquiry.schema';

export async function handlePartnershipInquiry(input: PartnershipInquiryInput): Promise<PartnershipInquiryOutput> {
  return partnershipInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'partnershipInquiryPrompt',
  input: { schema: PartnershipInquiryInputSchema },
  output: { schema: PartnershipInquiryOutputSchema },
  prompt: `You are an AI assistant processing a new partnership inquiry. 
The inquiry is from {{contactName}} at {{companyName}}.

Acknowledge receipt of this inquiry and confirm that it has been routed to Paz, our Partnership Agent, for review.
Generate a concise confirmation message for the user.
`,
});

const partnershipInquiryFlow = ai.defineFlow(
  {
    name: 'partnershipInquiryFlow',
    inputSchema: PartnershipInquiryInputSchema,
    outputSchema: PartnershipInquiryOutputSchema,
  },
  async (input) => {
    // In a real application, this flow would save the inquiry to a database,
    // send a notification to the internal team (Paz), and then respond.
    // For this prototype, we'll just simulate the confirmation.
    console.log('Received verified partnership inquiry:', input);
    
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: PartnershipInquiryOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
