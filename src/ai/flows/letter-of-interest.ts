
'use server';

/**
 * @fileOverview An AI agent that generates a Letter of Interest for potential investors.
 *
 * This file contains the server-side logic for the flow.
 * - generateLetterOfInterest - A function that generates the letter.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateLetterOfInterestInput,
    GenerateLetterOfInterestInputSchema,
    GenerateLetterOfInterestOutput,
    GenerateLetterOfInterestOutputSchema
} from './letter-of-interest.schema';

export async function generateLetterOfInterest(input: GenerateLetterOfInterestInput): Promise<GenerateLetterOfInterestOutput> {
  return letterOfInterestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'letterOfInterestPrompt',
  input: { schema: GenerateLetterOfInterestInputSchema },
  output: { schema: GenerateLetterOfInterestOutputSchema },
  prompt: `You are an expert investment relations officer for "Innovative Enterprises", an Omani SME focused on emerging tech.
Your task is to draft a formal and welcoming "Letter of Interest" addressed to a potential investor who has just filled out an inquiry form.

**Investor Details:**
-   **Name/Contact:** {{{fullName}}}
{{#if organizationName}}
-   **Organization:** {{{organizationName}}}
{{/if}}
{{#if investorType}}
-   **Investor Type:** {{{investorType}}}
{{/if}}
{{#if country}}
-   **Country:** {{{country}}}
{{/if}}
{{#if website}}
-   **Website:** {{{website}}}
{{/if}}
{{#if investmentRange}}
-   **Indicated Investment Range:** {{{investmentRange}}}
{{/if}}
-   **Stated Area of Interest:** {{{areaOfInterest}}}

**Instructions:**
1.  **Format:** The letter must be in professional Markdown format.
2.  **Tone:** Professional, encouraging, and personalized.
3.  **Sender:** The letter should be from "Jumaa Salim Al Hadidi, CEO, Innovative Enterprises".
4.  **Content:**
    -   Start with a formal salutation to {{{fullName}}}.
    -   Thank them for their interest in Innovative Enterprises.
    -   Acknowledge their specific area of interest ({{{areaOfInterest}}}) and briefly connect it to one of our relevant projects (PanoSpace, ameen, APPI, KHIDMAAI, VMALL) or service areas (AI, Cloud, Cybersecurity). If they mentioned a specific investor type, subtly tailor the language to them.
    -   Express enthusiasm about the possibility of a partnership.
    -   Mention that our team will review their inquiry and be in touch shortly to schedule a preliminary discussion.
    -   Conclude with a professional closing.

Generate the full letter content for the 'letterContent' output field.
`,
});

const letterOfInterestFlow = ai.defineFlow(
  {
    name: 'letterOfInterestFlow',
    inputSchema: GenerateLetterOfInterestInputSchema,
    outputSchema: GenerateLetterOfInterestOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
