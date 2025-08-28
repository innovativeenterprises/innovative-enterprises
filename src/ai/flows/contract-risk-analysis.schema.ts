/**
 * @fileOverview Schemas for the Contract Risk Analysis AI flow.
 */
import { z } from 'zod';

export const ContractRiskAnalysisInputSchema = z.object({
  documentDataUri: z.string().describe(
    "The contract document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  analysisType: z.enum(['Standard', 'Deep Dive', 'Compliance Focus']).describe("The type of analysis to perform."),
});
export type ContractRiskAnalysisInput = z.infer<typeof ContractRiskAnalysisInputSchema>;


const IdentifiedRiskSchema = z.object({
  riskCategory: z.enum(['Financial', 'Liability', 'Compliance', 'Intellectual Property', 'Termination', 'Unfair Terms', 'Ambiguity', 'Other'])
    .describe('The category of the identified risk.'),
  clause: z.string().describe('The specific clause or section number related to the risk.'),
  description: z.string().describe('A clear description of the potential risk.'),
  severity: z.enum(['High', 'Medium', 'Low']).describe('The assessed severity of the risk.'),
  recommendation: z.string().describe('A suggested action to mitigate the risk (e.g., "Amend clause to clarify...", "Seek legal counsel on this point.").'),
});

export const ContractRiskAnalysisOutputSchema = z.object({
  overallRiskScore: z.number().min(0).max(100).describe('A score from 0 (very low risk) to 100 (very high risk).'),
  executiveSummary: z.string().describe('A high-level summary of the contract\'s risk profile.'),
  identifiedRisks: z.array(IdentifiedRiskSchema).describe('A detailed list of all risks identified in the document.'),
});
export type ContractRiskAnalysisOutput = z.infer<typeof ContractRiskAnalysisOutputSchema>;
