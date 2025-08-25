/**
 * @fileOverview Schemas and types for the Commercial Record Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the CR analysis AI flow.
 */

import { z } from 'zod';

export const CrAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The Commercial Record (CR) document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type CrAnalysisInput = z.infer<typeof CrAnalysisInputSchema>;


export const CrAnalysisOutputSchema = z.object({
  companyName: z.string().optional().describe("The official name of the company."),
  contactName: z.string().optional().describe("The name of the primary contact or manager listed."),
  email: z.string().email().optional().describe("The contact email address found in the document."),
  activities: z.string().optional().describe("A summary of the business activities or services offered."),
});
export type CrAnalysisOutput = z.infer<typeof CrAnalysisOutputSchema>;

    