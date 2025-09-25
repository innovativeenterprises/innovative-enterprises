
import { z } from 'zod';
import { PropertySchema } from '@/lib/properties.schema';

export const PropertyMatcherInputSchema = z.object({
  userRequirements: z.string().min(10, 'Please describe what you are looking for in more detail.'),
});
export type PropertyMatcherInput = z.infer<typeof PropertyMatcherInputSchema>;

export const PropertyMatcherOutputSchema = z.object({
  bestMatch: z.object({
    property: PropertySchema,
    reasoning: z.string(),
    confidenceScore: z.number().int().min(0).max(100),
  }),
  otherMatches: z.array(z.string()).optional(),
});
export type PropertyMatcherOutput = z.infer<typeof PropertyMatcherOutputSchema>;
