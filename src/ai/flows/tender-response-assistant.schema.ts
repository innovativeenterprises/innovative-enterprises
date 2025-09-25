
'use server';

import {z} from 'zod';

/**
 * @fileOverview Schemas for the Tender Response Assistant flow.
 */
export const GenerateTenderResponseInputSchema = z.object({
  tenderDocuments: z.array(z.string().url()).describe("An array of data URIs for the tender documents."),
  companyName: z.string().optional(),
  projectName: z.string().optional(),
  tenderingAuthority: z.string().optional(),
  estimatedCost: z.number().optional(),
  priceValidityDays: z.number().optional(),
  estimatedSchedule: z.string().optional(),
  contactInfo: z.string().optional(),
  companyOverview: z.string().optional(),
  relevantExperience: z.string().optional(),
  projectTeam: z.string().optional(),
  projectRequirements: z.string().describe('A summary of the key requirements of the tender.'),
});
export type GenerateTenderResponseInput = z.infer<
  typeof GenerateTenderResponseInputSchema
>;

export const GenerateTenderResponseOutputSchema = z.object({
  draftResponse: z
    .string()
    .describe(
      'The generated draft tender response in Markdown format.'
    ),
});
export type GenerateTenderResponseOutput = z.infer<
  typeof GenerateTenderResponseOutputSchema
>;
