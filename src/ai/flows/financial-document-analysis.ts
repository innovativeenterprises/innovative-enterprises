
'use server';

/**
 * @fileOverview An AI agent that provides preliminary analysis of financial documents.
 * - analyzeFinancialDocuments - A function that analyzes financial statements.
 */

import { ai } from '@/ai/genkit';
import {
    FinancialAnalysisInput,
    FinancialAnalysisInputSchema,
    FinancialAnalysisOutput,
    FinancialAnalysisOutputSchema,
} from './financial-document-analysis.schema';

export async function analyzeFinancialDocuments(input: FinancialAnalysisInput): Promise<FinancialAnalysisOutput> {
  return financialAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAnalysisPrompt',
  input: { schema: FinancialAnalysisInputSchema },
  output: { schema: FinancialAnalysisOutputSchema },
  prompt: `You are an expert financial auditor AI. Your task is to perform a preliminary analysis of the provided financial documents for a client.

**Client & Engagement Details:**
- **Company Name:** {{{companyName}}}
- **Fiscal Year:** {{{fiscalYear}}}
- **Analysis Type Requested:** {{{analysisType}}}

**Financial Documents Provided:**
{{#each financialDocuments}}
- Document: {{media url=this}}
{{/each}}

**Instructions:**
1.  **Analyze Documents:** Carefully review all provided financial documents (e.g., Balance Sheet, Income Statement, Cash Flow Statement).
2.  **Extract Key Metrics:** Extract or calculate the following key financial metrics. Present them in a clear, standardized format (e.g., "OMR 1.2M", "15.2%"). If a metric cannot be determined, leave it blank.
    *   Total Revenue
    *   Net Income
    *   Profit Margin
    *   Current Ratio (Current Assets / Current Liabilities)
    *   Debt-to-Equity Ratio
3.  **Write an Executive Summary:** Based on your analysis, write a concise, one-paragraph executive summary of the company's financial health for the specified fiscal year.
4.  **Identify Potential Red Flags:** Based on the requested analysis type ({{{analysisType}}}), list any potential red flags, anomalies, or areas that would require deeper investigation during a formal audit. Examples: unusually high expenses in a specific category, significant changes in inventory without corresponding sales changes, potential compliance issues.
5.  **Score Data Completeness:** Rate the provided documents on a scale of 0-100 based on how complete they are for performing the requested analysis type. A full audit would require more comprehensive data than a simple internal review.

Return the complete analysis in the specified structured JSON format.
`,
});

const financialAnalysisFlow = ai.defineFlow(
  {
    name: 'financialAnalysisFlow',
    inputSchema: FinancialAnalysisInputSchema,
    outputSchema: FinancialAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
