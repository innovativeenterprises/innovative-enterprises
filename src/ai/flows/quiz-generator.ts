
'use server';

/**
 * @fileOverview An AI agent that generates quizzes on a given topic.
 */

import { ai } from '@/ai/genkit';
import {
    QuizGeneratorInputSchema,
    QuizGeneratorInput,
    QuizGeneratorOutputSchema,
    QuizGeneratorOutput,
} from './quiz-generator.schema';


export async function generateQuiz(input: QuizGeneratorInput): Promise<QuizGeneratorOutput> {
  return quizGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  input: { schema: QuizGeneratorInputSchema },
  output: { schema: QuizGeneratorOutputSchema },
  prompt: `You are an expert educator and quiz designer. Your task is to generate a multiple-choice quiz based on the user's specifications.

**Quiz Specifications:**
- **Topic:** {{{topic}}}
- **Difficulty:** {{{difficulty}}}
- **Number of Questions:** {{{numQuestions}}}

**Instructions:**
1.  **Create a Quiz Title:** Generate a suitable title for a quiz about the specified topic.
2.  **Generate Questions:** Create {{{numQuestions}}} multiple-choice questions about the '{{{topic}}}'.
3.  **Set Difficulty:** The questions should match the requested difficulty level ('{{{difficulty}}}'). 'Easy' questions should be definitional, 'Medium' questions should require some application of concepts, and 'Hard' questions should involve analysis or synthesis.
4.  **For each question, you MUST provide:**
    *   `questionText`: The question itself.
    *   `options`: An array of exactly four possible answers. One must be correct.
    *   `correctAnswer`: The correct answer string, which must exactly match one of the options.
    *   `explanation`: A brief, clear explanation for why the correct answer is correct.

Return the complete quiz in the specified structured JSON format.
`,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    inputSchema: QuizGeneratorInputSchema,
    outputSchema: QuizGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
