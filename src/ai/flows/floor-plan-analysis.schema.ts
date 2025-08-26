/**
 * @fileOverview Schemas and types for the Floor Plan Analysis AI flow.
 */

import { z } from 'zod';

export const FloorPlanAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A floor plan, sketch, or photo of a building, as a data URI."
    ),
});
export type FloorPlanAnalysisInput = z.infer<typeof FloorPlanAnalysisInputSchema>;


export const FloorPlanAnalysisOutputSchema = z.object({
  dimensions: z.string().optional().describe("The estimated dimensions of the building (e.g., '20m x 15m, 2 floors')."),
  suggestedDvrLocation: z.string().optional().describe("A suggested logical location for the DVR/NVR and main switch (e.g., 'IT Room', 'Under the stairs')."),
});
export type FloorPlanAnalysisOutput = z.infer<typeof FloorPlanAnalysisOutputSchema>;
