
'use server';

/**
 * @fileOverview An AI agent that analyzes financial documents for audit and review.
 *
 * - analyzeFinancialDocuments - A function that performs the analysis.
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
  prompt: `You are an expert forensic accountant and auditor AI named "Finley". Your task is to perform a preliminary financial analysis based on the provided documents.

**Analysis Context:**
- **Company:** {{{companyName}}}
- **Fiscal Year:** {{{fiscalYear}}}
- **Analysis Type:** {{{analysisType}}}

**Financial Documents:**
{{#each financialDocuments}}
- Document: {{media url=this}}
{{/each}}

**Instructions:**

1.  **Analyze Documents:** Thoroughly review all provided financial documents (balance sheets, income statements, cash flow statements, etc.).

2.  **Extract Key Metrics:** Calculate or extract the following key financial metrics. Present them as formatted strings (e.g., 'OMR 1.2M', '20.8%'). If a metric cannot be calculated from the provided data, leave the field empty.
    *   Total Revenue
    *   Net Profit
    *   Profit Margin (%)
    *   Current Ratio (Current Assets / Current Liabilities)
    *   Debt-to-Equity Ratio (Total Debt / Total Equity)

3.  **Identify Potential Red Flags:** Based on the requested '{{{analysisType}}}', identify any potential red flags, anomalies, or areas of concern. This is the most important part of your analysis.
    *   For an **Internal Review**, focus on efficiency and profitability.
    *   For a **Compliance Check**, look for deviations from standard accounting principles.
    *   For a **Full Audit**, be comprehensive and skeptical.
    *   For a **Forensic Analysis**, actively look for signs of fraud, such as unusual transactions, round numbers, or inconsistencies between documents.
    *   List at least 2-3 specific, actionable concerns.

4.  **Data Completeness Score:** Provide a score from 0-100 indicating how sufficient the provided documents were to perform the requested analysis type. A 'Full Audit' with only an income statement would have a very low score.

5.  **Executive Summary:** Write a concise, one-paragraph summary of your findings, highlighting the company's financial health and your main concerns.

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
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: FinancialAnalysisOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
