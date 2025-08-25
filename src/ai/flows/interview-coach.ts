
'use server';

/**
 * @fileOverview An AI agent that generates interview questions for a specific job title.
 * - generateInterviewQuestions - A function that creates a list of practice questions.
 */

import { ai } from '@/ai/genkit';
import {
    InterviewCoachInput,
    InterviewCoachInputSchema,
    InterviewCoachOutput,
    InterviewCoachOutputSchema,
} from './interview-coach.schema';

export async function generateInterviewQuestions(input: InterviewCoachInput): Promise<InterviewCoachOutput> {
  return interviewCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewCoachPrompt',
  input: { schema: InterviewCoachInputSchema },
  output: { schema: InterviewCoachOutputSchema },
  prompt: `You are an expert career coach and hiring manager. Your task is to generate a list of 10 relevant and challenging interview questions for a candidate applying for the following position:

**Job Title:** {{{jobTitle}}}

**Instructions:**
1.  Generate 10 distinct questions.
2.  For each question, classify it into one of the following categories: 'Behavioral', 'Technical', 'Situational', 'Case Study', or 'Cultural Fit'.
3.  Ensure the questions cover a range of these categories and are appropriate for the seniority and type of role indicated by the job title.
4.  Do not ask for basic questions like "Tell me about yourself" or "What are your weaknesses?". Focus on more insightful questions.

Return the list of questions and their categories in the specified structured format.
`,
});

const interviewCoachFlow = ai.defineFlow(
  {
    name: 'interviewCoachFlow',
    inputSchema: InterviewCoachInputSchema,
    outputSchema: InterviewCoachOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
