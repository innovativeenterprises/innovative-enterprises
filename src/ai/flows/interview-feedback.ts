
'use server';

/**
 * @fileOverview An AI agent that provides feedback on a user's interview answer.
 * - getInterviewFeedback - A function that analyzes a question and answer.
 */

import { ai } from '@/ai/genkit';
import {
    InterviewFeedbackInput,
    InterviewFeedbackInputSchema,
    InterviewFeedbackOutput,
    InterviewFeedbackOutputSchema,
} from './interview-feedback.schema';

export async function getInterviewFeedback(input: InterviewFeedbackInput): Promise<InterviewFeedbackOutput> {
  return interviewFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewFeedbackPrompt',
  input: { schema: InterviewFeedbackInputSchema },
  output: { schema: InterviewFeedbackOutputSchema },
  prompt: `You are an expert career coach providing feedback on a practice interview answer.

**Interview Question:**
"{{{question}}}"

**User's Answer:**
"{{{answer}}}"

**Your Task:**
1.  **Analyze the Answer:** Carefully evaluate the user's answer based on clarity, structure (like the STAR method: Situation, Task, Action, Result), relevance to the question, and confidence.
2.  **Provide Positive Feedback:** Identify 1-2 specific things the user did well. Be encouraging. For example, "You did a great job of clearly stating the situation..."
3.  **Offer Improvement Suggestions:** Identify 1-2 key areas for improvement. Be constructive and actionable. For example, "To make your answer stronger, try to quantify the result of your action. How much did you increase efficiency?" or "Your answer could be more structured. Try using the STAR method to organize your thoughts."
4.  **Draft a Suggested Answer:** Provide an example of a strong, well-structured answer to the same question. This should serve as a model for the user to learn from.

Return the complete analysis in the specified structured JSON format.
`,
});

const interviewFeedbackFlow = ai.defineFlow(
  {
    name: 'interviewFeedbackFlow',
    inputSchema: InterviewFeedbackInputSchema,
    outputSchema: InterviewFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
