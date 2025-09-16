'use server';

/**
 * @fileOverview An AI-powered FAQ agent for Innovative Enterprises.
 *
 * - answerQuestion - A function that answers user questions about the company.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { initialStaffData } from '@/lib/agents';

export const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The user question about Innovative Enterprises.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

export const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
  meetingUrl: z.string().url().optional().describe('An optional URL for booking a meeting if the user requested it.'),
  contactOptions: z.object({
    email: z.string().email().optional().describe('Email address for the specialist.'),
    whatsapp: z.string().optional().describe('WhatsApp contact number for the specialist.'),
  }).optional(),
  suggestedReplies: z.array(z.string()).optional().describe("A list of short, relevant follow-up questions the user might ask."),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;


const allStaff = [...initialStaffData.leadership, ...initialStaffData.staff, ...initialStaffData.agentCategories.flatMap(c => c.agents)];

const getSpecialist = (department: 'legal' | 'marketing' | 'hr' | 'sales' | 'partnership'): { name: string; socials?: { email?: string; phone?: string } } | null => {
    switch(department) {
        case 'legal': return allStaff.find(s => s.name === 'Lexi') || allStaff.find(s => s.name === 'Legal Counsel Office') || null;
        case 'marketing': return allStaff.find(s => s.name === 'Mira') || null;
        case 'hr': return allStaff.find(s => s.name === 'Hira') || null;
        case 'sales': return allStaff.find(s => s.name === 'Sami') || null;
        case 'partnership': return allStaff.find(s => s.name === 'Paz') || null;
        default: return null;
    }
}


export const routeToSpecialistTool = ai.defineTool(
    {
        name: 'routeToSpecialist',
        description: 'Use this tool to route a complex user query to a specialist agent. You must determine the correct department based on the user\'s question.',
        inputSchema: z.object({
            department: z.enum(['legal', 'marketing', 'hr', 'sales', 'partnership']).describe('The department to route the query to.'),
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
    async ({ department, userQuery }) => {
        const specialist = getSpecialist(department);
        if (!specialist) {
            return { isAvailable: false, response: "I'm sorry, I can't find the right person to help with that." };
        }

        // A more realistic (but still deterministic) simulation of availability.
        const isAvailable = (userQuery.length + department.length) % 3 !== 0;

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
                    email: specialist.socials?.email,
                    whatsapp: specialist.socials?.phone,
                },
                suggestedReplies: ["Book a meeting", `Email ${specialist.name}`, `WhatsApp ${specialist.name}`],
            };
        }
    }
);

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
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
    const response = await prompt(input);
    
    // Check if the model decided to use a tool.
    if (response.toolRequest?.name === 'routeToSpecialist') {
        const toolResponse = await response.toolRequest.run();
        const toolOutput = toolResponse.output as z.infer<typeof routeToSpecialistTool.outputSchema>;

        return {
            answer: toolOutput.response,
            meetingUrl: toolOutput.meetingUrl,
            contactOptions: toolOutput.contactOptions,
            suggestedReplies: toolOutput.suggestedReplies,
        };
    }

    // If no tool was called, return the direct text response.
    const directAnswer = response.output;
    if (directAnswer) {
      // Ensure there are always some suggestions, even if the model forgets.
      if (!directAnswer.suggestedReplies || directAnswer.suggestedReplies.length === 0) {
        directAnswer.suggestedReplies = ["What services do you offer?", "How do I become a partner?", "Tell me about your products."];
      }
      return directAnswer;
    }
    
    // Fallback in case of unexpected response from the model
    return {
        answer: "I'm sorry, I'm not sure how to handle that request. Could you please rephrase it?",
        suggestedReplies: ["What are your services?", "How do I partner with you?", "Tell me about your products."],
    };
  }
);