
'use server';

/**
 * @fileOverview An AI agent that provides preliminary analysis of legal contracts.
 */

import { ai } from '@/ai/genkit';
import {
    ContractRiskAnalysisInput,
    ContractRiskAnalysisInputSchema,
    ContractRiskAnalysisOutput,
    ContractRiskAnalysisOutputSchema,
} from './contract-risk-analysis.schema';

export async function analyzeContract(input: ContractRiskAnalysisInput): Promise<ContractRiskAnalysisOutput> {
  return contractRiskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contractRiskAnalysisPrompt',
  input: { schema: ContractRiskAnalysisInputSchema },
  output: { schema: ContractRiskAnalysisOutputSchema },
  prompt: `You are "Lexi," an expert AI legal analyst specializing in contract risk assessment for Omani and international law. Your task is to perform a detailed risk analysis of the provided legal document.

**Engagement Details:**
- **Analysis Type Requested:** {{{analysisType}}}

**Contract Document Provided:**
- Document: {{media url=documentDataUri}}

**Instructions:**
1.  **Analyze Document:** Meticulously review the entire contract.
2.  **Identify Risks:** Identify all clauses that could pose a risk. For each risk, you must:
    *   **Categorize the Risk:** Classify it as Financial, Liability, Compliance, Intellectual Property, Termination, Unfair Terms, Ambiguity, or Other.
    *   **Identify the Clause:** Pinpoint the exact clause number or section (e.g., "Clause 7.1.b").
    *   **Describe the Risk:** Clearly explain why the clause is a risk.
    *   **Assess Severity:** Rate the severity as High, Medium, or Low.
    *   **Provide a Recommendation:** Suggest a specific, actionable step to mitigate the risk. (e.g., "Amend clause to...", "Define the term 'Net Profits' clearly.").
3.  **Calculate Overall Risk Score:** Based on the number and severity of the identified risks, calculate an overall risk score from 0 (very low risk) to 100 (very high risk). A standard, well-balanced contract might score around 20-30. A contract with multiple high-severity risks could score 70+.
4.  **Write an Executive Summary:** Provide a concise, high-level summary of the contract's risk profile, highlighting the most critical areas of concern.

Return the complete analysis in the specified structured JSON format.
`,
});

const contractRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'contractRiskAnalysisFlow',
    inputSchema: ContractRiskAnalysisInputSchema,
    outputSchema: ContractRiskAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
