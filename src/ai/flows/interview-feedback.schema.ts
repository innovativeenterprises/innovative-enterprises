
import { z } from 'zod';

export const InterviewFeedbackInputSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type InterviewFeedbackInput = z.infer<typeof InterviewFeedbackInputSchema>;

export const InterviewFeedbackOutputSchema = z.object({
  positiveFeedback: z.string(),
  improvementSuggestions: z.string(),
  suggestedAnswer: z.string(),
});
export type InterviewFeedbackOutput = z.infer<typeof InterviewFeedbackOutputSchema>;
