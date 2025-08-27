
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, CircleDollarSign, Users, TrendingUp, Briefcase, Percent } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const kpiData = [
    { title: "Net Revenue", value: "OMR 45,231.89", change: "+20.1% from last month", icon: CircleDollarSign },
    { title: "Subscriptions", value: "+2,350", change: "+180.1% from last month", icon: Users },
    { title: "VAT Collected", value: "OMR 2,153.52", change: "+22% from last month", icon: Percent },
    { title: "Operational Cost", value: "OMR 9,231.89", change: "+2% from last month", icon: TrendingUp },
];

const transactionData = [
  { invoice: "INV001", type: 'Project', status: "Paid", total: 250.00, client: "PANOSPACE Virtual Tour - Real Estate Co." },
  { invoice: "INV002", type: 'Service', status: "Paid", total: 150.00, client: "Voxi Translation Service - Legal Docs" },
  { invoice: "INV003", type: 'Subscription', status: "Paid", total: 350.00, client: "Sanad Hub - New Office Subscription" },
  { invoice: "INV004", type: 'Expense', status: "Paid", total: 450.00, client: "Facebook/Google Ads - Marketing" },
  { invoice: "INV005", type: 'Project', status: "Pending", total: 550.00, client: "KHIDMAAI Platform Development" },
  { invoice: "INV006", type: 'Expense', status: "Paid", total: 200.00, client: "Cloud Hosting - AWS" },
  { invoice: "INV007", type: 'Service', status: "Unpaid", total: 300.00, client: "Aegis Security Audit" },
];

const upcomingPayments = [
    { source: "VAT Filing & Payment", amount: 2153.52, dueDate: "2024-09-30" },
    { source: "Partner Commission Payout", amount: 1200.00, dueDate: "2024-08-25" },
    { source: "Cloud Services (AWS)", amount: 450.50, dueDate: "2024-08-28" },
    { source: "Office Rent", amount: 800.00, dueDate: "2024-09-01" },
    { source: "Software Licenses", amount: 250.00, dueDate: "2024-09-05" },
];

const cashFlowData = [
  { month: 'Mar', income: 4000, expenses: 2400 },
  { month: 'Apr', income: 3000, expenses: 1398 },
  { month: 'May', income: 2000, expenses: 9800 },
  { month: 'Jun', income: 2780, expenses: 3908 },
  { month: 'Jul', income: 1890, expenses: 4800 },
  { month: 'Aug', income: 2390, expenses: 3800 },
];

const chartConfig = {
    income: { label: "Income", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
};


export default function CfoDashboard() {
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

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CFO Dashboard</h1>
        <p className="text-muted-foreground">
          Financial overview and analysis for your business operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{transaction.client}</div>
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
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
                <CardHeader>
                    <CardTitle>Monthly Cash Flow</CardTitle>
                </CardHeader>
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
             <Card>
                <CardHeader>
                    <CardTitle>Upcoming Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                           <TableRow>
                             <TableHead>Source</TableHead>
                             <TableHead className="text-right">Amount</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {upcomingPayments.map((payment, index) => {
                               const daysRemaining = getDaysRemaining(payment.dueDate);
                               return (
                                   <TableRow key={index}>
                                       <TableCell>
                                           <div className="font-medium">{payment.source}</div>
                                           <div className="text-sm text-muted-foreground">
                                               Due: {payment.dueDate} 
                                               {daysRemaining >= 0 ? 
                                                 <span className={daysRemaining < 7 ? "text-destructive" : ""}> ({daysRemaining} days left)</span> 
                                               : ' (Overdue)'}
                                           </div>
                                       </TableCell>
                                       <TableCell className="text-right font-medium">OMR {payment.amount.toFixed(2)}</TableCell>
                                   </TableRow>
                               )
                           })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
