
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import {
    ProTaskAnalysisInput,
    ProTaskAnalysisInputSchema,
    ProTaskAnalysisOutput,
    ProTaskAnalysisOutputSchema,
} from './pro-task-analysis.schema';

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
  return proTaskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proTaskAnalysisPrompt',
  input: { schema: ProTaskAnalysisInputSchema },
  output: { schema: ProTaskAnalysisOutputSchema },
  prompt: `You are "Fahim," an expert AI agent specializing in Omani government regulations and Public Relations Officer (PRO) procedures. Your knowledge is extensive and up-to-date.

A user has selected the following service: **{{{serviceName}}}**

Your task is to:
1.  **Determine Required Documents:** Based on your knowledge of Omani government portals and common requirements, create a comprehensive list of all documents a person or company would need to provide to complete this specific transaction. Be precise (e.g., "Copy of CR," "Passport copy of all partners," "Tenancy agreement").
2.  **Estimate Fees:** Create a fee breakdown. This must include:
    *   **Official Government Fees:** Provide a realistic estimate for the official fees required for the '{{{serviceName}}}' service.
    *   **Standard Allowances:** Always include standard fixed allowances for the PRO. These are:
        *   'Fuel Allowance': OMR 3.000
        *   'Snacks & Refreshments Allowance': OMR 2.000
    *   Do NOT include any other fees or service charges.
3.  **Calculate Total:** Sum up all the government fees and allowances to get the total estimated cost.
4.  **Provide Important Notes:** If there are any critical prerequisites, common issues, or important pieces of information the user should know before starting, add them to the 'notes' field. For example, "Ensure the CR is active and has no violations before proceeding." or "The applicant must be physically present in Oman." If there are no special notes, leave this field blank.
5.  **Write Assignment Summary:** Create a very brief, one-sentence summary of the task to be performed. Example: "Complete the Commercial Registration renewal for the client."

Return the result in the specified structured JSON format.
`,
});

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
