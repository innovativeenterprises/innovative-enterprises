'use server';

/**
 * @fileOverview An AI agent that provides preliminary legal analysis.
 *
 * This file contains the server-side logic for the legal agent flow.
 * It is intended to be used as a Next.js Server Action.
 *
 * - askLegalAgent - A function that generates a legal analysis.
 */

import { ai } from '@/ai/genkit';
import {
  LegalAgentInput,
  LegalAgentInputSchema,
  LegalAgentOutput,
  LegalAgentOutputSchema,
} from './legal-agent.schema';

export async function askLegalAgent(input: LegalAgentInput): Promise<LegalAgentOutput> {
  return legalAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalAgentPrompt',
  input: { schema: LegalAgentInputSchema },
  output: { schema: LegalAgentOutputSchema },
  prompt: `You are an AI Legal Assistant. Your task is to provide a preliminary analysis of a legal question.

Question: {{{question}}}

Based on the question, provide a general analysis. Your analysis should be informative but general in nature.

IMPORTANT: Always conclude your response with the following disclaimer: "This is an AI-generated analysis and not a substitute for professional legal advice from a qualified attorney. Please consult with a legal professional for advice specific to your situation." Set this disclaimer in the 'disclaimer' output field.
`,
});

const legalAgentFlow = ai.defineFlow(
  {
    name: 'legalAgentFlow',
    inputSchema: LegalAgentInputSchema,
    outputSchema: LegalAgentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
