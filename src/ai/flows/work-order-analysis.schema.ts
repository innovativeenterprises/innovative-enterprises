
/**
 * @fileOverview Schemas and types for the Work Order Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the work order analysis AI flow.
 */

import { z } from 'zod';

export const WorkOrderInputSchema = z.object({
  title: z.string().describe('The title of the work order or project.'),
  description: z.string().describe('A detailed description of the work to be done.'),
  budget: z.string().optional().describe('The estimated budget for the work.'),
  timeline: z.string().optional().describe('The expected timeline or deadline.'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "An optional supporting document (e.g., brief, specs), as a data URI."
    ),
});
export type WorkOrderInput = z.infer<typeof WorkOrderInputSchema>;


export const WorkOrderAnalysisOutputSchema = z.object({
  category: z.enum(['Project', 'Task', 'Competition', 'RFP', 'Subcontract'])
    .describe('The category the work order falls into.'),
  summary: z.string().describe('A concise summary of the opportunity, suitable for posting on an opportunities board.'),
  recommendedNextSteps: z.string().describe('A brief recommendation for the business owner on what to expect next.'),
  generatedQuestions: z.array(z.string()).describe("A list of 3-5 key questions for potential service providers to answer in their proposal."),
});
export type WorkOrderAnalysisOutput = z.infer<typeof WorkOrderAnalysisOutputSchema>;
