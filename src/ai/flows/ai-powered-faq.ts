
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
  contactOptions: z.object({
    email: z.string().email().optional().describe('Email address for the specialist.'),
    whatsapp: z.string().optional().describe('WhatsApp contact number for the specialist.'),
  }).optional(),
  suggestedReplies: z.array(z.string()).optional().describe("A list of short, relevant follow-up questions the user might ask."),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

// A simple map of specialists for our tool
const specialists: Record<string, { name: string; email: string; whatsapp: string }> = {
    'legal': { name: 'Lexi', email: 'lexi.legal@innovative.om', whatsapp: '+96899123456' },
    'marketing': { name: 'Mira', email: 'mira.marketing@innovative.om', whatsapp: '+96899123457' },
    'hr': { name: 'Hira', email: 'hira.hr@innovative.om', whatsapp: '+96899123458' },
    'sales': { name: 'Sami', email: 'sami.sales@innovative.om', whatsapp: '+96899123459' },
};


const routeToSpecialistTool = ai.defineTool(
    {
        name: 'routeToSpecialist',
        description: 'Use this tool to route a complex user query to a specialist agent. You must determine the correct department (legal, marketing, hr, or sales) based on the user\'s question.',
        inputSchema: z.object({
            department: z.enum(['legal', 'marketing', 'hr', 'sales']).describe('The department to route the query to.'),
            userQuery: z.string().describe("The original user query."),
        }),
        outputSchema: z.object({
            isAvailable: z.boolean().describe("Whether the specialist agent is currently available."),
            response: z.string().describe("The response to give to the user."),
            meetingUrl: z.string().url().optional(),
            contactOptions: z.object({
                email: z.string().email().optional(),
                whatsapp: z.string().optional(),
            }).optional(),
            suggestedReplies: z.array(z.string()).optional(),
        })
    },
    async ({ department }) => {
        const specialist = specialists[department];
        if (!specialist) {
            return { isAvailable: false, response: "I'm sorry, I can't find the right person to help with that." };
        }

        // Simulate unavailability for ~50% of requests
        const isAvailable = Math.random() > 0.5;

        if (isAvailable) {
            return {
                isAvailable: true,
                response: `I've connected you with ${specialist.name}, our ${department} specialist. They will answer your question now.`,
                suggestedReplies: ["What are your office hours?", "Tell me about your products."],
            };
        } else {
            return {
                isAvailable: false,
                response: `I'm sorry, ${specialist.name} is currently assisting other clients. I can help you book a meeting, or you can contact them directly via email or WhatsApp. What works best for you?`,
                meetingUrl: 'https://calendly.com/your-username',
                contactOptions: {
                    email: specialist.email,
                    whatsapp: specialist.whatsapp,
                },
                suggestedReplies: ["Book a meeting", `Email ${specialist.name}`, `WhatsApp ${specialist.name}`],
            };
        }
    }
);


const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {schema: AnswerQuestionInputSchema},
  output: {schema: AnswerQuestionOutputSchema},
  tools: [routeToSpecialistTool],
  prompt: `You are Aida, a master AI assistant for Innovative Enterprises. Your primary job is to understand a user's query and decide the best course of action.

**Decision Process:**
1.  **Analyze the Query:** First, understand the user's question: \`{{{question}}}\`
2.  **Check for Specialist Topics:** If the query is about complex legal, marketing, HR, or sales topics, you MUST use the \`routeToSpecialist\` tool.
3.  **Answer General Questions:** If the query is a general question about the company, its products (PANOSPACE, ameen, etc.), services, or its status as an Omani SME, you should answer it directly yourself using the context below. Do NOT use a tool for these general questions.
4.  **Booking Meetings:** If the user explicitly asks to book a meeting, schedule a call, or a similar request, use the \`routeToSpecialist\` tool and set the department to 'sales' to handle the booking.
5.  **Suggest Follow-up Actions:** After every response, you MUST provide 2-3 **short, concise, and relevant** follow-up questions or actions in the \`suggestedReplies\` field. These should be button-friendly prompts that anticipate the user's next logical step. Examples: "Tell me more about PANOSPACE", "What are your hours?", "Become a partner". Avoid long, full-sentence questions.

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
    const response = await prompt(input);
    
    const toolRequest = response.toolRequest;

    if (toolRequest?.name === 'routeToSpecialist') {
        const toolResponse = await toolRequest.run();
        const toolOutput = toolResponse.output as z.infer<typeof routeToSpecialistTool.outputSchema>;

        return {
            answer: toolOutput.response,
            meetingUrl: toolOutput.meetingUrl,
            contactOptions: toolOutput.contactOptions,
            suggestedReplies: toolOutput.suggestedReplies,
        };
    }

    // If no tool was called, or it was a different tool, return the direct text response.
    const directAnswer = response.output;
    if (directAnswer) {
      return directAnswer;
    }
    
    // Fallback
    return {
        answer: "I'm sorry, I'm not sure how to handle that request. Could you please rephrase it?",
        suggestedReplies: ["What services do you offer?", "Who are your clients?"],
    };
  }
);
