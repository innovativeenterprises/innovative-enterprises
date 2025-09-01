/**
 * @fileOverview Schemas for the AI Quiz Generator flow.
 */
import { z } from 'zod';

export const QuestionSchema = z.object({
  questionText: z.string().describe("The text of the quiz question."),
  options: z.array(z.string()).describe("A list of 4 possible answers for a multiple-choice question."),
  correctAnswer: z.string().describe("The correct answer from the list of options."),
  explanation: z.string().describe("A brief explanation of why the correct answer is right."),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuizGeneratorInputSchema = z.object({
  topic: z.string().min(3, "Please provide a topic for the quiz."),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  numQuestions: z.coerce.number().min(3).max(10),
});
export type QuizGeneratorInput = z.infer<typeof QuizGeneratorInputSchema>;

export const QuizGeneratorOutputSchema = z.object({
  quizTitle: z.string().describe("A suitable title for the generated quiz."),
  questions: z.array(QuestionSchema),
});
export type QuizGeneratorOutput = z.infer<typeof QuizGeneratorOutputSchema>;
