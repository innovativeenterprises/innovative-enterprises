
/**
 * @fileOverview Schemas and types for the Image Annotation AI flow.
 */

import { z } from 'zod';

export const ImageAnnotatorInputSchema = z.object({
  baseImageUri: z.string().describe("The base image to be scanned and measured, as a data URI."),
  prompt: z.string().optional().describe('Optional user instructions to guide the analysis.'),
});
export type ImageAnnotatorInput = z.infer<typeof ImageAnnotatorInputSchema>;

export const ImageAnnotatorOutputSchema = z.object({
  annotatedImageUri: z.string().describe("The new, annotated image showing measurements, as a data URI."),
  identifiedObject: z.string().describe("The name of the main object identified in the image."),
  estimatedDimensions: z.object({
      height: z.string().describe("Estimated height with units (e.g., '15 cm')."),
      width: z.string().describe("Estimated width with units (e.g., '10 cm')."),
      depth: z.string().describe("Estimated depth with units (e.g., '8 cm')."),
  }),
  otherMetrics: z.string().optional().describe("Any other relevant metrics identified, such as volume or weight."),
});
export type ImageAnnotatorOutput = z.infer<typeof ImageAnnotatorOutputSchema>;
