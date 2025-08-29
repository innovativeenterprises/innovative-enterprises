
/**
 * @fileOverview Schemas and types for the AI Legal Agent flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the legal agent AI flow. These are
 * separated to allow client-side components to import them without
 * pulling in server-only code.
 */

import { z } from 'zod';

// Define the input for the router
export const LegalAgentInputSchema = z.object({
  query: z.string().describe("The user's query or instruction."),
});

// Define the schema for the final output that the chat component will receive.
export const LegalAgentOutputSchema = z.object({
  response: z.string().describe('The primary text response to the user.'),
  disclaimer: z.string().optional().describe('An optional disclaimer, e.g., for legal advice.'),
  isFinalResponse: z.boolean().default(true).describe('Indicates if this is the final message or if more processing is happening.'),
});
export type LegalAgentOutput = z.infer<typeof LegalAgentOutputSchema>;
