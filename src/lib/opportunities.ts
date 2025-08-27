
import type { LucideIcon } from 'lucide-react';
import { Trophy, Brush, Code, Megaphone, Calendar, Bot, Headset, Server } from "lucide-react";

export type OpportunityBadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  prize: string;
  deadline: string;
  description: string;
  iconName: keyof typeof opportunityIconMap;
  badgeVariant: OpportunityBadgeVariant;
  status: 'Open' | 'Closed' | 'In Progress';
  questions?: string[];
}

export const opportunityIconMap = {
    Trophy,
    Brush,
    Code,
    Megaphone,
    Calendar,
    Bot,
    Headset,
    Server,
};

export const initialOpportunities: Opportunity[] = [
    {
        id: "1",
        title: "Company Rebranding Design Competition",
        type: "Design Competition",
        prize: "5,000 OMR",
        deadline: "2024-09-01",
        description: "We are looking for a complete rebranding of our corporate identity. This includes a new logo, color palette, and brand guidelines. The winning design will be implemented across all our platforms.",
        iconName: "Brush",
        badgeVariant: "default",
        status: "Open",
        questions: [
            "What is your design philosophy?",
            "Can you provide a portfolio of previous branding projects?",
            "What is your proposed timeline for the initial concepts?",
            "How do you incorporate feedback into your design process?"
        ]
    },
    {
        id: "2",
        title: "Develop a Customer Feedback Widget",
        type: "Subcontract Task",
        prize: "1,500 OMR",
        deadline: "2024-08-15",
        description: "We need a skilled React developer to build a reusable customer feedback widget for our various web applications. The widget should be lightweight, customizable, and integrate with our backend API.",
        iconName: "Code",
        badgeVariant: "secondary",
        status: "Open",
         questions: [
            "What is your experience with React and TypeScript?",
            "Can you provide examples of similar UI components you have built?",
            "How would you ensure the widget is performant and accessible?",
            "What is your estimated time to complete this task?"
        ]
    },
    {
        id: "3",
        title: "Marketing Campaign for a New Product Launch",
        type: "Branding Project",
        prize: "Negotiable",
        deadline: "2024-08-20",
        description: "We are seeking a marketing agency or freelancer to develop and execute a comprehensive marketing strategy for our upcoming product launch. The scope includes social media, content marketing, and PR.",
        iconName: "Megaphone",
        badgeVariant: "destructive",
        status: "In Progress",
    },
    {
        id: "4",
        title: "Social Media Content Calendar for Q4",
        type: "Content Project",
        prize: "800 OMR",
        deadline: "2024-08-25",
        description: "Create a detailed social media content calendar for LinkedIn and Twitter for the final quarter. The plan should include post topics, suggested copy, and image concepts aligned with our brand.",
        iconName: "Calendar",
        badgeVariant: "secondary",
        status: "Closed",
    },
    {
        id: "5",
        title: "AI Chatbot Persona Development",
        type: "Creative Task",
        prize: "500 OMR",
        deadline: "2024-09-05",
        description: "Define and document a personality for our primary customer service AI, 'Caro'. The deliverable should include a tone of voice guide, example dialogues, and rules for handling specific scenarios.",
        iconName: "Bot",
        badgeVariant: "outline",
        status: "Open",
    },
    {
        id: "6",
        title: "Omani Tourism VR Experience",
        type: "VR Competition",
        prize: "10,000 OMR Grand Prize",
        deadline: "2024-10-30",
        description: "Design and build a proof-of-concept virtual reality experience showcasing the beauty of Oman's landmarks. The most immersive and innovative project will win the grand prize and a potential development contract.",
        iconName: "Headset",
        badgeVariant: "default",
        status: "Open",
    },
];
