
import { z } from 'zod';

export const ImageTransformerInputSchema = z.object({
  baseImageUri: z.string().url().describe("The data URI of the base image to transform."),
  prompt: z.string().describe("A text prompt describing the transformation to apply."),
});
export type ImageTransformerInput = z.infer<typeof ImageTransformerInputSchema>;

export const ImageTransformerOutputSchema = z.object({
  imageDataUri: z.string().url().describe("The data URI of the new, transformed image."),
});
export type ImageTransformerOutput = z.infer<typeof ImageTransformerOutputSchema>;
