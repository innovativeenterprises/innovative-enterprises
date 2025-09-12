
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, Zap, FolderKanban, Network, Briefcase, Building2, GraduationCap, Handshake } from "lucide-react";
import { useProductsData, useStaffData, useProvidersData, useOpportunitiesData, useServicesData } from '@/hooks/use-global-store-data';
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from 'react';

export default function PlatformStatisticsPage() {
    const { products } = useProductsData();
    const { leadership, staff, agentCategories } = useStaffData();
    const { providers } = useProvidersData();
    const { opportunities } = useOpportunitiesData();
    const { services } = useServicesData();
    
    const isClient = true; // All hooks are client-safe now.

    const totalAgents = useMemo(() => agentCategories.reduce((sum, cat) => sum + cat.agents.length, 0), [agentCategories]);
    const totalStaff = useMemo(() => leadership.length + staff.length, [leadership, staff]);
    const totalWorkforce = totalAgents + totalStaff;
    const activeProjects = useMemo(() => products.filter(p => p.stage !== 'Live & Operating' && p.stage !== 'Idea Phase').length, [products]);
    const liveProducts = useMemo(() => products.filter(p => p.stage === 'Live & Operating').length, [products]);
    const totalOpportunities = useMemo(() => opportunities.filter(o => o.status === 'Open').length, [opportunities]);
    const totalProviders = providers.length;
    const totalServices = services.length;
    const contechProducts = useMemo(() => products.filter(p => p.category === "Construction Tech").length, [products]);
    const edutechProducts = useMemo(() => products.filter(p => p.category === "Education Tech").length, [products]);
    const retechProducts = useMemo(() => products.filter(p => p.category === "Real Estate Tech").length, [products]);

    const stats = [
        { title: "Total Digital Workforce", value: totalAgents, icon: Bot },
        { title: "Human Experts", value: totalStaff, icon: Users },
        { title: "Total Workforce (Human + AI)", value: totalWorkforce, icon: Handshake },
        { title: "Active Projects", value: activeProjects, icon: FolderKanban },
        { title: "Live Products & Platforms", value: liveProducts, icon: Zap },
        { title: "Core Business Services", value: totalServices, icon: Briefcase },
        { title: "Partner & Provider Network", value: totalProviders, icon: Network },
        { title: "Open Opportunities", value: totalOpportunities, icon: Zap },
        { title: "Construction Tech Solutions", value: contechProducts, icon: Building2 },
        { title: "Real Estate Tech Solutions", value: retechProducts, icon: Building2 },
        { title: "Education Tech Solutions", value: edutechProducts, icon: GraduationCap },
    ];

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Platform Statistics</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A real-time overview of our ecosystem, showcasing the scale of our operations, network, and portfolio.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        {!isClient ? <Skeleton className="h-10 w-16" /> : <div className="text-4xl font-bold text-primary">{stat.value}</div>}
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
