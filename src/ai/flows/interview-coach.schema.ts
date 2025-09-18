
import { z } from 'zod';

export const InterviewCoachInputSchema = z.object({
  jobTitle: z.string(),
});
export type InterviewCoachInput = z.infer<typeof InterviewCoachInputSchema>;

export const InterviewQuestionSchema = z.object({
  question: z.string(),
  category: z.enum(['Behavioral', 'Technical', 'Situational', 'Case Study', 'Cultural Fit']),
});
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;


export const InterviewCoachOutputSchema = z.object({
  questions: z.array(InterviewQuestionSchema),
});
export type InterviewCoachOutput = z.infer<typeof InterviewCoachOutputSchema>;
