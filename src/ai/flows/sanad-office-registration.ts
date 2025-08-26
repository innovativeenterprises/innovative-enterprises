
'use server';

/**
 * @fileOverview An AI flow to handle the registration of new Sanad offices.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SanadOfficeRegistrationInputSchema = z.object({
  officeName: z.string(),
  crNumber: z.string(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  services: z.string(),
});
export type SanadOfficeRegistrationInput = z.infer<typeof SanadOfficeRegistrationInputSchema>;

export const SanadOfficeRegistrationOutputSchema = z.object({
  confirmationMessage: z.string(),
  officeId: z.string(),
});
export type SanadOfficeRegistrationOutput = z.infer<typeof SanadOfficeRegistrationOutputSchema>;

export async function handleSanadOfficeRegistration(input: SanadOfficeRegistrationInput): Promise<SanadOfficeRegistrationOutput> {
  return sanadOfficeRegistrationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sanadOfficeRegistrationPrompt',
  input: { schema: SanadOfficeRegistrationInputSchema },
  output: { schema: SanadOfficeRegistrationOutputSchema },
  prompt: `You are an onboarding specialist for the Sanad Hub platform. A new office has submitted their registration.

Office Name: {{{officeName}}}
CR Number: {{{crNumber}}}
Contact: {{{contactName}}} ({{{email}}})

Generate a confirmation message acknowledging their submission and create a unique Office ID for them.
The Office ID should be in the format 'SOH-[Random-6-Digit-Number]'.
`,
});

const sanadOfficeRegistrationFlow = ai.defineFlow(
  {
    name: 'sanadOfficeRegistrationFlow',
    inputSchema: SanadOfficeRegistrationInputSchema,
    outputSchema: SanadOfficeRegistrationOutputSchema,
  },
  async (input) => {
    // In a real application, this flow would save the new office details
    // to a database, potentially trigger a verification process, and then
    // respond with a confirmation.
    
    console.log('Received new Sanad Office registration:', input);

    const { output } = await prompt(input);
    
    // Here, you would add logic to save the partner to your database.
    // e.g., db.collection('sanad_offices').doc(output.officeId).set(input);
    
    return output!;
  }
);
