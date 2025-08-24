/**
 * @fileOverview Schemas and types for the Letter of Interest generation flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the letter of interest generation AI flow.
 */

import { z } from 'zod';

export const GenerateLetterOfInterestInputSchema = z.object({
  fullName: z.string().describe("The full name of the potential investor or their organization's contact person."),
  organizationName: z.string().optional().describe("The name of the investor's organization or fund."),
  investmentRange: z.string().optional().describe("The potential investment range they have indicated."),
  areaOfInterest: z.string().describe("The investor's stated area of interest (e.g., specific projects, technologies)."),
  phone: z.string().optional().describe("The investor's phone number."),
  country: z.string().optional().describe("The investor's country of residence."),
  investorType: z.enum(['Angel', 'Venture Capital', 'Corporate', 'Individual', 'Other']).optional().describe("The type of investor."),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
export type GenerateLetterOfInterestInput = z.infer<typeof GenerateLetterOfInterestInputSchema>;


export const GenerateLetterOfInterestOutputSchema = z.object({
  letterContent: z.string().describe("The full content of the generated Letter of Interest in Markdown format."),
});
export type GenerateLetterOfInterestOutput = z.infer<typeof GenerateLetterOfInterestOutputSchema>;
