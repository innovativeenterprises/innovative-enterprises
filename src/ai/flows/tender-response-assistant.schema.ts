/**
 * @fileOverview Schemas and types for the Tender Response Assistant flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the tender response generation AI flow.
 */

import {z} from 'zod';

export const GenerateTenderResponseInputSchema = z.object({
  tenderDocuments: z
    .array(z.string())
    .describe(
      'A list of tender documents as data URIs. Each must include a MIME type and use Base64 encoding.' 
    ),
  projectRequirements: z.string().describe('The specific requirements for the project.'),
});
export type GenerateTenderResponseInput = z.infer<typeof GenerateTenderResponseInputSchema>;

export const GenerateTenderResponseOutputSchema = z.object({
  draftResponse: z.string().describe('The generated draft response to the tender.'),
});
export type GenerateTenderResponseOutput = z.infer<typeof GenerateTenderResponseOutputSchema>;
