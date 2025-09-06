
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Linkedin, Twitter, Github, Globe, Mail, Users } from "lucide-react";
import Link from 'next/link';
import type { Agent, AgentCategory } from '@/lib/agents';
import { useStaffData } from "@/app/admin/staff-table";

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

const HumanCard = ({ member }: { member: Agent }) => {
    const cardContent = (
        <Card className="bg-card border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group text-center flex flex-col h-full">
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
                        <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Linkedin className="w-5 h-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                    )}
                    {member.socials?.twitter && (
                        <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Twitter className="w-5 h-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                    )}
                    {member.socials?.github && (
                        <Link href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Github className="w-5 h-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    )}
                    {member.socials?.website && (
                        <Link href={member.socials.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Globe className="w-5 h-5" />
                            <span className="sr-only">Website</span>
                        </Link>
                    )}
                    {member.socials?.email && (
                        <Link href={`mailto:${member.socials.email}`} className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Mail className="w-5 h-5" />
                            <span className="sr-only">Email</span>
                        </Link>
                    )}
                </div>
            </CardFooter>
        </Card>
    );

    if (member.href) {
        return <Link href={member.href} className="flex h-full">{cardContent}</Link>;
    }
    return cardContent;
};

export function LeadershipTeam({ team }: { team: Agent[] }) {
    if (team.length === 0) return null;
    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">Our Leadership</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {team.map((member) => <HumanCard key={member.name} member={member} />)}
            </div>
        </div>
    )
}

export function StaffTeam({ team }: { team: Agent[] }) {
    if (team.length === 0) return null;
    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {team.map((member) => <HumanCard key={member.name} member={member} />)}
            </div>
        </div>
    )
}


export function DigitalWorkforce({ categories }: { categories: AgentCategory[] }) {
    return (
         <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Digital Workforce</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    A dedicated team of AI agents handling specialized tasks to drive efficiency and innovation.
                </p>
            </div>
            <div className="space-y-12">
                {categories.map((category) => (
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
    const { agentCategories } = useStaffData();

    const enabledAgentCategories = agentCategories.map(category => ({
        ...category,
        agents: category.agents.filter(agent => agent.enabled)
    })).filter(category => category.agents.length > 0);

    return (
        <DigitalWorkforce categories={enabledAgentCategories} />
    )
}
