
'use server';

/**
 * @fileOverview An AI agent that generates a compelling description for a StairSpace listing.
 */

import { ai } from '@/ai/genkit';
import { ListingDescriptionInputSchema, ListingDescriptionOutputSchema } from './listing-description-generator.schema';
import type { ListingDescriptionInput, ListingDescriptionOutput } from './listing-description-generator.schema';

const prompt = ai.definePrompt({
  name: 'listingDescriptionPrompt',
  input: { schema: ListingDescriptionInputSchema },
  output: { schema: ListingDescriptionOutputSchema },
  prompt: `You are an expert real estate copywriter specializing in short-term commercial rentals.
Your task is to write a compelling, professional, and inviting description for a "StairSpace" listing.

**Listing Details:**
- **Title:** {{{title}}}
- **Location:** {{{location}}}
- **Tags:** {{{tags}}}

**Instructions:**
1.  **Analyze Details:** Use the title, location, and tags to understand the space's key selling points.
2.  **Write a Description:** Draft a description of 2-3 sentences.
    *   Highlight the benefits suggested by the tags (e.g., 'High Foot Traffic' means great visibility for a brand).
    *   Mention the location to attract local entrepreneurs.
    *   Use professional and appealing language (e.g., "prime retail opportunity," "unique pop-up space," "high-visibility location").
3.  **Return Only the Description:** Your entire output should be only the text for the 'description' field. Do not include a preamble or any other text.
`,
});

export const generateListingDescription = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: ListingDescriptionInputSchema,
    outputSchema: ListingDescriptionOutputSchema,
  },
  async (input: ListingDescriptionInput): Promise<ListingDescriptionOutput> => {
    const { output } = await prompt(input);
    return output!;
  }
);
