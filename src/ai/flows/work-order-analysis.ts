

'use server';

/**
 * @fileOverview An AI agent that analyzes and categorizes incoming work orders.
 *
 * This file contains the server-side logic for the flow.
 * - analyzeWorkOrder - A function that performs the analysis.
 */

import { ai } from '@/ai/genkit';
import {
    WorkOrderInput,
    WorkOrderInputSchema,
    WorkOrderAnalysisOutput,
    WorkOrderAnalysisOutputSchema,
} from './work-order-analysis.schema';

export async function analyzeWorkOrder(input: WorkOrderInput): Promise<WorkOrderAnalysisOutput> {
  return workOrderAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workOrderAnalysisPrompt',
  input: { schema: WorkOrderInputSchema },
  output: { schema: WorkOrderAnalysisOutputSchema },
  prompt: `You are an expert project manager and innovation analyst for "Innovative Enterprises".
Your task is to analyze a new submission, which could be a work order, a business idea, or a social initiative.

**Submission Details:**
-   **Title:** {{{title}}}
-   **Description:** {{{description}}}
{{#if budget}}
-   **Budget:** {{{budget}}}
{{/if}}
{{#if timeline}}
-   **Timeline:** {{{timeline}}}
{{/if}}
{{#if documentDataUri}}
-   **Attached Document:** A document has been provided for further details.
{{/if}}

**Instructions:**
1.  **Categorize the Submission:** Based on the description, categorize the work into ONE of the following:
    *   'Project': A complex, multi-stage piece of work requiring a team (e.g., "Build a new e-commerce website").
    *   'Task': A smaller, well-defined piece of work for a single freelancer (e.g., "Design a logo").
    *   'Competition': Work that can be structured as a contest (e.g., "Company Rebranding Design").
    *   'RFP' (Request for Proposal): A large, formal request that needs a detailed proposal.
    *   'Subcontract': A specific part of a larger project to be outsourced.
    *   'Startup Idea': A concept for a new business or digital product.
    *   'Social Initiative': An idea for a community project or social good campaign.

2.  **Write a Public Summary:** Create a clear, concise, and anonymous summary of the opportunity. This summary will be reviewed internally. Remove any identifying information from the user.

3.  **Score the Idea:** Based on the description, provide three scores from 0-100:
    *   **noveltyScore:** How original and innovative is the idea? (0 = very common, 100 = groundbreaking).
    *   **marketPotentialScore:** What is the potential market size and viability? (0 = niche/none, 100 = huge market).
    *   **impactScore:** What is the potential social or economic impact? (0 = low impact, 100 = highly impactful).

4.  **Generate Clarifying Questions:** Based on the provided title and description, generate a list of 3-5 important questions that would help clarify the idea's scope and viability. These questions are for an internal review team.

5.  **Recommend Next Steps:** Provide a short (1-2 sentences) message for the user who submitted the idea, explaining what they should expect next. For example, "Thank you for your submission. Our team will review your idea and contact you if it aligns with our current incubation programs."

Generate the response in the required structured format.
`,
});

const workOrderAnalysisFlow = ai.defineFlow(
  {
    name: 'workOrderAnalysisFlow',
    inputSchema: WorkOrderInputSchema,
    outputSchema: WorkOrderAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

