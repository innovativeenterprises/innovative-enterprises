
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusBadge } from "@/components/status-badges";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
                    <Tooltip />
                    <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

export default function AdminDashboardPageClient({ 
    products, 
    providers, 
    leadership, 
    staff, 
    agentCategories, 
    opportunities, 
    services 
}: {
    products: Product[],
    providers: Provider[],
    leadership: Agent[],
    staff: Agent[],
    agentCategories: AgentCategory[],
    opportunities: Opportunity[],
    services: Service[]
}) {
    
    const kpiData = [
        { name: 'Products', value: products.length },
        { name: 'Providers', value: providers.length },
        { name: 'Opportunities', value: opportunities.length },
        { name: 'Services', value: services.length },
        { name: 'AI Agents', value: agentCategories.reduce((acc, cat) => acc + cat.agents.length, 0) },
        { name: 'Staff', value: leadership.length + staff.length },
    ];
    
    const recentProviders = providers.slice(0, 5);

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
