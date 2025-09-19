
import { z } from 'zod';

export const TextToSpeechInputSchema = z.object({
  textToSpeak: z.string().min(1, "Text to speak cannot be empty."),
  voice: z.enum(['onyx', 'nova', 'echo', 'alloy', 'fable', 'shimmer']).optional(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().url().describe("The data URI of the generated audio file."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
