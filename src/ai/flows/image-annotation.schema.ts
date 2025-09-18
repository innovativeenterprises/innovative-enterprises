import { z } from 'zod';

export const ImageAnnotatorInputSchema = z.object({
  baseImageUri: z.string().url().describe("The data URI of the image to annotate."),
  prompt: z.string().optional().describe("Optional text prompt to guide the annotation, e.g., 'place fire extinguishers'"),
});
export type ImageAnnotatorInput = z.infer<typeof ImageAnnotatorInputSchema>;


export const ImageAnnotatorOutputSchema = z.object({
  annotatedImageUri: z.string().url().describe("The data URI of the new, annotated image."),
  identifiedObject: z.string().describe("The name of the main object identified in the image."),
  estimatedDimensions: z.object({
    height: z.string().describe("Estimated height with units (e.g., '15 cm')."),
    width: z.string().describe("Estimated width with units (e.g., '10 cm')."),
    depth: z.string().describe("Estimated depth with units (e.g., '8 cm')."),
  }),
  otherMetrics: z.string().optional().describe("Any other relevant metrics identified, such as volume or weight."),
});
export type ImageAnnotatorOutput = z.infer<typeof ImageAnnotatorOutputSchema>;
