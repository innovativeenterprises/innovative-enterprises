
/**
 * @fileOverview Schemas and types for the Business Hub AI Agent flow.
 */

import { z } from 'zod';

export const BusinessHubAgentInputSchema = z.object({
  query: z.string().describe('The user\'s query about finding a business or service.'),
  businessCategories: z.array(z.string()).describe('A list of available business categories.'),
});
export type BusinessHubAgentInput = z.infer<typeof BusinessHubAgentInputSchema>;

export const BusinessHubAgentOutputSchema = z.object({
  response: z.string().describe('The helpful response from the AI agent.'),
  suggestedCategory: z.string().optional().describe('A specific business category suggested to the user.'),
  clarificationNeeded: z.boolean().describe('Whether the agent needs more information from the user.'),
});
export type BusinessHubAgentOutput = z.infer<typeof BusinessHubAgentOutputSchema>;
