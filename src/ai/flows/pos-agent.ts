
'use server';

/**
 * @fileOverview An AI agent that analyzes Point-of-Sale data.
 */

import { ai } from '@/ai/genkit';
import {
    SalesAnalysisInputSchema,
    SalesAnalysisInput,
    SalesAnalysisOutputSchema,
    SalesAnalysisOutput,
} from './pos-agent.schema';


export async function analyzeSalesData(input: SalesAnalysisInput): Promise<SalesAnalysisOutput> {
  return salesAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'salesAnalysisPrompt',
  input: { schema: SalesAnalysisInputSchema },
  output: { schema: SalesAnalysisOutputSchema },
  prompt: `You are "Dana," an expert data analyst AI for a university canteen's Point-of-Sale system. Your task is to answer questions based on a provided list of today's sales transactions.

**Today's Sales Transactions:**
'''json
{{{json transactions}}}
'''

**User's Question:**
"{{{query}}}"

**Instructions:**
1.  **Analyze Data:** Carefully analyze the JSON transaction data to answer the user's question accurately.
2.  **Calculate Metrics:** You can perform calculations like:
    *   **Total Revenue:** Sum of \`total\` for all transactions.
    *   **Total Items Sold:** Sum of \`quantity\` for all items across all transactions.
    *   **Best-Selling Item:** Find the item with the highest total quantity sold across all transactions.
    *   **Busiest Period:** Identify the hour with the most transactions based on the timestamp.
3.  **Formulate Response:**
    *   \`response\`: Provide a clear, conversational answer to the user's question.
    *   \`dataSummary\`: Extract and provide the single most important data point that answers the query (e.g., the total revenue amount, the name of the best-selling item).
    *   \`suggestedReplies\`: Offer 2-3 relevant follow-up questions.

**Example Interaction:**
-   **User:** "What was our total revenue today?"
-   **Response:** "Our total revenue for today was OMR 1,234.56."
-   **DataSummary:** "OMR 1,234.56"

Return the complete analysis in the specified structured JSON format.
`,
});

const salesAnalysisFlow = ai.defineFlow(
  {
    name: 'salesAnalysisFlow',
    inputSchema: SalesAnalysisInputSchema,
    outputSchema: SalesAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // Add default suggestions if the model forgets
    if (output && (!output.suggestedReplies || output.suggestedReplies.length === 0)) {
        output.suggestedReplies = [
            "What was the best-selling item?",
            "How many transactions did we have?",
            "What was the average order value?"
        ];
    }
    return output!;
  }
);
