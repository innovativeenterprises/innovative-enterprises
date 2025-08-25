/**
 * @fileOverview Schemas and types for the Agreement Generation flow.
 */

import { z } from 'zod';
import { CrAnalysisOutputSchema } from './cr-analysis.schema';
import { IdentityAnalysisOutputSchema } from './identity-analysis.schema';

export const AgreementGenerationInputSchema = z.object({
  applicantType: z.enum(['individual', 'company']),
  companyData: CrAnalysisOutputSchema.optional(),
  individualData: IdentityAnalysisOutputSchema.optional(),
  representativeData: IdentityAnalysisOutputSchema.optional(), // For company reps
});
export type AgreementGenerationInput = z.infer<typeof AgreementGenerationInputSchema>;


export const AgreementGenerationOutputSchema = z.object({
  ndaContent: z.string().describe("The full content of the generated Non-Disclosure Agreement in Markdown format."),
  serviceAgreementContent: z.string().describe("The full content of the generated Service Agreement in Markdown format."),
});
export type AgreementGenerationOutput = z.infer<typeof AgreementGenerationOutputSchema>;
