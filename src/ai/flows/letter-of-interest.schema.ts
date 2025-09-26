
'use server';

import {z} from 'zod';

/**
 * @fileOverview Schemas for the Letter of Interest generation flow.
 */
export const GenerateLetterOfInterestInputSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  organizationName: z.string().optional(),
  investorType: z.string().min(1, "Please select an investor type."),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  investmentRange: z.string().optional(),
  areaOfInterest: z.string().min(10, "Please describe your area of interest."),
});
export type GenerateLetterOfInterestInput = z.infer<
  typeof GenerateLetterOfInterestInputSchema
>;

export const GenerateLetterOfInterestOutputSchema = z.object({
  letterContent: z
    .string()
    .describe(
      'The generated Letter of Interest in Markdown format.'
    ),
});
export type GenerateLetterOfInterestOutput = z.infer<
  typeof GenerateLetterOfInterestOutputSchema
>;
