
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Bot, Zap, CheckCircle, FolderKanban, Network } from "lucide-react";
import Link from "next/link";
import { useProductsData } from "./product-table";
import { useProvidersData } from "./provider-table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const overviewStats = [
    { title: "Total Staff (Human + AI)", value: "26", icon: Users, href: "/admin/people" },
    { title: "Active Projects", value: "14", icon: FolderKanban, href: "/admin/projects" },
    { title: "Active Opportunities", value: "5", icon: Zap, href: "/admin/opportunities" },
    { title: "Provider Network", value: "36", icon: Network, href: "/admin/network" },
];

export default function AdminDashboardPage() {
  const { products } = useProductsData();
  const { providers } = useProvidersData();

  const projectStatusData = products.reduce((acc, product) => {
    const stage = product.stage || 'Uncategorized';
    const existing = acc.find(item => item.stage === stage);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ stage, count: 1 });
    }
    return acc;
  }, [] as { stage: string, count: number }[]);

  const networkGrowthData = [
      { month: 'Feb', count: 12 },
      { month: 'Mar', count: 15 },
      { month: 'Apr', count: 20 },
      { month: 'May', count: 22 },
      { month: 'Jun', count: 28 },
      { month: 'Jul', count: 36 },
  ];

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
          {overviewStats.map((stat, index) => (
              <Link href={stat.href} key={index}>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
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
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={projectStatusData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="stage" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider Network Growth</CardTitle>
            <CardDescription>Growth of the freelancer and partner network over time.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={networkGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
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
                        {products.slice(0, 10).map((product) => (
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
                        ))}
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
