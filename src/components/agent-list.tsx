import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
}

interface AgentCategory {
    category: string;
    agents: Agent[];
}

const agentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin / Executive Assistant", description: "Schedules, reminders, document prep.", icon: Briefcase },
            { name: "Finley", role: "Finance & Accounting Agent", description: "Bookkeeping, invoices, expense tracking, tax reminders.", icon: DollarSign },
            { name: "Hira", role: "HR & Recruitment Agent", description: "CV screening, ATS checks, onboarding automation.", icon: Users },
            { name: "Lexi", role: "Legal & Contracts Agent", description: "Draft agreements, compliance checks.", icon: Scale },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Caro", role: "Customer Support Agent", description: "Handles WhatsApp, email, chatbot queries 24/7.", icon: Headset },
            { name: "Sami", role: "Sales Agent", description: "Follows up leads, pitches services, books meetings.", icon: TrendingUp },
            { name: "Mira", role: "Marketing Agent", description: "Creates ads, social posts, SEO, blog content.", icon: Megaphone },
            { name: "Remi", role: "CRM Agent", description: "Tracks customer relationships, sends follow-ups.", icon: Contact },
        ]
    },
    {
        category: "Tech & Data Agents",
        agents: [
            { name: "Tariq Tech", role: "IT Support Agent", description: "Troubleshoots software, automates processes.", icon: Cpu },
            { name: "Dana", role: "Data Analyst Agent", description: "Dashboards, trends, KPI monitoring.", icon: Database },
            { name: "Neo", role: "AI Training Agent", description: "Fine-tunes your AI tools on your business data.", icon: BrainCircuit },
            { name: "AutoNabil", role: "Automation Agent", description: "Connects all tools (Zapier/Make style).", icon: Bot },
        ]
    },
    {
        category: "Creative & Media Agents",
        agents: [
            { name: "Lina", role: "Content Creator Agent", description: "Designs posts, videos, brochures.", icon: Palette },
            { name: "Noor", role: "Copywriting Agent", description: "Catchy ad copy, website text.", icon: PenSquare },
            { name: "Voxi", role: "Voice & Translation Agent", description: "Voiceovers, Arabic-English translation.", icon: Languages },
            { name: "Vista", role: "Virtual Tour / Visual Agent", description: "Photo editing, 360° virtual tours.", icon: Camera },
        ]
    },
    {
        category: "Special Growth Agents",
        agents: [
            { name: "Rami", role: "Strategy & Research Agent", description: "Market research, competitor tracking.", icon: Target },
            { name: "Navi", role: "Innovation Agent", description: "Suggests new services/products.", icon: Rocket },
            { name: "Paz", role: "Partnership Agent", description: "Finds collaborators, drafts proposals.", icon: Handshake },
        ]
    },
];

export default function AgentList() {
    return (
        <div className="space-y-12">
            {agentCategories.map((category) => (
                <div key={category.category}>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{category.category}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.agents.map((agent) => (
                            <Card key={agent.name} className="bg-card border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent transition-colors">
                                        <agent.icon className="w-6 h-6 text-primary group-hover:text-accent-foreground transition-colors" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{agent.role}</p>
                                    </div>
                                </CardHeader>
                                <CardDescription className="px-6 pb-6 text-sm">
                                    {agent.description}
                                </CardDescription>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}