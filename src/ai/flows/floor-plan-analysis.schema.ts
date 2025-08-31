
/**
 * @fileOverview Schemas and types for the Floor Plan Analysis AI flow.
 */

import { z } from 'zod';
import { BoQGeneratorInputSchema } from './boq-generator.schema';

export const FloorPlanAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A floor plan, sketch, or photo of a building, as a data URI."
    ),
});
export type FloorPlanAnalysisInput = z.infer<typeof FloorPlanAnalysisInputSchema>;


export const FloorPlanAnalysisOutputSchema = z.object({
  dimensions: z.string().describe("The estimated dimensions of the building (e.g., '20m x 15m'). Return an empty string if not found."),
  suggestedDvrLocation: z.string().describe("A suggested logical location for the DVR/NVR and main switch (e.g., 'IT Room', 'Under the stairs'). Return an empty string if not found."),
  projectType: z.string().describe("The inferred project type from the plan (e.g., 'Residential Villa', 'Commercial Building'). Return an empty string if not found."),
  numberOfFloors: z.number().int().describe("The inferred number of floors from the plan. Return 0 if not found."),
});
export type FloorPlanAnalysisOutput = z.infer<typeof FloorPlanAnalysisOutputSchema>;
