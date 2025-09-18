
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ArrowRight, DollarSign, Bot } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DueDateDisplay } from '@/components/due-date-display';
import { Button } from '@/components/ui/button';

export default function CfoDashboardClient({ cfoData }: { cfoData: any }) {
  const { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } = cfoData;

  const features = [
    { title: "AI-Powered Auditing", description: "Let Finley, our AI auditor, perform preliminary checks on your financial documents for compliance and red flags." },
    { title: "Real-time Cash Flow Analysis", description: "Connect your accounts to get a live, dynamic view of your cash flow and financial health." },
    { title: "Automated KPI Monitoring", description: "Track key performance indicators like revenue, profit margins, and expenses automatically." },
    { title: "Predictive Forecasting", description: "Leverage AI to forecast future revenue and expenses, helping you make smarter business decisions." },
  ];
  

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <DollarSign className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">Fintech Super-App</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    An integrated financial services application providing AI-driven auditing, financial analysis, and CFO dashboard capabilities, powered by our AI agent, Finley.
                </p>
            </div>
            
             <div className="max-w-5xl mx-auto mt-20">
                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="bg-card border-l-4 border-primary/50">
                            <CardHeader>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-20 text-center">
                <Card className="bg-accent/10 border-accent">
                    <CardHeader>
                        <CardTitle className="text-2xl text-accent">Explore the Live Demo</CardTitle>
                        <CardDescription className="text-accent-foreground/80">
                           Our full CFO Dashboard is available for you to explore. View key financial metrics, transaction histories, and see how our AI can provide a comprehensive overview of your business operations.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/admin/cfo-dashboard">View CFO Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
             <div className="max-w-3xl mx-auto mt-8 text-center">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center justify-center gap-2"><Bot className="h-6 w-6"/> AI Audit Assistant</CardTitle>
                        <CardDescription>
                           Use our standalone tool to upload financial documents and get a preliminary audit from Finley.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/cfo/audit">Launch Audit Tool <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    </div>
  );
}
