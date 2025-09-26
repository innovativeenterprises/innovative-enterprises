

'use server';

/**
 * @fileOverview An AI-powered FAQ agent for Innovative Enterprises.
 *
 * - answerQuestion - A function that answers user questions about the company.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
    AnswerQuestionInput,
    AnswerQuestionInputSchema,
    AnswerQuestionOutput,
    AnswerQuestionOutputSchema,
    routeToSpecialistTool
} from './ai-powered-faq.schema';


export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  tools: [routeToSpecialistTool],
  prompt: `You are Aida, a master AI assistant for Innovative Enterprises. Your primary job is to understand a user's query and decide the best course of action.

**Decision Process:**
1.  **Analyze the Query:** First, understand the user's question: \`{{{question}}}\`
2.  **Check for Specialist Topics:** If the query is about complex legal, marketing, HR, or sales topics, you MUST use the \`routeToSpecialist\` tool.
3.  **Check for Partnership Inquiries:** If the query contains keywords like "partner," "partnership," "invest," or "join your network," you MUST use the \`routeToSpecialist\` tool with the 'partnership' department.
4.  **Answer General Questions:** If the query is a general question about the company, its products (PANOSPACE, ameen, etc.), services, or its status as an Omani SME, you should answer it directly yourself using the context below. Do NOT use a tool for these general questions.
5.  **Booking Meetings:** If the user explicitly asks to book a meeting, schedule a call, or a similar request, use the \`routeToSpecialist\` tool and set the department to 'sales' to handle the booking.
6.  **Suggest Follow-up Actions:** After every response, you MUST provide 2-3 **short, concise, and contextually relevant** follow-up questions or actions in the \`suggestedReplies\` field. These should be button-friendly prompts that anticipate the user's next logical step based on the conversation so far. Examples: "Tell me more about PANOSPACE", "What services do you offer?", "Contact sales". Avoid long, full-sentence questions.

**Context for General Questions:**
Innovative Enterprises is an Omani SME focused on emerging technology and digital transformation solutions. We offer services in areas like cloud computing, AI, and cybersecurity. Our products include PANOSPACE, ameen, APPI, KHIDMAAI, and VMALL. As an Omani SME, we provide unique benefits to government partners seeking to support local businesses and innovation.
`,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: answerQuestionPrompt,
      input: input,
      tools: [routeToSpecialistTool],
    });
    
    const toolRequest = llmResponse.toolRequest();
    if (toolRequest) {
        const toolResponse = await toolRequest.run();
        const toolOutput = toolResponse as z.infer<typeof routeToSpecialistTool.outputSchema>;

        return {
            answer: toolOutput.response,
            meetingUrl: toolOutput.meetingUrl,
            contactOptions: toolOutput.contactOptions,
            suggestedReplies: toolOutput.suggestedReplies,
        };
    }

    const directAnswer = llmResponse.output();
    if (directAnswer) {
      if (!directAnswer.suggestedReplies || directAnswer.suggestedReplies.length === 0) {
        directAnswer.suggestedReplies = ["What services do you offer?", "How do I become a partner?", "Tell me about your products."];
      }
      return directAnswer;
    }
    
    return {
        answer: "I'm sorry, I'm not sure how to handle that request. Could you please rephrase it?",
        suggestedReplies: ["What are your services?", "How do I partner with you?", "Tell me about your products."],
    };
  }
);
