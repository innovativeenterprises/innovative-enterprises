
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { Briefcase, DollarSign, Users, Scale, Headset, TrendingUp, Megaphone, Contact, Cpu, Database, BrainCircuit, Bot, PenSquare, Palette, Languages, Camera, Target, Rocket, Handshake, User } from "lucide-react";

interface Agent {
    role: string;
    name: string;
    description: string;
    icon: LucideIcon;
    enabled: boolean;
}

interface AgentCategory {
    category: string;
    agents: Agent[];
}

const initialLeadershipTeam: Agent[] = [
    { name: "JUMAA SALIM ALHADID", role: "CEO and Cofounder", description: "Leads the company's vision and strategic direction.", icon: User, enabled: true },
    { name: "ANWAR AHMED SHARIF", role: "Cofounder and CTO", description: "Drives technological innovation and engineering.", icon: User, enabled: true },
    { name: "ABDULJABBAR AL SADIG AL FAKI", role: "Projects Manager", description: "Oversees all project execution and delivery.", icon: User, enabled: true },
    { name: "HUDA AL SALMI", role: "Public Relations Officer (PRO)", description: "Manages government relations and public engagement.", icon: User, enabled: true },
    { name: "Legal Counsel Office", role: "Advocate & Legal Representative", description: "Provides expert legal guidance and representation.", icon: User, enabled: true },
];

const initialAgentCategories: AgentCategory[] = [
    {
        category: "Core Business Operations Agents",
        agents: [
            { name: "Aida", role: "Admin / Executive Assistant", description: "Schedules, reminders, document prep.", icon: Briefcase, enabled: true },
            { name: "Finley", role: "Finance & Accounting Agent", description: "Bookkeeping, invoices, expense tracking, tax reminders.", icon: DollarSign, enabled: true },
            { name: "Hira", role: "HR & Recruitment Agent", description: "CV screening, ATS checks, onboarding automation.", icon: Users, enabled: true },
            { name: "Lexi", role: "Legal & Contracts Agent", description: "Draft agreements, compliance checks.", icon: Scale, enabled: true },
        ]
    },
    {
        category: "Customer & Sales Agents",
        agents: [
            { name: "Caro", role: "Customer Support Agent", description: "Handles WhatsApp, email, chatbot queries 24/7.", icon: Headset, enabled: true },
            { name: "Sami", role: "Sales Agent", description: "Follows up leads, pitches services, books meetings.", icon: TrendingUp, enabled: true },
            { name: "Mira", role: "Marketing Agent", description: "Creates ads, social posts, SEO, blog content.", icon: Megaphone, enabled: true },
            { name: "Remi", role: "CRM Agent", description: "Tracks customer relationships, sends follow-ups.", icon: Contact, enabled: true },
        ]
    },
    {
        category: "Tech & Data Agents",
        agents: [
            { name: "Tariq Tech", role: "IT Support Agent", description: "Troubleshoots software, automates processes.", icon: Cpu, enabled: true },
            { name: "Dana", role: "Data Analyst Agent", description: "Dashboards, trends, KPI monitoring.", icon: Database, enabled: true },
            { name: "Neo", role: "AI Training Agent", description: "Fine-tunes your AI tools on your business data.", icon: BrainCircuit, enabled: true },
            { name: "AutoNabil", role: "Automation Agent", description: "Connects all tools (Zapier/Make style).", icon: Bot, enabled: true },
        ]
    },
    {
        category: "Creative & Media Agents",
        agents: [
            { name: "Lina", role: "Content Creator Agent", description: "Designs posts, videos, brochures.", icon: Palette, enabled: true },
            { name: "Noor", role: "Copywriting Agent", description: "Catchy ad copy, website text.", icon: PenSquare, enabled: true },
            { name: "Voxi", role: "Voice & Translation Agent", description: "Voiceovers, Arabic-English translation.", icon: Languages, enabled: true },
            { name: "Vista", role: "Virtual Tour / Visual Agent", description: "Photo editing, 360° virtual tours.", icon: Camera, enabled: true },
        ]
    },
    {
        category: "Special Growth Agents",
        agents: [
            { name: "Rami", role: "Strategy & Research Agent", description: "Market research, competitor tracking.", icon: Target, enabled: true },
            { name: "Navi", role: "Innovation Agent", description: "Suggests new services/products.", icon: Rocket, enabled: true },
            { name: "Paz", role: "Partnership Agent", description: "Finds collaborators, drafts proposals.", icon: Handshake, enabled: true },
        ]
    },
];

export default function StaffTable() {
    const [leadership, setLeadership] = useState<Agent[]>(initialLeadershipTeam);
    const [agentCategories, setAgentCategories] = useState<AgentCategory[]>(initialAgentCategories);

    const handleToggle = (name: string, type: 'leadership' | 'agent') => {
        if (type === 'leadership') {
            setLeadership(prev => 
                prev.map(member => 
                    member.name === name ? { ...member, enabled: !member.enabled } : member
                )
            );
        } else {
            setAgentCategories(prev => 
                prev.map(category => ({
                    ...category,
                    agents: category.agents.map(agent => 
                        agent.name === name ? { ...agent, enabled: !agent.enabled } : agent
                    )
                }))
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leadership.map(member => (
                            <TableRow key={member.name}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell><Badge variant="secondary">Leadership</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Switch
                                        checked={member.enabled}
                                        onCheckedChange={() => handleToggle(member.name, 'leadership')}
                                        aria-label={`Enable/disable ${member.name}`}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                         {agentCategories.flatMap(category => 
                            category.agents.map(agent => (
                                <TableRow key={agent.name}>
                                    <TableCell className="font-medium">{agent.name}</TableCell>
                                    <TableCell>{agent.role}</TableCell>
                                    <TableCell><Badge>AI Agent</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Switch
                                            checked={agent.enabled}
                                            onCheckedChange={() => handleToggle(agent.name, 'agent')}
                                            aria-label={`Enable/disable ${agent.name}`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
