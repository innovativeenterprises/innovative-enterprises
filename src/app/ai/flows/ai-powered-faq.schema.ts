/**
 * @fileOverview Schemas and types for the AI-Powered FAQ flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the FAQ AI flow.
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

const getSpecialist = (department: 'legal' | 'marketing' | 'hr' | 'sales'): { name: string; socials?: { email?: string; phone?: string } } | null => {
    switch(department) {
        case 'legal': return allStaff.find(s => s.name === 'Lexi') || allStaff.find(s => s.name === 'Legal Counsel Office') || null;
        case 'marketing': return allStaff.find(s => s.name === 'Mira') || null;
        case 'hr': return allStaff.find(s => s.name === 'Hira') || null;
        case 'sales': return allStaff.find(s => s.name === 'Sami') || null;
        default: return null;
    }
}


export const routeToSpecialistTool = ai.defineTool(
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
    async ({ department, userQuery }) => {
        const specialist = getSpecialist(department);
        if (!specialist) {
            return { isAvailable: false, response: "I'm sorry, I can't find the right person to help with that." };
        }

        // Use a deterministic method instead of Math.random() to simulate availability.
        // This makes the behavior predictable for testing and prevents hydration mismatches.
        const isAvailable = userQuery.length % 2 === 0;

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
