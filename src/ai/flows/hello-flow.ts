
'use server';

/**
 * @fileOverview A simple "hello world" flow to demonstrate basic Genkit functionality.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the flow
export const HelloFlowInputSchema = z.object({
  name: z.string().describe("The name to include in the greeting."),
});
export type HelloFlowInput = z.infer<typeof HelloFlowInputSchema>;

// Define the output schema for the flow
export const HelloFlowOutputSchema = z.object({
  greeting: z.string().describe("The generated greeting message."),
});
export type HelloFlowOutput = z.infer<typeof HelloFlowOutputSchema>;


/**
 * A simple flow that takes a name and returns a greeting from the AI.
 * @param input The input object containing the name.
 * @returns An object containing the generated greeting.
 */
export async function helloFlow(input: HelloFlowInput): Promise<HelloFlowOutput> {
  const llmResponse = await ai.generate({
    prompt: `Hello Gemini, my name is ${input.name}. Respond with a short, friendly greeting.`,
  });
  
  return { greeting: llmResponse.text };
}
