
'use client';

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Community } from '@/lib/communities';
import { type CommunityEvent } from '@/lib/community-events';
import { type CommunityFinance } from '@/lib/community-finances';
import { AddEditTransactionDialog, type TransactionValues } from './transaction-form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventsData, useCommunityFinancesData } from '@/hooks/use-global-store-data';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Income': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Income</Badge>;
        case 'Expense': return <Badge variant="destructive">Expense</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function EventsFinanceClient({ initialCommunities, initialEvents, initialFinances }: { initialCommunities: Community[], initialEvents: CommunityEvent[], initialFinances: CommunityFinance[] }) {
    const [selectedCommunityId, setSelectedCommunityId] = useState('');
    const { toast } = useToast();
    
    const { events, setEvents, isClient: isEventsClient } = useEventsData();
    const { finances, setFinances, isClient: isFinancesClient } = useCommunityFinancesData();
    const isClient = isEventsClient && isFinancesClient;

    useEffect(() => {
        if (initialCommunities.length > 0) {
            setSelectedCommunityId(initialCommunities[0].id);
        }
        setEvents(() => initialEvents);
        setFinances(() => initialFinances);
    }, [initialCommunities, initialEvents, initialFinances, setEvents, setFinances]);
    
    const filteredEvents = useMemo(() => {
        return events.filter(e => e.communityId === selectedCommunityId);
    }, [events, selectedCommunityId]);

    const filteredFinances = useMemo(() => {
        return finances.filter(f => f.communityId === selectedCommunityId);
    }, [finances, selectedCommunityId]);

    const handleSaveTransaction = (values: TransactionValues, id?: string) => {
        if (id) {
            // Update logic here
        } else {
            const newTransaction: CommunityFinance = {
                ...values,
                id: `fin_${Date.now()}`,
                communityId: selectedCommunityId,
                date: new Date().toISOString(),
            };
            setFinances(prev => [newTransaction, ...prev]);
        }
        toast({ title: "Transaction added successfully." });
    };

    const totalIncome = useMemo(() => filteredFinances.filter(f => f.type === 'Income').reduce((sum, f) => sum + f.amount, 0), [filteredFinances]);
    const totalExpenses = useMemo(() => filteredFinances.filter(f => f.type === 'Expense').reduce((sum, f) => sum + f.amount, 0), [filteredFinances]);
    const netBalance = totalIncome - totalExpenses;

     if (!isClient) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
             <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/community-hub">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Community Hub
                    </Link>
                </Button>
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <DollarSign className="w-10 h-10 text-primary" />
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
                        <SelectTrigger className="w-[280px]" id="community-select">
                            <SelectValue>{initialCommunities.find(c => c.id === selectedCommunityId)?.name}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {initialCommunities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </Card>
            
            <div className="grid md:grid-cols-3 gap-6">
                <Card><CardHeader><CardTitle>Total Income</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-green-600">OMR {totalIncome.toLocaleString()}</CardContent></Card>
                <Card><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-destructive">OMR {totalExpenses.toLocaleString()}</CardContent></Card>
                <Card className={netBalance >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}><CardHeader><CardTitle>Net Balance</CardTitle></CardHeader><CardContent className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>OMR {netBalance.toLocaleString()}</CardContent></Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Upcoming Events</CardTitle>
                        <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredEvents.map(event => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell><DateDisplay dateString={event.date} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Financial Transactions</CardTitle>
                        <AddEditTransactionDialog onSave={handleSaveTransaction}>
                            <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
                        </AddEditTransactionDialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredFinances.map(fin => (
                                    <TableRow key={fin.id}>
                                        <TableCell className="font-medium">{fin.description}</TableCell>
                                        <TableCell>{getStatusBadge(fin.type)}</TableCell>
                                        <TableCell className="text-right font-mono">OMR {fin.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const DateDisplay = ({ dateString }: { dateString: string }) => {
    const [formattedDate, setFormattedDate] = useState('');
    useEffect(() => {
        setFormattedDate(format(new Date(dateString), "PPP"));
    }, [dateString]);
    return <>{formattedDate}</>;
};
