
'use server';

/**
 * @fileOverview An AI agent that analyzes a Bill of Quantities (BoQ) and provides a cost estimation.
 */

import { ai } from '@/ai/genkit';
import {
    BoQEstimatorInputSchema,
    BoQEstimatorInput,
    BoQEstimatorOutputSchema,
    BoQEstimatorOutput,
} from './boq-estimator.schema';


export async function estimateBoq(input: BoQEstimatorInput): Promise<BoQEstimatorOutput> {
  return boqEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'boqEstimatorPrompt',
  input: { schema: BoQEstimatorInputSchema },
  output: { schema: BoQEstimatorOutputSchema },
  prompt: `You are an expert Quantity Surveyor AI for the Omani construction market. Your task is to analyze a Bill of Quantities (BoQ) provided in CSV format and generate a detailed cost estimation.

**Current Market Rates (OMR):**
You MUST use these provided rates for your calculations.
'''json
{{{json marketRates}}}
'''

**BoQ Data (CSV Format):**
"""
{{{boqCsvText}}}
"""

**Financial Overheads:**
-   **Contingency:** {{{contingencyPercentage}}}%
-   **Profit Margin:** {{{profitMarginPercentage}}}%

**Instructions:**
1.  **Parse and Analyze:** Read the provided CSV data. For each line item, you need to calculate the costs.
2.  **Estimate Costs:** For each item in the BoQ:
    *   Use your knowledge and the provided market rates to determine a reasonable **materialUnitCost** and **laborUnitCost** in OMR.
    *   Match items in the BoQ to the closest equivalent in the market rates list.
    *   Calculate the **totalItemCost** for each item: \`(materialUnitCost + laborUnitCost) * quantity\`.
3.  **Calculate Financial Summary:**
    *   **totalDirectCosts:** Sum all the \`totalItemCost\` values.
    *   **contingencyAmount:** Calculate \`totalDirectCosts * (contingencyPercentage / 100)\`.
    *   **subtotal:** Calculate \`totalDirectCosts + contingencyAmount\`.
    *   **profitAmount:** Calculate \`subtotal * (profitMarginPercentage / 100)\`.
    *   **grandTotal:** Calculate \`subtotal + profitAmount\`.
4.  **Return Structured Data:** Provide the complete, costed list of items and the financial summary in the specified JSON format.

Perform all calculations accurately.
`,
});

const boqEstimatorFlow = ai.defineFlow(
  {
    name: 'boqEstimatorFlow',
    inputSchema: BoQEstimatorInputSchema,
    outputSchema: BoQEstimatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
