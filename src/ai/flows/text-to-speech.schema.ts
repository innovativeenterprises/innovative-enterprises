/**
 * @fileOverview Schemas for the Text-to-Speech AI flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the TTS AI flow, separating them from server-only code.
 */

import { z } from 'zod';

export const TextToSpeechInputSchema = z.object({
  textToSpeak: z.string().describe("The text to be converted to speech."),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('onyx'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe("The data URI of the generated audio file."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
