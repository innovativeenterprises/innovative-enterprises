
/**
 * @fileOverview Schemas and types for the AI Interview Feedback flow.
 */

import { z } from 'zod';

export const InterviewFeedbackInputSchema = z.object({
  question: z.string().describe("The interview question that was asked."),
  answer: z.string().describe("The user's spoken or written answer to the question."),
});
export type InterviewFeedbackInput = z.infer<typeof InterviewFeedbackInputSchema>;

export const InterviewFeedbackOutputSchema = z.object({
  positiveFeedback: z.string().describe("Specific, positive feedback on what the user did well in their answer."),
  improvementSuggestions: z.string().describe("Constructive suggestions on how the user could improve their answer."),
  suggestedAnswer: z.string().describe("An example of a strong, well-structured answer to the same question."),
});
export type InterviewFeedbackOutput = z.infer<typeof InterviewFeedbackOutputSchema>;
