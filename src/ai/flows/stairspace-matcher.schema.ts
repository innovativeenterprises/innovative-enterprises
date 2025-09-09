/**
 * @fileOverview Schemas for the AI StairSpace Matching flow.
 */
import { z } from 'zod';
import type { StairspaceListing } from '@/lib/stairspace-listings';

export const StairspaceMatcherInputSchema = z.object({
  userRequirements: z.string().min(10, "Please describe your needs in more detail."),
});
export type StairspaceMatcherInput = z.infer<typeof StairspaceMatcherInputSchema>;

export const StairspaceMatcherOutputSchema = z.object({
  bestMatch: z.object({
      propertyId: z.number().describe("The ID of the best matching StairSpace listing."),
      reasoning: z.string().describe("A brief, professional explanation of why this space is the best match for the user."),
      confidenceScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the confidence in this match."),
  }),
  otherMatches: z.array(z.number()).optional().describe("A list of IDs of other suitable spaces."),
});
export type StairspaceMatcherOutput = z.infer<typeof StairspaceMatcherOutputSchema>;
