/**
 * @fileOverview Schemas and types for the Financial Document Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the financial analysis AI flow.
 */

import { z } from 'zod';

export const FinancialAnalysisInputSchema = z.object({
  financialDocuments: z.array(z.string()).min(1, 'At least one document is required.').describe(
    "A list of financial documents (e.g., balance sheet, income statement) as data URIs."
  ),
  analysisType: z.enum(['Full Audit', 'Compliance Check', 'Internal Review', 'Forensic Analysis']),
  companyName: z.string().min(1, 'Company name is required.'),
  fiscalYear: z.string().min(4, 'Fiscal year is required.'),
});
export type FinancialAnalysisInput = z.infer<typeof FinancialAnalysisInputSchema>;


export const FinancialAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe("A high-level summary of the company's financial health."),
  keyMetrics: z.object({
    totalRevenue: z.string().optional(),
    netIncome: z.string().optional(),
    profitMargin: z.string().optional(),
    currentRatio: z.string().optional(),
    debtToEquityRatio: z.string().optional(),
  }).describe("Key financial metrics extracted or calculated from the documents."),
  potentialRedFlags: z.array(z.string()).describe("A list of potential red flags or areas requiring further investigation."),
  dataCompletenessScore: z.number().min(0).max(100).describe("A score from 0-100 indicating the completeness of the provided data for the requested analysis."),
});
export type FinancialAnalysisOutput = z.infer<typeof FinancialAnalysisOutputSchema>;
