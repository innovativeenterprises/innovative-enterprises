
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Service } from '@/lib/services.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import { LeadershipTeam, DigitalWorkforce } from '@/components/agent-list';

interface AdminDashboardPageClientProps {
    initialProducts: Product[];
    initialProviders: Provider[];
    initialLeadership: Agent[];
    initialStaff: Agent[];
    initialAgentCategories: AgentCategory[];
    initialOpportunities: Opportunity[];
    initialServices: Service[];
}

export default function AdminDashboardPageClient({
    initialProducts,
    initialProviders,
    initialLeadership,
    initialStaff,
    initialAgentCategories,
    initialOpportunities,
    initialServices
}: AdminDashboardPageClientProps) {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [leadership, setLeadership] = useState<Agent[]>([]);
    const [staff, setStaff] = useState<Agent[]>([]);
    const [agentCategories, setAgentCategories] = useState<AgentCategory[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        setProducts(initialProducts);
        setProviders(initialProviders);
        setLeadership(initialLeadership);
        setStaff(initialStaff);
        setAgentCategories(initialAgentCategories);
        setOpportunities(initialOpportunities);
        setServices(initialServices);
    }, [initialProducts, initialProviders, initialLeadership, initialStaff, initialAgentCategories, initialOpportunities, initialServices]);

    const stats = useMemo(() => {
        const totalAgents = agentCategories.reduce((sum, cat) => sum + cat.agents.length, 0);
        const totalStaff = leadership.length + staff.length;
        return [
            { title: "Total Products", value: products.length, href: "/admin/projects" },
            { title: "Active Services", value: services.filter(s => s.enabled).length, href: "/admin/content" },
            { title: "Partner Network", value: providers.length, href: "/admin/network" },
            { title: "Open Opportunities", value: opportunities.filter(o => o.status === 'Open').length, href: "/admin/opportunities" },
            { title: "Human Workforce", value: totalStaff, href: "/admin/people" },
            { title: "AI Workforce", value: totalAgents, href: "/admin/people" },
        ];
    }, [products, services, providers, opportunities, leadership, staff, agentCategories]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    A high-level overview of the Innovative Enterprises ecosystem.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="link" className="p-0 h-auto">
                                <Link href={stat.href}>View Details <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
            <LeadershipTeam team={leadership} />
            
            <DigitalWorkforce categories={agentCategories} />

        </div>
    );
}
