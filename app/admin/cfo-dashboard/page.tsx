
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusBadge } from "@/components/status-badges";
import { DueDateDisplay } from "@/components/due-date-display";
import * as Icons from 'lucide-react';
import { useCfoData } from '@/hooks/use-data-hooks';
import { Skeleton } from '@/components/ui/skeleton';

const kpiIcons: { [key: string]: React.ElementType } = {
    "DollarSign": Icons.DollarSign,
    "Users": Icons.Users,
    "CreditCard": Icons.CreditCard,
    "Activity": Icons.Activity,
};


export default function CfoDashboardPage() {
    const { data: cfoData, isClient } = useCfoData();

    if (!isClient || !cfoData) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-12 w-1/2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
                </div>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="lg:col-span-2 h-80" />
                    <Skeleton className="h-80" />
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }
    
    const { kpiData, transactionData, upcomingPayments, cashFlowData } = cfoData;
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">CFO Dashboard</h1>
                <p className="text-muted-foreground">
                    A real-time overview of the company's financial health.
                </p>
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map(item => {
                    const Icon = kpiIcons[item.icon] || Icons.DollarSign;
                    return (
                        <Card key={item.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-muted-foreground">{item.change}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Cash Flow</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={cashFlowData}>
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `OMR ${value/1000}k`}/>
                                <Tooltip />
                                <Bar dataKey="income" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Income" />
                                <Bar dataKey="expenses" fill="#8884d8" radius={[4, 4, 0, 0]} name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
                  <Card>
                    <CardHeader><CardTitle>Upcoming Payments</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingPayments.map((payment, index) => (
                             <div key={index} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{payment.source}</p>
                                    <DueDateDisplay date={new Date(payment.dueDate).toISOString()} />
                                </div>
                                <p className="font-bold text-lg">OMR {payment.amount.toFixed(2)}</p>
                            </div>
                        ))}
                    </CardContent>
                 </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {transactionData.map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell><p className="font-medium">{transaction.client}</p></TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                    <TableCell className="text-right font-bold">OMR {transaction.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
