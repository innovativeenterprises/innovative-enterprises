
'use server';

/**
 * @fileOverview An AI agent that matches a user's requirements to available property listings.
 */

import { ai } from '@/ai/genkit';
import { getProperties } from '@/lib/firestore';
import {
    PropertyMatcherInputSchema,
    PropertyMatcherInput,
    PropertyMatcherOutputSchema,
    PropertyMatcherOutput,
} from './property-matcher.schema';
import { z } from 'zod';

export async function findBestPropertyMatch(input: PropertyMatcherInput): Promise<PropertyMatcherOutput> {
  return propertyMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'propertyMatcherPrompt',
  input: { schema: PropertyMatcherInputSchema.extend({ availablePropertiesJson: z.string() }) },
  output: { schema: PropertyMatcherOutputSchema },
  prompt: `You are an expert real estate agent AI. Your task is to analyze a user's requirements and find the best matching property from the provided list of available listings.

**User's Requirements:**
"""
{{{userRequirements}}}
"""

**Available Property Listings:**
You MUST only recommend properties from this list.
'''json
{{{availablePropertiesJson}}}
'''

**Your Task:**
1.  **Analyze Requirements:** Carefully read the user's needs. Identify key criteria like property type (villa, apartment), number of bedrooms, location preferences, budget, and special features (garden, sea view, new construction).
2.  **Find Best Match:** From the provided JSON list, identify the single best property that most closely matches the user's requirements.
3.  **Provide Justification:** In the 'reasoning' field, write a short, professional paragraph explaining *why* this property is an excellent fit. Highlight how it meets the user's key criteria.
4.  **Confidence Score:** Provide a confidence score (0-100) based on how well the best match aligns with the user's stated requirements. A perfect match on all key criteria should be high (90+), while a partial match should be lower.
5.  **Suggest Others (Optional):** If there are 2-3 other properties that are also good fits, list their IDs in the 'otherMatches' array.

Return the complete analysis in the specified structured JSON format.
`,
});

const propertyMatcherFlow = ai.defineFlow(
  {
    name: 'propertyMatcherFlow',
    inputSchema: PropertyMatcherInputSchema,
    outputSchema: PropertyMatcherOutputSchema,
  },
  async (input) => {
    const allProperties = await getProperties();
    const availableProperties = allProperties.filter(p => p.status === 'Available');
    const availablePropertiesJson = JSON.stringify(availableProperties, null, 2);

    const { output } = await prompt({
        ...input,
        availablePropertiesJson
    });
    
    return output!;
  }
);
