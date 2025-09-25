
'use server';

/**
 * @fileOverview An AI agent that matches a user's requirements to available StairSpace listings.
 */

import { ai } from '@/ai/genkit';
import { initialStairspaceListings } from '@/lib/stairspace-listings';
import {
    StairspaceMatcherInputSchema,
    StairspaceMatcherInput,
    StairspaceMatcherOutputSchema,
    StairspaceMatcherOutput,
} from './stairspace-matcher.schema';


export async function findBestStairspaceMatch(input: StairspaceMatcherInput): Promise<StairspaceMatcherOutput> {
  return stairspaceMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stairspaceMatcherPrompt',
  input: { schema: StairspaceMatcherInputSchema.extend({ availableSpacesJson: z.string() }) },
  output: { schema: StairspaceMatcherOutputSchema },
  prompt: `You are an expert real estate agent AI specializing in micro-retail and pop-up spaces. Your task is to analyze a user's requirements and find the best matching property from the provided list of available listings.

**User's Requirements:**
"""
{{{userRequirements}}}
"""

**Available StairSpace Listings:**
You MUST only recommend spaces from this list.
'''json
{{{availableSpacesJson}}}
'''

**Your Task:**
1.  **Analyze Requirements:** Carefully read the user's needs. Identify key criteria like desired location, type of business (e.g., coffee stand, retail pop-up, storage), budget, and special features (high foot traffic).
2.  **Find Best Match:** From the provided JSON list, identify the single best property that most closely matches the user's requirements.
3.  **Provide Justification:** In the 'reasoning' field, write a short, professional paragraph explaining *why* this space is an excellent fit. Highlight how its features (tags, location) meet the user's key criteria.
4.  **Confidence Score:** Provide a confidence score (0-100) based on how well the best match aligns with the user's stated requirements. A perfect match on all key criteria should be high (90+).
5.  **Return Best Match Object:** Return the full JSON object for the single best matching property in the 'bestMatch.property' field.
6.  **Suggest Others (Optional):** If there are 1-2 other spaces that are also good fits, list their full property objects in the 'otherMatches' array.

Return the complete analysis in the specified structured JSON format.
`,
});

const stairspaceMatcherFlow = ai.defineFlow(
  {
    name: 'stairspaceMatcherFlow',
    inputSchema: StairspaceMatcherInputSchema,
    outputSchema: StairspaceMatcherOutputSchema,
  },
  async (input) => {
    // In a real app, this would query a database. For the prototype, we use a static list.
    const availableSpacesJson = JSON.stringify(initialStairspaceListings, null, 2);

    const llmResponse = await ai.generate({
      prompt: prompt,
      input: {
        ...input,
        availableSpacesJson
      },
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: StairspaceMatcherOutputSchema,
      }
    });
    
    return llmResponse.output()!;
  }
);
