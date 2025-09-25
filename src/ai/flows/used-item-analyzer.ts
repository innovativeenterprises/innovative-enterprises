
'use server';

/**
 * @fileOverview An AI agent that analyzes an image of a used item and suggests listing details.
 */

import { ai } from '@/ai/genkit';
import {
    UsedItemAnalysisInput,
    UsedItemAnalysisInputSchema,
    UsedItemAnalysisOutput,
    UsedItemAnalysisOutputSchema,
} from './used-item-analyzer.schema';


export async function analyzeUsedItem(input: UsedItemAnalysisInput): Promise<UsedItemAnalysisOutput> {
  return usedItemAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'usedItemAnalysisPrompt',
  input: { schema: UsedItemAnalysisInputSchema },
  output: { schema: UsedItemAnalysisOutputSchema },
  prompt: `You are an expert appraiser and marketer for a second-hand marketplace in Oman. Your task is to analyze an image of a used item and generate compelling listing details.

**Item Image:**
{{media url=imageDataUri}}

**Instructions:**
1.  **Identify the Item:** Clearly identify the main item in the image (e.g., "Leather Sofa", "Samsung 42-inch TV", "Used iPhone 12").
2.  **Categorize:** Assign a suitable marketplace category for the item (e.g., "Furniture", "Electronics", "Home Appliances", "Apparel").
3.  **Write a Description:** Draft a concise, appealing one-paragraph description for the item. Mention its key features and potential uses. Be honest about its likely condition as a used item.
4.  **Estimate Price (OMR):** Based on the identified item and its likely used condition, estimate a fair market price in **Omani Rials (OMR)**. This should be a reasonable price for a second-hand marketplace.

Return the complete analysis in the specified structured JSON format.
`,
});

const usedItemAnalysisFlow = ai.defineFlow(
  {
    name: 'usedItemAnalysisFlow',
    inputSchema: UsedItemAnalysisInputSchema,
    outputSchema: UsedItemAnalysisOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: UsedItemAnalysisOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
