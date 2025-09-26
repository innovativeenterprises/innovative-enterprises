

'use server';

/**
 * @fileOverview An AI agent that matches domestic workers to client requirements.
 */

import { ai } from '@/ai/genkit';
import { getRaahaData } from '@/lib/firestore';
import {
    RaahaMatcherInputSchema,
    type RaahaMatcherInput,
    RaahaMatcherOutputSchema,
    type RaahaMatcherOutput,
} from './raaha-matcher.schema';
import { z } from 'zod';


export async function findHelpers(input: RaahaMatcherInput): Promise<RaahaMatcherOutput> {
  return raahaMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'raahaMatcherPrompt',
  input: { schema: RaahaMatcherInputSchema.extend({ availableWorkersJson: z.string() }) },
  output: { schema: RaahaMatcherOutputSchema },
  prompt: `You are an expert recruitment consultant for a high-end domestic workforce agency called "RAAHA".
Your task is to analyze a client's requirements and recommend the most suitable candidates from your database.

**Client's Requirements:**
"""
{{{requirements}}}
"""

**Available Candidates Database:**
You MUST only recommend candidates from this list.
'''json
{{{availableWorkersJson}}}
'''

**Your Task:**
1.  **Analyze Requirements:** Carefully read the client's needs. Identify key skills (e.g., cooking, childcare, elderly care), experience level, and language preferences.
2.  **Filter Candidates:** From the provided JSON database, select the top 2-4 candidates who are **'Available'** and best match the client's requirements.
    *   Prioritize candidates whose skills and experience directly align with the request.
    *   Consider their age and nationality if the client implies a preference.
    *   Pay close attention to keywords like "nanny," "cook," "caregiver," etc.
3.  **Generate Response:**
    *   **Title:** Create a concise title for the results, like "Top Candidates for Your Family's Needs".
    *   **Summary:** Write a brief, personalized summary explaining *why* these specific candidates are a good match for the client.
    *   **recommendedWorkers:** Return the full JSON objects for the candidates you have selected.

Return the complete response in the specified structured JSON format.
`,
});

const raahaMatcherFlow = ai.defineFlow(
  {
    name: 'raahaMatcherFlow',
    inputSchema: RaahaMatcherInputSchema,
    outputSchema: RaahaMatcherOutputSchema,
  },
  async (input) => {
    const { raahaWorkers } = await getRaahaData();
    const availableWorkers = raahaWorkers.filter(w => w.availability === 'Available');
    const availableWorkersJson = JSON.stringify(availableWorkers, null, 2);

    const { output } = await prompt({
        ...input,
        availableWorkersJson
    });
    
    return output!;
  }
);

