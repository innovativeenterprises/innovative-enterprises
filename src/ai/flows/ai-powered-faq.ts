'use server';

/**
 * @fileOverview An AI-powered FAQ agent for Innovative Enterprises.
 *
 * - answerQuestion - A function that answers user questions about the company.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The user question about Innovative Enterprises.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  prompt: `You are a virtual assistant chatbot for Innovative Enterprises.

  Answer the following question about the company's services and capabilities:

  Question: {{{question}}}

  Context: Innovative Enterprises is an Omani SME focused on emerging technology and digital transformation solutions. They offer services in areas like cloud computing, AI, and cybersecurity. They also have products like PanoSpace, ameen, APPI, KHIDMAAI, and VMALL. As an Omani SME, Innovative Enterprises can provide unique benefits to government partners seeking to support local businesses and innovation.
  `,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
