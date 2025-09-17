/**
 * @fileOverview Schemas and types for the AI-Powered FAQ flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the FAQ AI flow.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { User, Bot, Briefcase, BrainCircuit, Handshake, Scale, GanttChartSquare } from 'lucide-react';


// Moved AgentSchema here to resolve build error
const SocialsSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
});
export const AgentSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(),
  icon: z.any(),
  type: z.enum(["Leadership", "AI Agent", "Staff"]),
  socials: SocialsSchema.optional(),
  href: z.string().optional(),
  photo: z.string().optional(),
  aiHint: z.string().optional(),
  enabled: z.boolean(),
});
export type Agent = z.infer<typeof AgentSchema>;

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


export const initialStaffData = {
    leadership: [],
    staff: [],
    agentCategories: [
        {
            category: "Core Business Operations Agents",
            agents: [
                { name: 'Aida', role: 'Admin & Legal Assistant', icon: User, type: 'AI Agent', socials: { email: 'aida@innovative.om'}, enabled: true, description: 'Handles FAQs, books meetings, and drafts legal agreements.', href: '/legal-agent' },
                { name: 'Lexi', role: 'AI Legal Agent', icon: Scale, type: 'AI Agent', socials: { email: 'lexi@innovative.om'}, enabled: true, description: 'Analyzes legal documents for risks and provides preliminary advice.', href: '/legal-agent' },
                { name: 'Hira', role: 'Product Manager (GENIUS)', icon: User, type: 'AI Agent', socials: { email: 'hira@innovative.om'}, enabled: true, description: 'Analyzes CVs, enhances resumes, and provides interview coaching for the GENIUS career platform.', href: '/cv-enhancer' },
                { name: 'Sami', role: 'Sales Agent', icon: User, type: 'AI Agent', socials: { email: 'sami@innovative.om'}, enabled: true, description: 'Generates tailored Letters of Interest for potential investors and follows up on leads.', href: '/invest' },
                { name: 'Paz', role: 'Partnership Agent', icon: Handshake, type: 'AI Agent', socials: { email: 'paz@innovative.om'}, enabled: true, description: 'Identifies and onboards new freelancers, subcontractors, and strategic partners to expand our network.', href: '/partner' },
            ]
        }
    ]
};


const getSpecialist = (department: 'legal' | 'marketing' | 'hr' | 'sales' | 'partnership', staff: Agent[]): Agent | null => {
    switch(department) {
        case 'legal': return staff.find(s => s.name === 'Lexi') || staff.find(s => s.name === 'Legal Counsel Office') || null;
        case 'marketing': return staff.find(s => s.name === 'Mira') || null;
        case 'hr': return staff.find(s => s.name === 'Hira') || null;
        case 'sales': return staff.find(s => s.name === 'Sami') || null;
        case 'partnership': return staff.find(s => s.name === 'Paz') || null;
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
            // The staff list is now part of the tool's context, not a global import.
            allStaff: z.array(AgentSchema).optional(),
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
    async ({ department, userQuery, allStaff = [] }) => {
        const specialist = getSpecialist(department, allStaff);
        if (!specialist) {
            return { isAvailable: false, response: "I'm sorry, I can't find the right person to help with that." };
        }

        // A more realistic (but still deterministic) simulation of availability.
        const isAvailable = (userQuery.length + department.length) % 3 !== 0;

        if (isAvailable) {
            return {
                isAvailable: true,
                response: `I've connected you with '${specialist.name}', our '${department}' specialist. They will answer your question now.`,
                suggestedReplies: ["What are your office hours?", "Tell me about your products."],
            };
        } else {
            return {
                isAvailable: false,
                response: `I'm sorry, '${specialist.name}' is currently assisting other clients. I can help you book a meeting, or you can contact them directly via email or WhatsApp. What works best for you?`,
                meetingUrl: 'https://calendly.com/your-username',
                contactOptions: {
                    email: specialist.socials?.email,
                    whatsapp: specialist.socials?.phone,
                },
                suggestedReplies: ["Book a meeting", `Email '${specialist.name}'`, `WhatsApp '${specialist.name}'`],
            };
        }
    }
);
