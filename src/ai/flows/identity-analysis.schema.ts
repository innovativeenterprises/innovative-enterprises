/**
 * @fileOverview Schemas and types for the Identity Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the identity analysis AI flow, used for onboarding individuals.
 */

import { z } from 'zod';

export const IdentityAnalysisInputSchema = z.object({
  idDocumentUri: z
    .string()
    .describe(
      "The user's identity document (ID card or passport), as a data URI."
    ),
  cvDocumentUri: z
    .string()
    .optional()
    .describe(
      "The user's optional CV document, as a data URI."
    ),
});
export type IdentityAnalysisInput = z.infer<typeof IdentityAnalysisInputSchema>;


export const IdentityAnalysisOutputSchema = z.object({
  fullName: z.string().optional().describe("The full name of the individual."),
  email: z.string().email().optional().describe("The primary email address found."),
  phone: z.string().optional().describe("The primary phone number found."),
  professionalSummary: z.string().optional().describe("A brief summary of the individual's skills and experience from their CV."),
});
export type IdentityAnalysisOutput = z.infer<typeof IdentityAnalysisOutputSchema>;
