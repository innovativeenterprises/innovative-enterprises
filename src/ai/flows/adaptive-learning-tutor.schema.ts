
/**
 * @fileOverview Schemas for the AI Adaptive Learning Tutor flow.
 */
import { z } from 'zod';

export const AdaptiveTutorInputSchema = z.object({
  topic: z.string().describe("The topic the student is studying."),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe("The student's self-assessed difficulty level."),
  struggleDescription: z.string().describe("The specific concept the student is struggling with."),
});
export type AdaptiveTutorInput = z.infer<typeof AdaptiveTutorInputSchema>;

export const AdaptiveTutorOutputSchema = z.object({
  explanation: z.string().describe("A clear, tailored explanation of the concept, addressing the student's specific struggle."),
  analogy: z.string().describe("A simple, relatable analogy to help the student understand the concept intuitively."),
  practiceQuestion: z.string().describe("A single practice question to test the student's understanding of the explained concept."),
});
export type AdaptiveTutorOutput = z.infer<typeof AdaptiveTutorOutputSchema>;

  