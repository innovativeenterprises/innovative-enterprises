
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DueDateDisplay } from '@/components/due-date-display';

// Main Dashboard Component
export default function CfoDashboardClient({ cfoData }: { cfoData: any }) {
  const { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } = cfoData;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{status}</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">{status}</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const chartConfig = {
      income: { label: "Income", color: "hsl(var(--chart-1))" },
      expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CFO Dashboard</h1>
        <p className="text-muted-foreground">
          Financial overview and analysis for your business operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map((kpi: any, index: number) => (
          <Link href={kpi.href} key={index}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A list of recent financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client/Vendor</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.slice(0, 10).map((transaction: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell><div className="font-medium">{transaction.client}</div></TableCell>
                    <TableCell className="hidden sm:table-cell">{transaction.type}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">OMR {transaction.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader><CardTitle>Monthly Cash Flow</CardTitle></CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart data={cashFlowData} accessibilityLayer>
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert />VAT Payment Due</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold text-destructive">OMR {vatPayment.amount.toFixed(2)}</p>
                    <DueDateDisplay date={vatPayment.dueDate} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Upcoming Payments</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                           <TableRow><TableHead>Source</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                           {upcomingPayments.slice(0, 5).map((payment: any, index: number) => (
                               <TableRow key={index}>
                                   <TableCell>
                                       <div className="font-medium">{payment.source}</div>
                                       <DueDateDisplay date={payment.dueDate} />
                                   </TableCell>
                                   <TableCell className="text-right font-medium">OMR {payment.amount.toFixed(2)}</TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
