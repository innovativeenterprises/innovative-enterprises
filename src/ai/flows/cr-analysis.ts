'use server';

/**
 * @fileOverview An AI agent that analyzes a Commercial Record (CR) document.
 * - analyzeCrDocument - A function that analyzes the document.
 */

import { ai } from '@/ai/genkit';
import {
    CrAnalysisInput,
    CrAnalysisInputSchema,
    CrAnalysisOutput,
    CrAnalysisOutputSchema,
} from './cr-analysis.schema';

export async function analyzeCrDocument(input: CrAnalysisInput): Promise<CrAnalysisOutput> {
  return crAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crAnalysisPrompt',
  input: { schema: CrAnalysisInputSchema },
  output: { schema: CrAnalysisOutputSchema },
  prompt: `You are an expert business registration analyst. Your task is to analyze the provided Commercial Record (CR) document and extract key information.

**Instructions:**
1.  **Analyze the Document:** The document provided is a Commercial Record or a similar business registration document.
    -   Document: {{media url=documentDataUri}}
2.  **Extract Information:** Carefully read the document and extract the following details:
    -   **Company Name:** Find the official, full legal name of the business.
    -   **Contact Name:** Identify the name of the owner, manager, or authorized signatory. If multiple names are present, choose the most relevant one for a partnership inquiry.
    -   **Email:** Locate any contact email address.
    -   **Activities:** Summarize the list of official business activities or the company's purpose into a concise paragraph.
3.  **Return Structured Data:** Populate the extracted information into the specified output format. If a piece of information cannot be found, leave the corresponding field empty.
`,
});

const crAnalysisFlow = ai.defineFlow(
  {
    name: 'crAnalysisFlow',
    inputSchema: CrAnalysisInputSchema,
    outputSchema: CrAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    