
'use server';

/**
 * @fileOverview An AI agent that provides personalized explanations for difficult concepts.
 */

import { ai } from '@/ai/genkit';
import {
    AdaptiveTutorInputSchema,
    AdaptiveTutorInput,
    AdaptiveTutorOutputSchema,
    AdaptiveTutorOutput,
} from './adaptive-learning-tutor.schema';


export async function generateAdaptiveLesson(input: AdaptiveTutorInput): Promise<AdaptiveTutorOutput> {
  return adaptiveLearningTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveLearningTutorPrompt',
  input: { schema: AdaptiveTutorInputSchema },
  output: { schema: AdaptiveTutorOutputSchema },
  prompt: `You are an expert, empathetic AI Tutor. Your goal is to help a student who is struggling with a specific concept.

**Student's Context:**
- **Topic:** {{{topic}}}
- **Student's Stated Difficulty:** {{{struggleDescription}}}

**Your Task:**
1.  **Tailored Explanation:**
    *   Do not give a generic, textbook definition.
    *   Directly address the student's point of confusion ('{{{struggleDescription}}}').
    *   Explain the concept clearly and concisely, using simple language. Break it down into easy-to-understand parts.
    *   Focus on the "why" and "how" to build a strong foundational understanding.

2.  **Simple Analogy:**
    *   Create a simple, relatable, real-world analogy that illustrates the core idea of the concept. This should help the student build an intuitive grasp of the topic.

3.  **Practice Question:**
    *   Create one relevant practice question.
    *   This question should directly test the understanding of the specific concept you just explained. It should not be a complex, multi-step problem.

Return the complete lesson in the specified structured JSON format.
`,
});

const adaptiveLearningTutorFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningTutorFlow',
    inputSchema: AdaptiveTutorInputSchema,
    outputSchema: AdaptiveTutorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
