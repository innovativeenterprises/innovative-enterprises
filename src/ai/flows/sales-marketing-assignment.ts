
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { SalesMarketingAssignmentInputSchema, SalesMarketingAssignmentOutputSchema, type SalesMarketingAssignmentInput, type SalesMarketingAssignmentOutput } from './sales-marketing-assignment.schema';

const prompt = ai.definePrompt({
  name: 'generateSalesMarketingAssignment',
  input: { schema: SalesMarketingAssignmentInputSchema },
  output: { schema: SalesMarketingAssignmentOutputSchema },
  prompt: `You are an expert hiring manager for a top-tier technology firm. Your task is to generate a realistic, step-by-step case study assignment for a prospective sales or marketing freelancer. The case study should be based on one of our real products.

**Our Products:**
- **Sanad Hub:** A digital platform connecting users with government service centers.
- **GENIUS Career Platform:** An AI-powered CV enhancer and interview coach.
- **Voxi Translator:** An AI tool for high-fidelity document translation.
- **RAAHA:** A white-label platform for domestic workforce agencies.

**Instructions:**
1.  **Select a Product:** Choose ONE of the products above to be the subject of the case study.
2.  **Create a Title:** Generate a clear title for the assignment, e.g., "Marketing Strategy Case Study: Launching GENIUS in the UAE".
3.  **Generate Assignment HTML:** Create the assignment content as a well-formatted HTML string. It MUST include the following sections, using <h4> for titles and <p>, <ul>, <li> for content:
    *   **Scenario:** A brief, one-paragraph scenario. (e.g., "Innovative Enterprises is planning to launch its GENIUS Career Platform in the UAE market...").
    *   **Your Task:** A clear, one-sentence mission for the candidate. (e.g., "Your task is to develop a go-to-market strategy for the first three months.").
    *   **Step-by-Step Guide:** Provide 3-4 clear, actionable steps for the candidate to follow.
        *   Example Step 1: "Identify the Target Audience: Who are the primary user personas for this product in the UAE?"
        *   Example Step 2: "Develop Key Messaging: What are the top 3 value propositions that will resonate with this audience?"
        *   Example Step 3: "Outline a Digital Marketing Plan: Propose a mix of channels (social media, content, paid ads) to reach this audience."
    *   **Key Performance Indicators (KPIs):** List 3-4 relevant KPIs for the candidate to consider. (e.g., "Number of sign-ups," "User acquisition cost," "Social media engagement rate.").
    *   **How to Report:** Instruct the candidate to prepare a brief report (PDF or Word) summarizing their findings and strategy, and to provide their own KPI estimations.

Return the generated title and HTML content in the specified JSON format.
`,
});

export const generateSalesMarketingAssignment = ai.defineFlow(
  {
    name: 'generateSalesMarketingAssignmentFlow',
    inputSchema: SalesMarketingAssignmentInputSchema,
    outputSchema: SalesMarketingAssignmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate the sales & marketing assignment.");
    }
    return output;
  }
);
