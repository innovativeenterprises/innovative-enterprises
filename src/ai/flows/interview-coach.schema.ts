/**
 * @fileOverview Schemas and types for the AI Interview Coach flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the interview question generation AI flow.
 */

import { z } from 'zod';

export const InterviewCoachInputSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters.").describe("The job title the user is interviewing for."),
});
export type InterviewCoachInput = z.infer<typeof InterviewCoachInputSchema>;

export const InterviewQuestionSchema = z.object({
  question: z.string().describe("The interview question."),
  category: z.enum(['Behavioral', 'Technical', 'Situational', 'Case Study', 'Cultural Fit']).describe("The category of the question."),
});
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

export const InterviewCoachOutputSchema = z.object({
  questions: z.array(InterviewQuestionSchema).describe("A list of generated interview questions."),
});
export type InterviewCoachOutput = z.infer<typeof InterviewCoachOutputSchema>;
