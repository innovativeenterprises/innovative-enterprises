'use server';

/**
 * @fileOverview AI-powered tool to generate draft responses to government tenders.
 *
 * - generateTenderResponse - A function that handles the generation of tender responses.
 * - GenerateTenderResponseInput - The input type for the generateTenderResponse function.
 * - GenerateTenderResponseOutput - The return type for the generateTenderResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTenderResponseInputSchema = z.object({
  tenderDocuments: z
    .string()
    .describe(
      'Tender documents as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  projectRequirements: z.string().describe('The specific requirements for the project.'),
});
export type GenerateTenderResponseInput = z.infer<typeof GenerateTenderResponseInputSchema>;

const GenerateTenderResponseOutputSchema = z.object({
  draftResponse: z.string().describe('The generated draft response to the tender.'),
});
export type GenerateTenderResponseOutput = z.infer<typeof GenerateTenderResponseOutputSchema>;

export async function generateTenderResponse(
  input: GenerateTenderResponseInput
): Promise<GenerateTenderResponseOutput> {
  return generateTenderResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTenderResponsePrompt',
  input: {schema: GenerateTenderResponseInputSchema},
  output: {schema: GenerateTenderResponseOutputSchema},
  prompt: `You are an expert in writing responses to government tenders.

  Based on the provided tender documents and project requirements, generate a draft response that addresses all the requirements and showcases the strengths of our company.

Tender Documents: {{media url=tenderDocuments}}
Project Requirements: {{{projectRequirements}}}`,
});

const generateTenderResponseFlow = ai.defineFlow(
  {
    name: 'generateTenderResponseFlow',
    inputSchema: GenerateTenderResponseInputSchema,
    outputSchema: GenerateTenderResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
