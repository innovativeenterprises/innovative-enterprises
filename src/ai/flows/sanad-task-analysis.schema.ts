
'use server';

import { z } from 'zod';

export const SanadTaskAnalysisInputSchema = z.object({
  serviceName: z.string().min(1, "Service name is required."),
});
export type SanadTaskAnalysisInput = z.infer<typeof SanadTaskAnalysisInputSchema>;


export const SanadTaskAnalysisOutputSchema = z.object({
  documentList: z.array(z.string()).describe("A list of required documents for the service."),
  notes: z.string().optional().describe("Any important notes or prerequisites for the user."),
  serviceFee: z.number().optional().describe("The estimated official government fee for the service, in OMR."),
});
export type SanadTaskAnalysisOutput = z.infer<typeof SanadTaskAnalysisOutputSchema>;
