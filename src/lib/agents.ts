
import { Bot, User, Briefcase, BrainCircuit, Handshake, Scale, GanttChartSquare, Phone, MessageSquare, Truck, Warehouse, Cpu, Search, Lightbulb, Users, Building2, GraduationCap, Car, Heart, BookUser, Recycle, UserRoundCheck, FileText, Trophy, Mic, Languages, ImageIcon, Video, MessageSquareQuote, GitBranch, Gem, Award, BarChart3 } from 'lucide-react';
import type { AgentCategory } from './agents.schema';

export const initialStaffData = {
    leadership: [
        {
            name: "JUMAA SALIM AL HADIDI",
            role: "CEO and Co-Founder",
            description: "Leads the company's vision and strategic direction.",
            icon: User,
            type: 'Leadership' as const,
            photo: "https://storage.googleapis.com/stella-images/studio-app-live/20240730-184523-289-jumaa.jpeg",
            socials: { email: 'jumaa.hadidi@innovative.om', phone: '+96878492280' },
            enabled: true,
        },
        {
            name: "ANWAR AHMED SHARIF",
            role: "Deputy CEO & CTO",
            description: "Drives technological innovation and engineering.",
            icon: User,
            type: 'Leadership' as const,
            photo: "https://storage.googleapis.com/stella-images/studio-app-live/20240730-185038-795-anwar.jpeg",
            socials: { email: 'anwar.sharif@innovative.om', phone: '+96878492280' },
            enabled: true,
        },
    ],
    staff: [
        {
            name: "ABDULJABBAR AL FAKI",
            role: "Projects Manager",
            description: "Oversees all project execution and delivery.",
            icon: User,
            type: 'Staff' as const,
            photo: "https://storage.googleapis.com/stella-images/studio-app-live/20240730-185038-795-anwar.jpeg", // Placeholder
            enabled: true,
        },
        {
            name: "HUDA AL SALMI",
            role: "Public Relations Officer (PRO)",
            description: "Manages government relations and public engagement.",
            icon: User,
            type: 'Staff' as const,
            photo: "https://storage.googleapis.com/stella-images/studio-app-live/20240730-185038-795-anwar.jpeg", // Placeholder
            enabled: true,
        },
        {
            name: "Legal Counsel Office",
            role: "Advocate & Legal Representative",
            description: "Provides expert legal guidance and representation.",
            icon: Scale,
            type: 'Staff' as const,
            photo: "https://storage.googleapis.com/stella-images/studio-app-live/20240730-185038-795-anwar.jpeg", // Placeholder
            enabled: true,
        },
    ],
    agentCategories: [
        {
            category: "Core Business Operations Agents",
            agents: [
                { name: 'Aida', role: 'Admin & Legal Assistant', icon: Bot, type: 'AI Agent', socials: { email: 'aida@innovative.om'}, enabled: true, description: 'Handles FAQs, books meetings, and drafts legal agreements.', href: '/faq' },
                { name: 'Lexi', role: 'AI Legal Agent', icon: Scale, type: 'AI Agent', socials: { email: 'lexi@innovative.om'}, enabled: true, description: 'Analyzes legal documents for risks and provides preliminary advice.', href: '/legal-agent' },
                { name: 'Hira', role: 'Product Manager (GENIUS)', icon: UserRoundCheck, type: 'AI Agent', socials: { email: 'hira@innovative.om'}, enabled: true, description: 'Analyzes CVs, enhances resumes, and provides interview coaching for the GENIUS career platform.', href: '/cv-enhancer' },
                { name: 'Sami', role: 'Sales Agent', icon: Handshake, type: 'AI Agent', socials: { email: 'sami@innovative.om'}, enabled: true, description: 'Generates tailored Letters of Interest for potential investors and follows up on leads.', href: '/invest' },
                { name: 'Paz', role: 'Partnership Agent', icon: Handshake, type: 'AI Agent', socials: { email: 'paz@innovative.om'}, enabled: true, description: 'Identifies and onboards new freelancers, subcontractors, and strategic partners to expand our network.', href: '/partner' },
                 { name: 'TenderPro', role: 'Tender Response Assistant', icon: FileText, type: 'AI Agent', socials: {}, enabled: true, description: "Analyzes tender documents and requirements to generate comprehensive and professional draft responses.", href: '/tender-assistant' },
                { name: 'Remi', role: 'CRM Agent', icon: Bot, type: 'AI Agent', socials: {}, enabled: false, description: "Tracks customer relationships, logs inquiries, and sends automated follow-ups to maintain engagement." },
            ]
        },
        {
            category: "Platform & Marketplace Agents",
            agents: [
                { name: 'Hubert', role: 'Product Manager (Business Hub)', icon: Briefcase, type: 'AI Agent', socials: {}, enabled: true, description: "Assists users in navigating the Business Hub, finding partners, and connecting with services.", href: '/business-hub' },
                { name: 'Fahim', role: 'Product Manager (Sanad Hub)', icon: Briefcase, type: 'AI Agent', socials: {}, enabled: true, description: "Your AI guide for the Sanad Hub, helping you find services and understand document requirements.", href: '/sanad-hub' },
                { name: 'Waleed', role: 'WhatsApp Comms Agent', icon: MessageSquare, type: 'AI Agent', socials: {}, enabled: true, description: "Manages all WhatsApp communications, including OTP logins and notifications via the Business API." },
                 {
                    name: "Dana",
                    role: "Data Analyst Agent",
                    icon: BarChart3,
                    type: "AI Agent",
                    description: "Analyzes business data to generate dashboards, identify trends, and monitor KPIs for strategic insights.",
                    enabled: true,
                    href: "/admin/cfo-dashboard",
                },
                 { name: 'Talia', role: 'Talent & Competition Agent', icon: Trophy, type: 'AI Agent', socials: {}, enabled: true, description: "Analyzes and posts new work orders, competitions, and tasks for our talent network.", href: '/opportunities' },

            ]
        },
        {
            category: "Industry & Solution-Specific Agents",
            agents: [
                { name: 'Finley', role: 'Product Manager (Finley CFO)', icon: Bot, type: 'AI Agent', socials: {}, enabled: true, description: "Monitors cash flow, tracks transactions, and manages financial data for the Finley CFO platform.", href: '/cfo' },
                { name: 'A.S.A', role: 'Product Manager (InfraRent)', icon: ServerCog, type: 'AI Agent', socials: {}, enabled: true, description: "Analyzes client needs to design and propose custom IT infrastructure rental packages.", href: '/rentals' },
                {
                    name: "Coach",
                    role: "AI Interview Coach",
                    icon: Mic,
                    type: "AI Agent",
                    description: "Generates tailored interview questions based on job titles to help candidates practice and prepare.",
                    enabled: true,
                    href: "/interview-coach",
                },
                {
                    name: "Voxi",
                    role: "Product Manager (Voxi Translator)",
                    icon: Languages,
                    type: "AI Agent",
                    description: "Provides high-fidelity, verified translations for official documents.",
                    enabled: true,
                    href: "/document-translator",
                },
            ]
        },
        {
            category: "Internal & Strategic AI Agents",
            agents: [
                 {
                    name: "Navi",
                    role: "Innovation Agent",
                    icon: Lightbulb,
                    type: "AI Agent",
                    description: "Analyzes market gaps and internal capabilities to suggest new products and service offerings.",
                    enabled: true,
                    href: "/submit-work",
                },
                 {
                    name: "Sage",
                    role: "Business Strategist",
                    icon: BrainCircuit,
                    type: "AI Agent",
                    description: "Conducts feasibility studies on new business ideas by leveraging other agents for research and analysis.",
                    enabled: true,
                    href: "/feasibility-study",
                },
                {
                    name: "Rami",
                    role: "Strategy & Research Agent",
                    icon: Search,
                    type: "AI Agent",
                    description: "Performs market research, competitor analysis, and tracks industry trends to inform business strategy.",
                    enabled: true,
                    href: "/researcher",
                },
                { name: 'Tariq Tech', role: 'IT Support Agent', icon: Bot, type: 'AI Agent', socials: {}, enabled: false, description: "Automates IT processes, assists with software troubleshooting, and manages system configurations." },
                { name: 'Neo', role: 'AI Training Agent', icon: Cpu, type: 'AI Agent', socials: {}, enabled: true, description: "Fine-tunes other AI agents by processing custom knowledge documents and Q&A pairs.", href: "/admin/operations" },
                { name: 'AutoNabil', role: 'Automation Agent', icon: Bot, type: 'AI Agent', socials: {}, enabled: false, description: "Connects disparate tools and services to create seamless, automated workflows across the business." },
            ]
        },
        {
            category: "Creative & Content Agents",
            agents: [
                 {
                    name: "Mira",
                    role: "Marketing & Content Agent",
                    icon: MessageSquare,
                    type: "AI Agent",
                    description: "Generates social media posts, and creative content for various platforms.",
                    enabled: true,
                    href: "/social-media-post-generator",
                },
                {
                    name: "Lina",
                    role: "Image Generation Agent",
                    icon: ImageIcon,
                    type: "AI Agent",
                    description: "Generates high-quality images from text prompts for use in marketing, design, and social media.",
                    enabled: true,
                    href: "/image-generator",
                },
                { name: 'Echo', role: 'Voice Synthesis Agent', icon: Bot, type: 'AI Agent', socials: {}, enabled: false, description: "Converts text responses from other agents into natural-sounding speech for voice interactions." },
                { name: 'Vista', role: 'Product Manager (PANOSPACE)', icon: Bot, type: 'AI Agent', socials: {}, enabled: true, description: "Creates immersive 360° virtual tours and assists with advanced photo and video editing tasks.", href: '/real-estate-tech/virtual-tour' },
            ]
        }
    ]
};
