
'use client';

import { useState, useMemo, useEffect } from "react";
import { AddEditTransactionDialog, type TransactionValues } from './transaction-form';
import { type Community } from '@/lib/communities';
import { type CommunityEvent } from '@/lib/community-events';
import { type CommunityFinance } from '@/lib/community-finances';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Calendar, PlusCircle, TrendingUp, TrendingDown, HandCoins } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useCommunitiesData, useCommunityEventsData, useCommunityFinancesData } from "@/hooks/use-data-hooks";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Events & Financials",
  description: "Manage your community's events and track its financial health.",
};

export default function EventsFinancePage() {
    const { data: communities, isClient: isCommunitiesClient } = useCommunitiesData();
    const { data: events, setData: setEvents, isClient: isEventsClient } = useCommunityEventsData();
    const { data: finances, setData: setFinances, isClient: isFinancesClient } = useCommunityFinancesData();
    const isClient = isCommunitiesClient && isEventsClient && isFinancesClient;
    
    const [selectedCommunityId, setSelectedCommunityId] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (communities.length > 0 && !selectedCommunityId) {
            setSelectedCommunityId(communities[0].id);
        }
    }, [communities, selectedCommunityId]);

    const selectedCommunity = useMemo(() => communities.find(c => c.id === selectedCommunityId), [communities, selectedCommunityId]);
    const filteredEvents = useMemo(() => events.filter(e => e.communityId === selectedCommunityId), [events, selectedCommunityId]);
    const filteredFinances = useMemo(() => finances.filter(f => f.communityId === selectedCommunityId), [finances, selectedCommunityId]);

    const { totalIncome, totalExpense, netBalance } = useMemo(() => {
        if (!isClient) return { totalIncome: 0, totalExpense: 0, netBalance: 0 };
        const income = filteredFinances.reduce((sum, item) => sum + (item.type === 'Income' ? item.amount : 0), 0);
        const expense = filteredFinances.reduce((sum, item) => sum + (item.type === 'Expense' ? item.amount : 0), 0);
        return { totalIncome: income, totalExpense: expense, netBalance: income - expense };
    }, [filteredFinances, isClient]);

     const handleSaveTransaction = (values: TransactionValues, id?: string) => {
        if (id) {
            setFinances(prev => prev.map(f => f.id === id ? { ...f, ...values } as CommunityFinance : f));
            toast({ title: 'Transaction updated.' });
        } else {
            const newTransaction: CommunityFinance = { ...values, id: `fin_${Date.now()}`, communityId: selectedCommunityId, date: new Date().toISOString() };
            setFinances(prev => [newTransaction, ...prev]);
            toast({ title: 'Transaction added.' });
        }
    };
    
    if (!isClient) {
        return <div className="container mx-auto px-4 py-16"><Skeleton className="h-screen w-full" /></div>;
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/community-hub">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Community Hub
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <HandCoins className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Events & Financials</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Manage your community's events and track its financial health.
                            </p>
                        </div>
                    </div>

                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-4">
                            <label htmlFor="community-select" className="font-medium text-sm">Viewing Dashboard For:</label>
                             <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                                <SelectTrigger className="w-[280px]" id="community-select"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {communities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Total Income <TrendingUp className="h-4 w-4 text-green-500"/></CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-600">OMR {totalIncome.toLocaleString()}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Total Expenses <TrendingDown className="h-4 w-4 text-red-500"/></CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-500">OMR {totalExpense.toLocaleString()}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center justify-between">Net Balance <DollarSign className="h-4 w-4"/></CardTitle></CardHeader><CardContent className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>OMR {netBalance.toLocaleString()}</CardContent></Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Upcoming Events</CardTitle>
                                <Button variant="outline" disabled><PlusCircle className="mr-2 h-4 w-4"/> Add Event</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {filteredEvents.map(event => (
                                    <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4" /> {format(new Date(event.date), 'PPP')} at {event.location}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Financial Transactions</CardTitle>
                                <AddEditTransactionDialog onSave={handleSaveTransaction}><Button><PlusCircle className="mr-2 h-4 w-4"/> Add Transaction</Button></AddEditTransactionDialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Amount (OMR)</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {filteredFinances.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <p className="font-medium">{item.description}</p>
                                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                                </TableCell>
                                                <TableCell className={`text-right font-mono ${item.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {item.type === 'Income' ? '+' : '-'} {item.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
