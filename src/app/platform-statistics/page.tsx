
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, Zap, FolderKanban, Network, Briefcase, Building2, GraduationCap, Handshake } from "lucide-react";
import { useProductsData, useStaffData, useProvidersData, useOpportunitiesData, useServicesData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlatformStatisticsPage() {
    const { products, isClient: isProductsClient } = useProductsData();
    const { leadership, staff, agentCategories, isClient: isStaffClient } = useStaffData();
    const { providers, isClient: isProvidersClient } = useProvidersData();
    const { opportunities, isClient: isOpportunitiesClient } = useOpportunitiesData();
    const { services, isClient: isServicesClient } = useServicesData();
    
    const isClient = isProductsClient && isStaffClient && isProvidersClient && isOpportunitiesClient && isServicesClient;

    const totalAgents = agentCategories.reduce((sum, cat) => sum + cat.agents.length, 0);
    const totalStaff = leadership.length + staff.length;
    const totalWorkforce = totalAgents + totalStaff;
    const activeProjects = products.filter(p => p.stage !== 'Live & Operating' && p.stage !== 'Idea Phase').length;
    const liveProducts = products.filter(p => p.stage === 'Live & Operating').length;
    const totalOpportunities = opportunities.filter(o => o.status === 'Open').length;
    const totalProviders = providers.length;
    const totalServices = services.length;
    const contechProducts = products.filter(p => p.category === "Construction Tech").length;
    const edutechProducts = products.filter(p => p.category === "Education Tech").length;
    const retechProducts = products.filter(p => p.category === "Real Estate Tech").length;

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
                        {isClient ? (
                            stats.map((stat) => (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-primary">{stat.value}</div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                             Array.from({ length: 9 }).map((_, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <Skeleton className="h-5 w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-10 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
