/**
 * @fileOverview Schemas and types for the Financial Document Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the financial document analysis AI flow.
 */

import { z } from 'zod';

export const FinancialAnalysisInputSchema = z.object({
    financialDocuments: z.array(z.string()).describe("A list of financial documents (e.g., balance sheets, income statements) as data URIs."),
    analysisType: z.enum(['Full Audit', 'Compliance Check', 'Internal Review', 'Forensic Analysis']),
    companyName: z.string(),
    fiscalYear: z.string(),
});
export type FinancialAnalysisInput = z.infer<typeof FinancialAnalysisInputSchema>;

export const FinancialAnalysisOutputSchema = z.object({
    executiveSummary: z.string().describe("A brief, high-level summary of the findings."),
    keyMetrics: z.object({
        totalRevenue: z.string().optional().describe("e.g., 'OMR 1.2M'"),
        netProfit: z.string().optional().describe("e.g., 'OMR 250K'"),
        profitMargin: z.string().optional().describe("e.g., '20.8%'"),
        currentRatio: z.string().optional().describe("e.g., '1.8'"),
        debtToEquityRatio: z.string().optional().describe("e.g., '0.5'"),
    }),
    potentialRedFlags: z.array(z.string()).describe("A list of potential issues or areas of concern identified during the analysis."),
    dataCompletenessScore: z.number().min(0).max(100).describe("A score from 0-100 indicating how complete and sufficient the provided documents were for the requested analysis type."),
});
export type FinancialAnalysisOutput = z.infer<typeof FinancialAnalysisOutputSchema>;
