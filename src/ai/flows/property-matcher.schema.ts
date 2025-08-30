/**
 * @fileOverview Schemas for the AI Property Matching flow.
 */
import { z } from 'zod';
import type { Property } from '@/lib/properties';

export const PropertyMatcherInputSchema = z.object({
  userRequirements: z.string().min(10, "Please describe your needs in more detail."),
});
export type PropertyMatcherInput = z.infer<typeof PropertyMatcherInputSchema>;

export const PropertyMatcherOutputSchema = z.object({
  bestMatch: z.object({
      propertyId: z.string().describe("The ID of the best matching property."),
      reasoning: z.string().describe("A brief, professional explanation of why this property is the best match for the user."),
      confidenceScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the confidence in this match."),
  }),
  otherMatches: z.array(z.string()).optional().describe("A list of IDs of other suitable properties."),
});
export type PropertyMatcherOutput = z.infer<typeof PropertyMatcherOutputSchema>;
