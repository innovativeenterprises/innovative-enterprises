
/**
 * @fileOverview Schemas for the AI StairSpace Matching flow.
 */
import { z } from 'zod';
import { StairspaceListingSchema } from '@/lib/stairspace.schema';

export const StairspaceMatcherInputSchema = z.object({
  userRequirements: z.string().min(10, "Please describe your needs in more detail."),
});
export type StairspaceMatcherInput = z.infer<typeof StairspaceMatcherInputSchema>;

export const StairspaceMatcherOutputSchema = z.object({
  bestMatch: z.object({
      property: StairspaceListingSchema.describe("The full object of the best matching property."),
      reasoning: z.string().describe("A brief, professional explanation of why this property is the best match for the user."),
      confidenceScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the confidence in this match."),
  }),
  otherMatches: z.array(StairspaceListingSchema).optional().describe("A list of full property objects for other suitable spaces."),
});
export type StairspaceMatcherOutput = z.infer<typeof StairspaceMatcherOutputSchema>;
