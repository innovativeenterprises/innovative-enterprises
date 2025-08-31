/**
 * @fileOverview Schemas for the Community Elections AI Agent flow.
 */
import { z } from 'zod';

export const ElectionGeneratorInputSchema = z.object({
  communityName: z.string().min(3, 'Community name is required.'),
  electionTitle: z.string().min(5, 'Election title is required.'),
  positions: z.array(z.string()).min(1, 'At least one position is required.'),
  nominationDeadline: z.string().describe('The deadline for candidate nominations (e.g., YYYY-MM-DD).'),
  electionDate: z.string().describe('The date of the election (e.g., YYYY-MM-DD).'),
});
export type ElectionGeneratorInput = z.infer<typeof ElectionGeneratorInputSchema>;

export const ElectionGeneratorOutputSchema = z.object({
  announcementText: z.string().describe('The formatted text for an official election announcement.'),
  nominationFormHtml: z.string().describe('The HTML content for a candidate nomination form.'),
  ballotHtml: z.string().describe('The HTML content for a structured ballot paper.'),
});
export type ElectionGeneratorOutput = z.infer<typeof ElectionGeneratorOutputSchema>;
