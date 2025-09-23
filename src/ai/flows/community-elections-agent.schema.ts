
import { z } from 'zod';

export const ElectionGeneratorInputSchema = z.object({
  communityName: z.string().min(3, "Community name is required."),
  electionTitle: z.string().min(3, "Election title is required."),
  positions: z.array(z.string()).min(1, "At least one position is required."),
  nominationDeadline: z.string().min(1, "Nomination deadline is required."),
  electionDate: z.string().min(1, "Election date is required."),
});
export type ElectionGeneratorInput = z.infer<typeof ElectionGeneratorInputSchema>;

export const ElectionGeneratorOutputSchema = z.object({
  announcementText: z.string().describe("Markdown formatted text for the official election announcement."),
  nominationFormHtml: z.string().describe("HTML content for a candidate nomination form."),
  ballotHtml: z.string().describe("HTML content for a ballot paper template."),
});
export type ElectionGeneratorOutput = z.infer<typeof ElectionGeneratorOutputSchema>;
