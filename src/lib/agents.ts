
import type { LucideIcon } from "lucide-react";
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake, User, Trophy, WalletCards, NotebookText, MessageCircle, ServerCog, FileText, Building, AudioLines, MessageSquare, Brain, Mic, Search } from "lucide-react";
import BusinessHubIcon from "@/components/icons/business-hub-icon";
import SanadHubIcon from "@/components/icons/sanad-hub-icon";
import HomeWorkforceIcon from "@/components/icons/home-workforce-icon";

export interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
    enabled: boolean;
    type: 'Leadership' | 'AI Agent' | 'Staff';
    photo: string;
    aiHint: string;
    href?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
        phone?: string;
        github?: string;
        website?: string;
    }
}

export interface AgentCategory {
    category: string;
    agents: Agent[];
}

export const initialLeadershipTeam: Agent[] = [
    { name: "JUMAA SALIM AL HADIDI", role: "CEO and Co-Founder", description: "Leads the company's vision and strategic direction.", icon: User, enabled: true, type: 'Leadership', photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1920&auto=format&fit=crop', aiHint: 'oman business man', socials: { linkedin: "#", twitter: "#", email: "jumaa@innovative.om", website: "#" } },
    { name: "ANWAR AHMED SHARIF", role: "CTO and Co-Founder", description: "Drives technological innovation and engineering.", icon: User, enabled: true, type: 'Leadership', photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=1920&auto=format&fit=crop', aiHint: 'technology expert', socials: { linkedin: "#", twitter: "#", email: "anwar@innovative.om", github: "#" } },
];

export const initialStaffTeam: Agent[] = [
    { name: "ABDULJABBAR AL FAKI", role: "Projects Manager", description: "Oversees all project execution and delivery.", icon: User, enabled: true, type: 'Staff', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1920&auto=format&fit=crop', aiHint: 'project manager', socials: { linkedin: "#", twitter: "#", email: "abduljabbar@innovative.om" } },
    { name: "HUDA AL SALMI", role: "Public Relations Officer (PRO)", description: "Manages government relations and public engagement.", icon: User, enabled: true, type: 'Staff', photo: 'https://images.unsplash.com/photo-1542596594-649ed6e6b343?q=80&w=1920&auto=format&fit=crop', aiHint: 'business woman', socials: { linkedin: "#", email: "huda@innovative.om" } },
    { name: "Legal Counsel Office", role: "Advocate & Legal Representative", description: "Provides expert legal guidance and representation.", icon: User, enabled: true, type: 'Staff', photo: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1920&auto=format&fit=crop', aiHint: 'lawyer office', socials: { website: "#", email: "legal@innovative.om" } },
];

export const initialAgentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin & Legal Assistant", description: "Engages with visitors, books meetings, generates minutes, and drafts initial legal agreements.", icon: NotebookText, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1589254065909-b7086229d092?q=80&w=1920&auto=format&fit=crop', aiHint: 'robot assistant', href: "/faq" },
            { name: "Lexi", role: "AI Legal Agent", description: "Analyzes legal questions and documents to identify potential risks and provide preliminary advice.", icon: Scale, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617353-c0451a7e8e97?q=80&w=1920&auto=format&fit=crop', aiHint: 'lawyer robot', href: "/legal-agent" },
            { name: "Finley", role: "Product Manager (Finley CFO)", description: "Monitors cash flow, tracks transactions, and manages financial data for the Finley CFO platform.", icon: WalletCards, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1920&auto=format&fit=crop', aiHint: 'finance robot', href: "/cfo" },
            { name: "Hira", role: "Product Manager (GENIUS)", description: "Analyzes CVs, enhances resumes, and provides interview coaching for the GENIUS career platform.", icon: Brain, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1920&auto=format&fit=crop', aiHint: 'human resources robot', href: "/cv-enhancer" },
            { name: "TenderPro", role: "Tender Response Assistant", description: "Analyzes tender documents and requirements to generate comprehensive and professional draft responses.", icon: FileText, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617353-c0451a7e8e97?q=80&w=1920&auto=format&fit=crop', aiHint: 'document robot', href: "/tender-assistant" },
            { name: "Talia", role: "Talent & Competition Agent", description: "Analyzes and posts new work orders, competitions, and tasks for our talent network.", icon: Trophy, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162616805-669c3fa0de40?q=80&w=1920&auto=format&fit=crop', aiHint: 'robot trophy', href: "/opportunities" },
            { name: "Waleed", role: "WhatsApp Comms Agent", description: "Manages all WhatsApp communications, including OTP logins, notifications, and customer interactions via the Business API.", icon: MessageSquare, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1614149290174-a732a3c7a02c?q=80&w=1920&auto=format&fit=crop', aiHint: 'whatsapp robot' },
            { name: "Coach", role: "AI Interview Coach", description: "Generates tailored interview questions based on job titles to help candidates practice and prepare.", icon: Mic, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1593941707882-6e87a2b9a5c0?q=80&w=1920&auto=format&fit=crop', aiHint: 'coach robot', href: "/cv-enhancer" },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Sami", role: "Sales Agent", description: "Generates tailored Letters of Interest for potential investors and follows up on leads.", icon: TrendingUp, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1920&auto=format&fit=crop', aiHint: 'sales bot', href: "/invest" },
            { name: "Mira", role: "Marketing & Content Agent", description: "Generates social media posts, and creative content for various platforms.", icon: Megaphone, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1612428978260-2b9c7df20150?q=80&w=1920&auto=format&fit=crop', aiHint: 'marketing bot', href: "/social-media-post-generator" },
            { name: "Remi", role: "CRM Agent", description: "Tracks customer relationships, logs inquiries, and sends automated follow-ups to maintain engagement.", icon: Contact, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611605698323-b1e79e63d68c?q=80&w=1920&auto=format&fit=crop', aiHint: 'crm bot' },
            { name: "Hubert", role: "Product Manager (Business Hub)", description: "Assists users in navigating the Business Hub, finding partners, and connecting with services.", icon: BusinessHubIcon, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1593941707882-6e87a2b9a5c0?q=80&w=1920&auto=format&fit=crop', aiHint: 'business robot', href: "/business-hub" },
            { name: "Fahim", role: "Product Manager (Sanad Hub)", description: "Your AI guide for the Sanad Hub, helping you find services and understand document requirements.", icon: SanadHubIcon, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1601887383681-4965b39e5573?q=80&w=1920&auto=format&fit=crop', aiHint: 'government assistant robot', href: "/sanad-hub" },
        ]
    },
    {
        category: "Tech & Data Agents",
        agents: [
            { name: "Tariq Tech", role: "IT Support Agent", description: "Automates IT processes, assists with software troubleshooting, and manages system configurations.", icon: Cpu, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1614149290184-7376551e15a9?q=80&w=1920&auto=format&fit=crop', aiHint: 'it support' },
            { name: "A.S.A", role: "Product Manager (InfraRent)", description: "Analyzes client needs to design and propose custom IT infrastructure rental packages for the InfraRent platform.", icon: ServerCog, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1593941707882-6e87a2b9a5c0?q=80&w=1920&auto=format&fit=crop', aiHint: 'architect robot', href: "/infra-rent" },
            { name: "Dana", role: "Data Analyst Agent", description: "Analyzes business data to generate dashboards, identify trends, and monitor KPIs for strategic insights.", icon: Database, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611605698323-b1e79e63d68c?q=80&w=1920&auto=format&fit=crop', aiHint: 'data analytics' },
            { name: "Neo", role: "AI Training Agent", description: "Fine-tunes other AI agents by processing custom knowledge documents and Q&A pairs.", icon: BrainCircuit, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1620712943543-bcc4622f4273?q=80&w=1920&auto=format&fit=crop', aiHint: 'ai brain', href: "/admin/operations" },
            { name: "AutoNabil", role: "Automation Agent", description: "Connects disparate tools and services to create seamless, automated workflows across the business.", icon: Bot, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617243-caff45c4e094?q=80&w=1920&auto=format&fit=crop', aiHint: 'automation robot' },
        ]
    },
    {
        category: "Creative & Media Agents",
        agents: [
            { name: "Lina", role: "Image Generation Agent", description: "Generates high-quality images from text prompts for use in marketing, design, and social media.", icon: Palette, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617263-4ec3d5cd3a48?q=80&w=1920&auto=format&fit=crop', aiHint: 'creative robot', href: "/image-generator" },
            { name: "Voxi", role: "Product Manager (Voxi Translator)", description: "Provides high-fidelity, verified translations for official documents between multiple languages.", icon: Languages, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611605698418-4a5e35ca3babc?q=80&w=1920&auto=format&fit=crop', aiHint: 'translation bot', href: "/document-translator" },
            { name: "Echo", role: "Voice Synthesis Agent", description: "Converts text responses from other agents into natural-sounding speech for voice interactions.", icon: AudioLines, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1920&auto=format&fit=crop', aiHint: 'voice synthesis robot' },
            { name: "Vista", role: "Product Manager (PANOSPACE)", description: "Creates immersive 360° virtual tours and assists with advanced photo and video editing tasks.", icon: Camera, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611605698298-65d597b69c4d?q=80&w=1920&auto=format&fit=crop', aiHint: 'camera robot' },
        ]
    },
    {
        category: "Special Growth Agents",
        agents: [
            { name: "Rami", role: "Strategy & Research Agent", description: "Performs market research, competitor analysis, and tracks industry trends to inform business strategy.", icon: Search, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162616895-c186411e9411?q=80&w=1920&auto=format&fit=crop', aiHint: 'strategy bot', href: "/researcher" },
            { name: "Sage", role: "Business Strategist", description: "Conducts feasibility studies on new business ideas by leveraging other agents for research and analysis.", icon: BrainCircuit, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1920&auto=format&fit=crop', aiHint: 'wise robot', href: "/feasibility-study"},
            { name: "Navi", role: "Innovation Agent", description: "Analyzes market gaps and internal capabilities to suggest new products and service offerings.", icon: Rocket, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162617243-caff45c4e094?q=80&w=1920&auto=format&fit=crop', aiHint: 'innovation bot' },
            { name: "Paz", role: "Partnership Agent", description: "Identifies and onboards new freelancers, subcontractors, and strategic partners to expand our network.", icon: Handshake, enabled: true, type: 'AI Agent', photo: 'https://images.unsplash.com/photo-1611162618033-95b778794e94?q=80&w=1920&auto=format&fit=crop', aiHint: 'partnership bot', href: "/partner" },
        ]
    },
];

export const initialStaffData = {
    leadership: initialLeadershipTeam,
    staff: initialStaffTeam,
    agentCategories: initialAgentCategories,
}
