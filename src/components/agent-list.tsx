
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake, User, Linkedin, Twitter, Instagram, Facebook, Mail, Github, Globe, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from 'next/link';

interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
    href?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
        email?: string;
        github?: string;
        website?: string;
    }
}

interface AgentCategory {
    category: string;
    agents: Agent[];
}

const leadershipTeam: Agent[] = [
    { 
        name: "JUMAA SALIM ALHADID", 
        role: "CEO and Cofounder", 
        description: "Leads the company's vision and strategic direction.", 
        icon: User,
        socials: {
            linkedin: "#",
            twitter: "#",
            email: "mailto:jumaa@innovative.om",
            website: "#"
        }
    },
    { 
        name: "ANWAR AHMED SHARIF", 
        role: "Cofounder and CTO", 
        description: "Drives technological innovation and engineering.", 
        icon: User,
        socials: {
            linkedin: "#",
            twitter: "#",
            email: "mailto:anwar@innovative.om",
            github: "#",
        }
    },
    { 
        name: "ABDULJABBAR AL SADIG AL FAKI", 
        role: "Projects Manager", 
        description: "Oversees all project execution and delivery.", 
        icon: User,
        socials: {
            linkedin: "#",
            twitter: "#",
            email: "mailto:abduljabbar@innovative.om"
        }
    },
    {
        name: "HUDA AL SALMI",
        role: "Public Relations Officer (PRO)",
        description: "Manages government relations and public engagement.",
        icon: User,
        socials: {
            linkedin: "#",
            email: "mailto:huda@innovative.om"
        }
    },
    {
        name: "Legal Counsel Office",
        role: "Advocate & Legal Representative",
        description: "Provides expert legal guidance and representation.",
        icon: User,
        socials: {
            website: "#",
            email: "mailto:legal@innovative.om"
        }
    }
];

const agentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin / Executive Assistant", description: "Schedules, reminders, document prep.", icon: Briefcase },
            { name: "Finley", role: "Finance & Accounting Agent", description: "Bookkeeping, invoices, expense tracking, tax reminders.", icon: DollarSign },
            { name: "Hira", role: "HR & Recruitment Agent", description: "CV screening, ATS checks, onboarding automation.", icon: Users, href: "/cv-enhancer" },
            { name: "Lexi", role: "Legal & Contracts Agent", description: "Draft agreements, compliance checks.", icon: Scale, href: "/legal-agent"},
            { name: "Talia", role: "Talent & Competition Agent", description: "Posts opportunities, manages submissions.", icon: Trophy, href: "/opportunities" },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Caro", role: "Customer Support Agent", description: "Handles WhatsApp, email, chatbot queries 24/7.", icon: Headset, href: "/faq" },
            { name: "Sami", role: "Sales Agent", description: "Follows up leads, pitches services, books meetings.", icon: TrendingUp },
            { name: "Mira", role: "Marketing Agent", description: "Creates ads, social posts, SEO, blog content.", icon: Megaphone, href: "/social-media-post-generator" },
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
            { name: "Paz", role: "Partnership Agent", description: "Finds collaborators, drafts proposals.", icon: Handshake, href: "/service-provider" },
        ]
    },
];

export function LeadershipTeam() {
    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">Our Leadership</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {leadershipTeam.map((member) => (
                    <Card key={member.name} className="bg-card border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group text-center flex flex-col">
                        <CardHeader className="flex flex-col items-center gap-4 pt-8">
                             <div className="bg-primary/10 p-4 rounded-full group-hover:bg-accent transition-colors">
                                <member.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground transition-colors" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{member.name}</CardTitle>
                                <p className="text-base text-muted-foreground">{member.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 text-sm flex-grow">
                            {member.description}
                        </CardContent>
                        <CardFooter className="justify-center pt-0 pb-6">
                            <div className="flex gap-4">
                                {member.socials?.linkedin && (
                                    <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </Link>
                                )}
                                {member.socials?.twitter && (
                                    <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Twitter className="w-5 h-5" />
                                        <span className="sr-only">Twitter</span>
                                    </Link>
                                )}
                                {member.socials?.github && (
                                    <Link href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Github className="w-5 h-5" />
                                        <span className="sr-only">GitHub</span>
                                    </Link>
                                )}
                                {member.socials?.website && (
                                    <Link href={member.socials.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Globe className="w-5 h-5" />
                                        <span className="sr-only">Website</span>
                                    </Link>
                                )}
                                {member.socials?.email && (
                                    <Link href={member.socials.email} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Mail className="w-5 h-5" />
                                        <span className="sr-only">Email</span>
                                    </Link>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="bg-card border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent transition-colors">
                <agent.icon className="w-6 h-6 text-primary group-hover:text-accent-foreground transition-colors" />
            </div>
            <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{agent.role}</p>
            </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 text-sm flex-grow">
            <CardDescription>{agent.description}</CardDescription>
        </CardContent>
    </Card>
);

export function DigitalWorkforce() {
    return (
         <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Digital Workforce</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    A dedicated team of AI agents handling specialized tasks to drive efficiency and innovation.
                </p>
            </div>
            <div className="space-y-12">
                {agentCategories.map((category) => (
                    <div key={category.category}>
                        <h3 className="text-2xl md:text-3xl font-bold text-center text-primary/80 mb-8">{category.category}</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {category.agents.map((agent) => (
                                agent.href ? (
                                    <Link href={agent.href} key={agent.name} className="flex">
                                        <AgentCard agent={agent} />
                                    </Link>
                                ) : (
                                    <AgentCard key={agent.name} agent={agent} />
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function AgentList() {
    return (
        <div className="space-y-12">
            <LeadershipTeam />
            <DigitalWorkforce />
        </div>
    );
}
