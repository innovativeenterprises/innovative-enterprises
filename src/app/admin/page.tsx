

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Bot, Zap, CheckCircle, FolderKanban, Network, CircleDollarSign, Percent, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useProductsData, useStaffData, useProvidersData } from '@/hooks/use-global-store-data';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { store } from "@/lib/global-store";
import type { Opportunity } from "@/lib/opportunities";
import { useOpportunitiesData } from "@/hooks/use-global-store-data";

const overviewStats = [
    { title: "Net Revenue", value: "OMR 45,231", icon: CircleDollarSign, href: "/admin/finance" },
    { title: "Subscriptions", value: "+2,350", icon: Users, href: "/admin/finance" },
    { title: "Operational Cost", value: "OMR 9,231", icon: TrendingUp, href: "/admin/finance" },
    { title: "VAT Collected", value: "OMR 2,153", icon: Percent, href: "/admin/finance" },
];

export default function AdminDashboardPage() {
  const { products, isClient: isProductsClient } = useProductsData();
  const { providers, isClient: isProvidersClient } = useProvidersData();
  const { leadership, staff, agentCategories, isClient: isStaffClient } = useStaffData();
  const { opportunities, isClient: isOpportunitiesClient } = useOpportunitiesData();
  
  const isClient = isProductsClient && isProvidersClient && isStaffClient && isOpportunitiesClient;
  
  const totalAgents = useMemo(() => isClient ? agentCategories.reduce((sum, cat) => sum + cat.agents.length, 0) : 0, [agentCategories, isClient]);
  const totalStaff = useMemo(() => isClient ? leadership.length + staff.length : 0, [leadership, staff, isClient]);
  
  const dynamicStats = [
    { title: "Total Staff (Human + AI)", value: isClient ? (totalStaff + totalAgents).toString() : '...', icon: Users, href: "/admin/people" },
    { title: "Active Projects", value: isClient ? products.filter(p => p.stage !== 'Live & Operating').length.toString() : '...', icon: FolderKanban, href: "/admin/projects" },
    { title: "Active Opportunities", value: isClient ? opportunities.filter(o => o.status === 'Open').length.toString() : '...', icon: Zap, href: "/admin/projects" },
    { title: "Provider Network", value: isClient ? providers.length.toString() : '...', icon: Network, href: "/admin/network" },
  ];

  const projectStatusData = useMemo(() => {
    if (!isClient) return [];
    return products.reduce((acc, product) => {
        const stage = product.stage || 'Uncategorized';
        const existing = acc.find(item => item.stage === stage);
        if (existing) {
        existing.count++;
        } else {
        acc.push({ stage, count: 1 });
        }
        return acc;
    }, [] as { stage: string, count: number }[])
  }, [products, isClient]);

  const networkGrowthData = useMemo(() => {
      if (!isClient) return [];
      return [
          { month: 'Feb', count: 12 },
          { month: 'Mar', count: 15 },
          { month: 'Apr', count: 20 },
          { month: 'May', count: 22 },
          { month: 'Jun', count: 28 },
          { month: 'Jul', count: providers.length },
      ]
  }, [providers, isClient]);

  const chartConfig = {
      count: { label: "Count" },
  };
  
  const getAdminStatusBadge = (status?: string) => {
    switch (status) {
        case "On Track": return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{status}</Badge>;
        case "At Risk": return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">{status}</Badge>;
        case "On Hold": return <Badge className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">{status}</Badge>;
        case "Completed": return <Badge variant="secondary">{status}</Badge>;
        default: return <Badge variant="outline">N/A</Badge>;
    }
  }

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
              An overview of your digital and human workforce.
          </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...overviewStats, ...dynamicStats].map((stat, index) => (
              <Link href={stat.href} key={index}>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isClient ? (
                            <div className="text-2xl font-bold">{stat.value}</div>
                        ) : (
                            <Skeleton className="h-8 w-20" />
                        )}
                    </CardContent>
                </Card>
              </Link>
          ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
            <CardDescription>Number of products in each development stage.</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={projectStatusData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="stage" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                    </BarChart>
                </ChartContainer>
            ) : <Skeleton className="h-[300px] w-full" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider Network Growth</CardTitle>
            <CardDescription>Growth of the freelancer and partner network over time.</CardDescription>
          </CardHeader>
          <CardContent>
             {isClient ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={networkGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-primary)" }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ChartContainer>
            ) : <Skeleton className="h-[300px] w-full" />}
          </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>An overview of all projects currently in the pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Admin Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            ))
                        ) : (
                            products.slice(0, 10).map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.stage}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.enabled ? "default" : "secondary"}>
                                            {product.enabled ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getAdminStatusBadge(product.adminStatus)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                 <Button asChild variant="outline">
                    <Link href="/admin/projects">
                        View All Projects
                    </Link>
                 </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
