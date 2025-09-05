
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, CircleDollarSign, Users, TrendingUp, Briefcase, Percent, ShieldAlert, FolderKanban, Network } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const kpiData = [
    { title: "Net Revenue", value: "OMR 45,231.89", change: "+20.1% from last month", icon: CircleDollarSign },
    { title: "Subscriptions", value: "+2,350", change: "+180.1% from last month", icon: Users },
    { title: "VAT Collected", value: "OMR 2,153.52", change: "+22% from last month", icon: Percent },
    { title: "Operational Cost", value: "OMR 9,231.89", change: "+2% from last month", icon: TrendingUp },
    { title: "Total Projects", value: "14", change: "+3 since last month", icon: FolderKanban },
    { title: "Provider Network", value: "36", change: "+5 since last month", icon: Network },
];

const transactionData = [
  { invoice: "INV001", type: 'Project', status: "Paid", total: 250.00, client: "PANOSPACE Virtual Tour - Real Estate Co." },
  { invoice: "INV002", type: 'Service', status: "Paid", total: 150.00, client: "Voxi Translation Service - Legal Docs" },
  { invoice: "INV003", type: 'Subscription', status: "Paid", total: 350.00, client: "Sanad Hub - New Office Subscription" },
  { invoice: "INV004", type: 'Expense', status: "Paid", total: 450.00, client: "Facebook/Google Ads - Marketing" },
  { invoice: "INV005", type: 'Project', status: "Pending", total: 550.00, client: "KHIDMAAI Platform Development" },
  { invoice: "INV006", type: 'Expense', status: "Paid", total: 200.00, client: "Cloud Hosting - AWS" },
  { invoice: "INV007", type: 'Service', status: "Unpaid", total: 300.00, client: "Aegis Security Audit" },
  { invoice: "INV008", type: 'Subscription', status: "Paid", total: 99.00, client: "GENIUS Career Platform - Yearly Plan" },
  { invoice: "INV009", type: 'Project', status: "Paid", total: 1200.00, client: "AI Property Valuator - Proof of Concept" },
  { invoice: "INV010", type: 'Expense', status: "Paid", total: 75.00, client: "Software Licenses - Figma" },
  { invoice: "INV011", type: 'Service', status: "Paid", total: 50.00, client: "AI-Powered FAQ Setup" },
  { invoice: "INV012", type: 'Project', status: "Pending", total: 3000.00, client: "SmartLease Manager - Phase 1" },
  { invoice: "INV013", type: 'Expense', status: "Paid", total: 150.00, client: "Freelancer Payment - Design Work" },
  { invoice: "INV014", type: 'Subscription', status: "Paid", total: 49.00, client: "Nova Commerce - Basic Plan" },
  { invoice: "INV015", type: 'Service', status: "Paid", total: 250.00, client: "CCTV Installation - Residential" },
  { invoice: "INV016", type: 'Expense', status: "Paid", total: 500.00, client: "Legal Consultation Fees" },
  { invoice: "INV017", type: 'Project', status: "Unpaid", total: 800.00, client: "RAAHA Platform - White-Label Setup" },
  { invoice: "INV018", type: 'Subscription', status: "Paid", total: 25.00, client: "InfraRent - Server Rental" },
  { invoice: "INV019", type: 'Service', status: "Paid", total: 180.00, client: "Tender Response Assistance" },
  { invoice: "INV020", type: 'Expense', status: "Paid", total: 300.00, client: "Office Supplies" },
  { invoice: "INV021", type: 'Project', status: "Paid", total: 450.00, client: "ConstructFin - UI Mockups" },
  { invoice: "INV022", type: 'Subscription', status: "Unpaid", total: 150.00, client: "Sanad Hub - Yearly Renewal" },
  { invoice: "INV023", type: 'Service', status: "Paid", total: 75.00, client: "Document Translation - Marketing Copy" },
  { invoice: "INV024", type: 'Expense', status: "Paid", total: 120.00, client: "Transportation & Fuel" },
  { invoice: "INV025", type: 'Project', status: "Pending", total: 1500.00, client: "BidWise Estimator - Database Setup" },
  { invoice: "INV026", type: 'Subscription', status: "Paid", total: 299.00, client: "AI Legal Agent - Premium Access" },
  { invoice: "INV027", type: 'Service', status: "Paid", total: 90.00, client: "CV Enhancement & Cover Letter" },
];

const upcomingPayments = [
    { source: "Partner Commission Payout", amount: 1200.00, dueDate: "2024-08-25" },
    { source: "Cloud Services (AWS)", amount: 450.50, dueDate: "2024-08-28" },
    { source: "Office Rent", amount: 800.00, dueDate: "2024-09-01" },
    { source: "Software Licenses", amount: 250.00, dueDate: "2024-09-05" },
    { source: "Salaries - August", amount: 7500.00, dueDate: "2024-08-28" },
    { source: "Marketing Agency Retainer", amount: 1500.00, dueDate: "2024-09-01" },
    { source: "Internet & Telecom Bills", amount: 120.00, dueDate: "2024-09-10" },
    { source: "Insurance Renewal", amount: 600.00, dueDate: "2024-09-15" },
    { source: "Hardware Lease Payment", amount: 750.00, dueDate: "2024-09-18" },
    { source: "Freelancer Payments - August", amount: 1800.00, dueDate: "2024-09-05" },
    { source: "Domain Name Renewals", amount: 50.00, dueDate: "2024-09-20" },
];

const vatPayment = { source: "VAT Filing & Payment", amount: 2153.52, dueDate: "2024-09-30" };


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

function DueDateDisplay({ dueDate }: { dueDate: string }) {
  const [daysRemaining, setDaysRemaining] = useState<number|null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays);
  }, [dueDate]);

  if (!isClient) return null;

  return (
    <div className="text-sm text-muted-foreground">
      Due: {dueDate} 
      {daysRemaining !== null && (
        daysRemaining >= 0 ? 
          <span className={daysRemaining < 7 ? "text-destructive" : ""}> ({daysRemaining} days left)</span> 
          : ' (Overdue)'
      )}
    </div>
  )
}

function VatDueDateDisplay({ dueDate }: { dueDate: string }) {
  const [daysRemaining, setDaysRemaining] = useState<number|null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays);
  }, [dueDate]);

  if (!isClient) return null;

  return (
     <div className="text-sm font-medium text-destructive mt-2">
      {daysRemaining !== null && (
        daysRemaining >= 0 ? `(${daysRemaining} days remaining)` : '(Overdue)'
      )}
    </div>
  )
}


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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CFO Dashboard</h1>
        <div className="text-muted-foreground">
          Financial overview and analysis for your business operations.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.slice(0, 10).map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{transaction.client}</div>
                    </TableCell>
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
            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert />VAT Payment Due</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold text-destructive">OMR {vatPayment.amount.toFixed(2)}</p>
                    <div className="text-muted-foreground mt-1">
                        Due Date: {vatPayment.dueDate}
                    </div>
                    <VatDueDateDisplay dueDate={vatPayment.dueDate} />
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
                           {upcomingPayments.slice(0, 5).map((payment, index) => (
                               <TableRow key={index}>
                                   <TableCell>
                                       <div className="font-medium">{payment.source}</div>
                                       <DueDateDisplay dueDate={payment.dueDate} />
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
