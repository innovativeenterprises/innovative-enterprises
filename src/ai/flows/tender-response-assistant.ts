
'use server';

/**
 * @fileOverview AI-powered tool to generate draft responses to government tenders.
 *
 * - generateTenderResponse - A function that handles the generation of tender responses.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateTenderResponseInput,
    GenerateTenderResponseInputSchema,
    GenerateTenderResponseOutput,
    GenerateTenderResponseOutputSchema,
} from './tender-response-assistant.schema';


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

Tender Documents:
{{#each tenderDocuments}}
- Document: {{media url=this}}
{{/each}}

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
