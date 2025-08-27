/**
 * @fileOverview Schemas and types for the PRO Task Analysis flow.
 */

import { z } from 'zod';

export const ProTaskAnalysisInputSchema = z.object({
  serviceName: z.string().describe("The name of the government service requested by the user."),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;


const FeeSchema = z.object({
    description: z.string().describe("The description of the fee (e.g., 'CR Renewal Fee', 'Fuel Allowance')."),
    amount: z.number().describe("The estimated amount in OMR."),
});

export const ProTaskAnalysisOutputSchema = z.object({
  documentList: z.array(z.string()).describe("A comprehensive list of all required documents for this specific service."),
  notes: z.string().optional().describe("Any important notes or pre-requisites for the user regarding this service."),
  fees: z.array(FeeSchema).describe("A breakdown of estimated government fees and standard allowances."),
  totalEstimatedCost: z.number().describe("The total estimated cost for the task, including all fees and allowances."),
  assignmentSummary: z.string().describe("A concise summary of the assignment for the printable document."),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;
