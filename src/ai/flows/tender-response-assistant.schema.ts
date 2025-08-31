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
  // Optional detailed fields
  companyName: z.string().optional().describe("The user's company name."),
  projectName: z.string().optional().describe("The name of the project from the tender."),
  tenderingAuthority: z.string().optional().describe("The name of the organization that issued the tender."),
  companyOverview: z.string().optional().describe("A brief description of the user's company."),
  relevantExperience: z.string().optional().describe("Details of relevant past projects or experience."),
  projectTeam: z.string().optional().describe("Key members of the proposed project team."),
  estimatedCost: z.number().optional().describe("The estimated cost for the project."),
  priceValidityDays: z.coerce.number().optional().describe("How many days the financial proposal is valid for."),
  estimatedSchedule: z.string().optional().describe("The estimated time to complete the project (e.g., '6 months')."),
  contactInfo: z.string().optional().describe("The contact person's name, title, and contact details for the proposal."),
});
export type GenerateTenderResponseInput = z.infer<typeof GenerateTenderResponseInputSchema>;

export const GenerateTenderResponseOutputSchema = z.object({
  draftResponse: z.string().describe('The generated draft response to the tender.'),
});
export type GenerateTenderResponseOutput = z.infer<typeof GenerateTenderResponseOutputSchema>;
