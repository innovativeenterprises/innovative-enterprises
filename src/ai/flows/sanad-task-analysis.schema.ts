/**
 * @fileOverview Schemas and types for the Sanad Task Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the Sanad task analysis AI flow.
 */

import { z } from 'zod';

export const SanadTaskAnalysisInputSchema = z.object({
  serviceName: z.string().describe("The name of the Sanad service requested by the user."),
});
export type SanadTaskAnalysisInput = z.infer<typeof SanadTaskAnalysisInputSchema>;


export const SanadTaskAnalysisOutputSchema = z.object({
  documentList: z.array(z.string()).describe("A list of all required documents for this specific service."),
  notes: z.string().optional().describe("Any important notes or pre-requisites for the user regarding this service."),
});
export type SanadTaskAnalysisOutput = z.infer<typeof SanadTaskAnalysisOutputSchema>;
