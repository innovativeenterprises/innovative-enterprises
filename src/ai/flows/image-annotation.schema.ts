
/**
 * @fileOverview Schemas and types for the Image Annotation AI flow.
 */

import { z } from 'zod';

export const ImageAnnotationInputSchema = z.object({
  baseImageUri: z.string().describe("The base image to be annotated, as a data URI."),
  prompt: z.string().describe('A detailed text description of the annotations to apply.'),
});
export type ImageAnnotationInput = z.infer<typeof ImageAnnotationInputSchema>;

export const ImageAnnotationOutputSchema = z.object({
  imageDataUri: z.string().describe("The new, annotated image as a data URI."),
});
export type ImageAnnotationOutput = z.infer<typeof ImageAnnotationOutputSchema>;
