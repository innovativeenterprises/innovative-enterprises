/**
 * @fileOverview Schemas for the AI-POS Sales Analyst flow.
 */
import { z } from 'zod';
import { TransactionSchema } from '@/lib/pos-data';

export const SalesAnalysisInputSchema = z.object({
  query: z.string().describe("The user's natural language question about the sales data."),
  transactions: z.array(TransactionSchema).describe("An array of all sales transactions for the day."),
});
export type SalesAnalysisInput = z.infer<typeof SalesAnalysisInputSchema>;

export const SalesAnalysisOutputSchema = z.object({
  response: z.string().describe("A conversational answer to the user's question."),
  dataSummary: z.string().optional().describe("A specific data point or summary that directly answers the question (e.g., 'OMR 1,234.56', 'Cappuccino (15 units)')."),
  suggestedReplies: z.array(z.string()).optional().describe("A list of relevant follow-up questions the user might ask."),
});
export type SalesAnalysisOutput = z.infer<typeof SalesAnalysisOutputSchema>;
