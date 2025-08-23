/**
 * @fileOverview Schemas and types for the AI Legal Agent flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the legal agent AI flow. These are
 * separated to allow client-side components to import them without
 * pulling in server-only code.
 */

import { z } from 'zod';

export const LegalAgentInputSchema = z.object({
  question: z.string().describe('The user\'s legal question or topic for analysis.'),
});
export type LegalAgentInput = z.infer<typeof LegalAgentInputSchema>;

export const LegalAgentOutputSchema = z.object({
  analysis: z.string().describe('The generated legal analysis or answer.'),
  disclaimer: z.string().describe('A disclaimer stating this is not real legal advice.'),
});
export type LegalAgentOutput = z.infer<typeof LegalAgentOutputSchema>;
