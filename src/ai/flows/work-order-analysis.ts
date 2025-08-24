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
  prompt: `You are an expert project manager and intake specialist for "Innovative Enterprises".
Your task is to analyze a new work order submitted by a potential client and prepare it for our internal teams and network of freelancers.

**Work Order Details:**
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
1.  **Categorize the Work:** Based on the description, categorize the work order into ONE of the following:
    *   'Project': A complex, multi-stage piece of work requiring a team (e.g., "Build a new e-commerce website").
    *   'Task': A smaller, well-defined piece of work for a single freelancer (e.g., "Design a logo").
    *   'Competition': Work that can be structured as a contest to get multiple submissions (e.g., "Company Rebranding Design").
    *   'RFP' (Request for Proposal): A large, formal request that needs a detailed proposal from multiple companies or teams.
    *   'Subcontract': A specific part of a larger project that we need to outsource.

2.  **Write a Public Summary:** Create a clear, concise, and anonymous summary of the opportunity. This summary will be posted on our public "Opportunities" page for freelancers. Remove any client-specific identifying information. It should be written to attract the right talent.

3.  **Recommend Next Steps:** Provide a short (1-2 sentences) message for the client who submitted the form, explaining what they should expect next. For example, "Our team will review the analysis and prepare it for our opportunities board." or "Thank you. Our partnerships team will contact you to discuss the RFP requirements."

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
