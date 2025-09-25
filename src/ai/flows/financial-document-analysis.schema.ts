

'use server';

import { z } from 'zod';

/**
 * @fileOverview Schemas for the financial document analysis flow.
 */

export const FinancialAnalysisInputSchema = z.object({
  financialDocuments: z.array(z.string().url()).describe("An array of data URIs of the financial documents (PDFs, images, etc.)."),
  analysisType: z.enum(['Internal Review', 'Compliance Check', 'Full Audit', 'Forensic Analysis']),
  companyName: z.string(),
  fiscalYear: z.string(),
});
export type FinancialAnalysisInput = z.infer<typeof FinancialAnalysisInputSchema>;

export const FinancialAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe("A concise one-paragraph summary of the findings."),
  keyMetrics: z.object({
    totalRevenue: z.string().optional(),
    netProfit: z.string().optional(),
    profitMargin: z.string().optional(),
    currentRatio: z.string().optional(),
    debtToEquityRatio: z.string().optional(),
  }).describe("Key financial metrics extracted from the documents."),
  potentialRedFlags: z.array(z.string()).describe("A list of identified potential issues or red flags."),
  dataCompletenessScore: z.number().int().min(0).max(100).describe("A score from 0-100 indicating the sufficiency of the documents for the analysis type."),
});
export type FinancialAnalysisOutput = z.infer<typeof FinancialAnalysisOutputSchema>;
