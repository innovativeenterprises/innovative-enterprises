
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowLeft, PlusCircle, Bell, DollarSign } from "lucide-react";
import Link from 'next/link';
import { useLeasesData } from '@/hooks/use-data-hooks';
import { Skeleton } from '@/components/ui/skeleton';
import type { SignedLease } from '@/lib/leases';
import { DueDateDisplay } from "@/components/due-date-display";
import { useToast } from "@/hooks/use-toast";

export default function SmartLeaseManagerPage() {
    const { data: leases, setData: setLeases, isClient } = useLeasesData();
    const { toast } = useToast();

    const getPaymentStatusBadge = (status: SignedLease['paymentStatus']) => {
        switch (status) {
            case 'Paid': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>;
            case 'Upcoming': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Upcoming</Badge>;
            case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
            default: return <Badge variant="outline">Unknown</Badge>;
        }
    };
    
    const handleMarkAsPaid = (leaseId: string) => {
        setLeases(prev => prev.map(lease => {
            if (lease.id === leaseId) {
                const now = new Date();
                const nextDueDate = new Date(now.setMonth(now.getMonth() + 1));
                return {
                    ...lease,
                    paymentStatus: 'Paid',
                    lastPaymentDate: new Date().toISOString(),
                    nextDueDate: nextDueDate.toISOString(),
                };
            }
            return lease;
        }));
        toast({ title: 'Payment Marked as Paid', description: 'The lease record has been updated.' });
    };

    const handleSendReminder = (lease: SignedLease) => {
        toast({
            title: `Reminder Sent to ${lease.lesseeName}`,
            description: `An email and SMS reminder for the outstanding payment of OMR ${lease.price.toFixed(2)} has been sent.`,
        });
    };
    
    const { totalRent, activeLeases, overduePayments } = useMemo(() => {
        if (!isClient) return { totalRent: 0, activeLeases: 0, overduePayments: 0 };
        return leases.reduce((acc, lease) => {
            if (lease.status === 'Active') {
                acc.activeLeases++;
                if (lease.pricePeriod === 'per month') {
                    acc.totalRent += lease.price;
                } else if (lease.pricePeriod === 'per year') {
                    acc.totalRent += lease.price / 12;
                }
            }
            if (lease.paymentStatus === 'Overdue') {
                acc.overduePayments++;
            }
            return acc;
        }, { totalRent: 0, activeLeases: 0, overduePayments: 0 });
    }, [leases, isClient]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/real-estate-tech" legacyBehavior>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Real Estate Tech
                            </Link>
                        </Button>
                        <div className="text-center mb-12">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">SmartLease Manager</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A dashboard to track rent collection, manage lease statuses, and send automated reminders.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Monthly Rent</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{!isClient ? <Skeleton className="h-8 w-3/4" /> : `OMR ${totalRent.toLocaleString()}`}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Active Leases</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{!isClient ? <Skeleton className="h-8 w-1/2" /> : activeLeases}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Payments Overdue</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-destructive">{!isClient ? <Skeleton className="h-8 w-1/2" /> : overduePayments}</CardContent></Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Lease &amp; Payment Overview</CardTitle>
                             <Button asChild>
                                <Link href="/real-estate-tech/docu-chain" legacyBehavior><PlusCircle className="mr-2 h-4 w-4"/> Generate New Lease</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Rent (OMR)</TableHead>
                                        <TableHead>Next Due Date</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        Array.from({length: 3}).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-12 w-full"/></TableCell></TableRow>)
                                    ) : leases.map(lease => (
                                        <TableRow key={lease.id}>
                                            <TableCell>
                                                <p className="font-medium">{lease.propertyAddress}</p>
                                                <p className="text-sm text-muted-foreground">{lease.propertyType}</p>
                                            </TableCell>
                                            <TableCell>{lease.lesseeName}</TableCell>
                                            <TableCell className="font-mono">{lease.price.toFixed(2)}</TableCell>
                                            <TableCell><DueDateDisplay date={lease.nextDueDate} prefix=""/></TableCell>
                                            <TableCell>{getPaymentStatusBadge(lease.paymentStatus)}</TableCell>
                                            <TableCell className="text-right">
                                                {lease.paymentStatus === 'Overdue' ? (
                                                    <Button variant="destructive" size="sm" onClick={() => handleSendReminder(lease)}><Bell className="mr-2 h-4 w-4" /> Send Reminder</Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(lease.id)} disabled={lease.paymentStatus === 'Paid'}>Mark as Paid</Button>
                                                )}
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
    );
}
