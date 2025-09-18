
import type { Opportunity } from './opportunities.schema';
import type { LucideIcon } from 'lucide-react';
import { Trophy, Bot, Brick, Brush, Code, DraftingCompass, Handshake, BrainCircuit } from 'lucide-react';

export const initialOpportunities: Opportunity[] = [
    {
        id: 'opp_rebrand',
        title: "Innovative Enterprises Rebranding",
        type: 'Design Competition',
        prize: "OMR 5,000",
        deadline: "2024-09-15",
        description: "We are looking for a complete rebranding of our corporate identity. This includes a new logo, color scheme, and brand guidelines.",
        iconName: 'Trophy',
        badgeVariant: 'default',
        status: 'Open',
        questions: ["What is the core message the brand should convey?", "Are there any specific cultural elements to incorporate?"],
    },
    {
        id: 'opp_ai_chatbot',
        title: "AI Customer Service Chatbot",
        type: 'Development Project',
        prize: "OMR 8,000",
        deadline: "2024-10-01",
        description: "Develop and integrate an AI-powered chatbot into our main website to handle customer service inquiries.",
        iconName: 'Bot',
        badgeVariant: 'destructive',
        status: 'Open',
        questions: ["What NLP framework do you specialize in?", "Describe your experience with real-time communication protocols."]
    },
    {
        id: 'opp_office_mural',
        title: "Office Wall Mural Design",
        type: 'Art Commission',
        prize: "OMR 1,500",
        deadline: "2024-08-30",
        description: "Design and paint a large-scale mural for our new office headquarters. The theme is 'Oman's Tech Future'.",
        iconName: 'Brush',
        badgeVariant: 'secondary',
        status: 'In Progress',
    },
    {
        id: 'opp_sanad_hub_integration',
        title: "Sanad Hub Payment Gateway",
        type: 'Subcontract Task',
        prize: "OMR 3,500",
        deadline: "2024-09-20",
        description: "Integrate a local Omani payment gateway (Thawani, Tasdeed) into the Sanad Hub platform.",
        iconName: 'Handshake',
        badgeVariant: 'secondary',
        status: 'Closed',
    },
];
