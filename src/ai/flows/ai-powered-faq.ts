
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
  meetingUrl: z.string().url().optional().describe('An optional URL for booking a meeting if the user requested it.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const bookMeetingTool = ai.defineTool(
    {
        name: 'bookMeeting',
        description: 'Use this tool when a user wants to schedule a meeting, call, or appointment.',
        inputSchema: z.object({
            topic: z.string().describe('The topic or reason for the meeting.'),
        }),
        outputSchema: z.object({
            bookingUrl: z.string().url().describe('The URL where the user can book the meeting.'),
        })
    },
    async ({ topic }) => {
        // In a real application, you might have different links for different topics.
        // For this prototype, we'll use a generic Calendly link.
        console.log(`Booking meeting for topic: ${topic}`);
        return {
            bookingUrl: 'https://calendly.com/your-username'
        };
    }
);

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  tools: [bookMeetingTool],
  prompt: `You are a virtual assistant chatbot for Innovative Enterprises. Your name is Aida.

  If the user asks to book a meeting, schedule a call, or a similar request, use the bookMeeting tool.

  Otherwise, answer the following question about the company's services and capabilities:

  Question: {{{question}}}

  Context: Innovative Enterprises is an Omani SME focused on emerging technology and digital transformation solutions. They offer services in areas like cloud computing, AI, and cybersecurity. They also have products like PANOSPACE, ameen, APPI, KHIDMA, and VMALL. As an Omani SME, Innovative Enterprises can provide unique benefits to government partners seeking to support local businesses and innovation.
  `,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    
    const toolRequest = response.toolRequest();
    if (toolRequest) {
        const toolResponse = await toolRequest.run();
        const toolOutput = toolResponse.output() as { bookingUrl: string };
        return {
            answer: "Great! I can help with that. You can schedule a meeting with our team using the button below.",
            meetingUrl: toolOutput.bookingUrl,
        }
    }

    const output = response.output();
    if (output) {
      return output;
    }
    
    return {
        answer: response.text,
    };
  }
);
