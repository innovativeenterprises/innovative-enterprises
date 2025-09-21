
'use client';

import { useState, useMemo, useEffect } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadge, getStageBadge } from "@/components/status-badges";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStaffData, useProductsData, useProvidersData, useOpportunitiesData, useServicesData } from "@/hooks/use-global-store-data";
import type { Product } from "@/lib/products.schema";
import type { Provider } from "@/lib/providers.schema";
import type { Opportunity } from "@/lib/opportunities.schema";
import type { Service } from "@/lib/services.schema";
import type { Agent, AgentCategory } from "@/lib/agents.schema";


const ChartCard = ({ title, data, dataKey, color }: { title: string, data: any[], dataKey: string, color: string }) => (
    <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/>
                    <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

export default function AdminDashboardPageClient({ 
    initialProducts, 
    initialProviders, 
    initialLeadership, 
    initialStaff, 
    initialAgentCategories, 
    initialOpportunities, 
    initialServices 
}: {
    initialProducts: Product[],
    initialProviders: Provider[],
    initialLeadership: Agent[],
    initialStaff: Agent[],
    initialAgentCategories: AgentCategory[],
    initialOpportunities: Opportunity[],
    initialServices: Service[]
}) {
    const { products, setProducts } = useProductsData();
    const { providers, setProviders } = useProvidersData();
    const { leadership, staff, agentCategories, setStaffData } = useStaffData();
    const { opportunities, setOpportunities } = useOpportunitiesData();
    const { services, setServices } = useServicesData();
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setProducts(initialProducts);
        setProviders(initialProviders);
        setStaffData({ leadership: initialLeadership, staff: initialStaff, agentCategories: initialAgentCategories });
        setOpportunities(initialOpportunities);
        setServices(initialServices);
        setIsClient(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialProducts, initialProviders, initialLeadership, initialStaff, initialAgentCategories, initialOpportunities, initialServices]);

    const kpiData = useMemo(() => [
        { name: 'Products', value: products.length },
        { name: 'Providers', value: providers.length },
        { name: 'Opportunities', value: opportunities.length },
        { name: 'Services', value: services.length },
        { name: 'AI Agents', value: agentCategories.reduce((acc, cat) => acc + cat.agents.length, 0) },
        { name: 'Staff', value: leadership.length + staff.length },
    ], [products, providers, opportunities, services, agentCategories, leadership, staff]);
    
    const recentProviders = useMemo(() => providers.slice(0, 5), [providers]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        A high-level overview of the Innovative Enterprises ecosystem.
                    </p>
                </div>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   <ChartCard title="Ecosystem Overview" data={kpiData} dataKey="value" color="#8884d8" />
                   <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Recently Joined Partners</CardTitle>
                            <CardDescription>A list of the newest providers in your network.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Services</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {recentProviders.map(provider => (
                                        <TableRow key={provider.id}>
                                            <TableCell className="font-medium">{provider.name}</TableCell>
                                            <TableCell>{provider.services}</TableCell>
                                            <TableCell>{getStatusBadge(provider.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                   </Card>
                </div>
            </div>
        </DndProvider>
    );
}

