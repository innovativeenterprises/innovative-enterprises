
import { z } from 'zod';
import { TransactionSchema } from '@/lib/pos-data.schema';

export const SalesAnalysisInputSchema = z.object({
  query: z.string(),
  transactions: z.array(TransactionSchema),
});
export type SalesAnalysisInput = z.infer<typeof SalesAnalysisInputSchema>;

export const SalesAnalysisOutputSchema = z.object({
  response: z.string().describe("A conversational answer to the user's question."),
  dataSummary: z.string().optional().describe("A single, key data point that answers the query (e.g., a number, a name)."),
  suggestedReplies: z.array(z.string()).optional(),
});
export type SalesAnalysisOutput = z.infer<typeof SalesAnalysisOutputSchema>;
