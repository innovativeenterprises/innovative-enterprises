
/**
 * @fileOverview Schemas and types for the Image Annotation AI flow.
 */

import { z } from 'zod';

export const ImageAnnotatorInputSchema = z.object({
  baseImageUri: z.string().describe("The base image to be transformed, as a data URI."),
  prompt: z.string().describe('A detailed text description of the transformation to apply.'),
});
export type ImageAnnotatorInput = z.infer<typeof ImageAnnotatorInputSchema>;

export const ImageAnnotatorOutputSchema = z.object({
  imageDataUri: z.string().describe("The new, transformed image as a data URI."),
});
export type ImageAnnotatorOutput = z.infer<typeof ImageAnnotatorOutputSchema>;
