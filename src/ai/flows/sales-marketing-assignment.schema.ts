
import { z } from 'zod';

export const SalesMarketingAssignmentInputSchema = z.object({
  email: z.string().email(),
  whatsappNumber: z.string(),
});
export type SalesMarketingAssignmentInput = z.infer<typeof SalesMarketingAssignmentInputSchema>;

export const SalesMarketingAssignmentOutputSchema = z.object({
  assignmentTitle: z.string().describe("A clear, concise title for the assignment."),
  assignmentHtml: z.string().describe("The full assignment description and tasks, formatted as a single HTML string."),
});
export type SalesMarketingAssignmentOutput = z.infer<typeof SalesMarketingAssignmentOutputSchema>;
