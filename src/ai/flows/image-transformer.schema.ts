
/**
 * @fileOverview Schemas and types for the Image Transformation AI flow.
 */

import { z } from 'zod';

export const ImageTransformerInputSchema = z.object({
  baseImageUri: z.string().describe("The base image to be transformed, as a data URI."),
  prompt: z.string().describe('A detailed text description of the transformation to apply.'),
});
export type ImageTransformerInput = z.infer<typeof ImageTransformerInputSchema>;

export const ImageTransformerOutputSchema = z.object({
  imageDataUri: z.string().describe("The new, transformed image as a data URI."),
});
export type ImageTransformerOutput = z.infer<typeof ImageTransformerOutputSchema>;
