'use server';

/**
 * @fileOverview An AI agent that analyzes an individual's identity documents and CV.
 * - analyzeIdentity - A function that analyzes the documents.
 */

import { ai } from '@/ai/genkit';
import {
    IdentityAnalysisInput,
    IdentityAnalysisInputSchema,
    IdentityAnalysisOutput,
    IdentityAnalysisOutputSchema,
} from './identity-analysis.schema';

export async function analyzeIdentity(input: IdentityAnalysisInput): Promise<IdentityAnalysisOutput> {
  return identityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identityAnalysisPrompt',
  input: { schema: IdentityAnalysisInputSchema },
  output: { schema: IdentityAnalysisOutputSchema },
  prompt: `You are an expert HR and compliance officer. Your task is to analyze the provided identity document and CV to extract key information for an application form.

**Instructions:**
1.  **Analyze the Documents:**
    -   Identity Document (Passport or National ID): {{media url=idDocumentUri}}
    {{#if cvDocumentUri}}
    -   Curriculum Vitae (CV): {{media url=cvDocumentUri}}
    {{/if}}

2.  **Extract Information:** Carefully read the documents and extract the following details. If a piece of information cannot be found, leave the corresponding field empty.
    -   **Full Name:** Extract the full legal name from the identity document.
    -   **Email:** Find the primary contact email, preferably from the CV.
    -   **Phone:** Find the primary contact phone number, preferably from the CV.
    -   **Professional Summary:** If a CV is provided, write a concise, one-paragraph summary of the individual's professional background, key skills, and experience. If no CV is provided, leave this field empty.

3.  **Return Structured Data:** Populate all extracted information into the specified output format.
`,
});

const identityAnalysisFlow = ai.defineFlow(
  {
    name: 'identityAnalysisFlow',
    inputSchema: IdentityAnalysisInputSchema,
    outputSchema: IdentityAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
