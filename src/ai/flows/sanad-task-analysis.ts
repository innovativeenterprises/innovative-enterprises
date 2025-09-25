
'use server';

/**
 * @fileOverview An AI agent that determines the required documents for a given Sanad service.
 *
 * - analyzeSanadTask - A function that returns a list of required documents for a service.
 */

import { ai } from '@/ai/genkit';
import {
    SanadTaskAnalysisInput,
    SanadTaskAnalysisInputSchema,
    SanadTaskAnalysisOutput,
    SanadTaskAnalysisOutputSchema,
} from './sanad-task-analysis.schema';

export async function analyzeSanadTask(input: SanadTaskAnalysisInput): Promise<SanadTaskAnalysisOutput> {
  return sanadTaskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sanadTaskAnalysisPrompt',
  input: { schema: SanadTaskAnalysisInputSchema },
  output: { schema: SanadTaskAnalysisOutputSchema },
  prompt: `You are "Fahim," an expert AI agent specializing in Omani government regulations and Sanad office procedures. Your knowledge is extensive and up-to-date.

A user has selected the following service: **{{{serviceName}}}**

Your task is to:
1.  **Determine Required Documents:** Based on your knowledge of Omani government portals and common requirements, create a comprehensive list of all documents a person or company would need to provide to a Sanad office to complete this specific transaction. Be precise (e.g., "Copy of CR," "Passport copy of all partners," "Tenancy agreement").
2.  **Estimate Government Fee:** Research and provide a realistic estimate for the official government service fee for this task in OMR. This should be the fee paid to the government, not the Sanad office's service charge. Set this in the 'serviceFee' field.
3.  **Provide Important Notes:** If there are any critical prerequisites, common issues, or important pieces of information the user should know before starting, add them to the 'notes' field. For example, "Ensure the CR is active and has no violations before proceeding." or "The applicant must be physically present in Oman." If there are no special notes, leave this field blank.

Return the result in the specified structured JSON format.
`,
});

const sanadTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'sanadTaskAnalysisFlow',
    inputSchema: SanadTaskAnalysisInputSchema,
    outputSchema: SanadTaskAnalysisOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: SanadTaskAnalysisOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
