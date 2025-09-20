'use client';

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, DollarSign, FileText, Calendar, Trash2, Home, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { SignedLease } from '@/lib/leases';
import { DueDateDisplay } from '@/components/due-date-display';
import { useLeasesData } from '@/hooks/use-global-store-data';

export default function StudentHousingClientPage({ initialLeases }: { initialLeases: SignedLease[] }) {
    const { leases, setLeases, isClient } = useLeasesData();
    const { toast } = useToast();
    
    useEffect(() => {
        setLeases(() => initialLeases);
    }, [initialLeases, setLeases]);

    const expiringLeasesCount = useMemo(() => {
        if (!isClient) return null;
        const now = new Date();
        return leases.filter(l => {
            if (!l.endDate) return false;
            const endDate = new Date(l.endDate);
            // Check if expiry is in the future but within the next month.
            return endDate > now && endDate.getFullYear() === now.getFullYear() && endDate.getMonth() <= now.getMonth() + 1;
        }).length;
    }, [leases, isClient]);


    const handleDelete = (id: string) => {
        setLeases(prev => prev.filter(lease => lease.id !== id));
        toast({ title: "Housing Agreement Deleted", description: "The student housing agreement has been removed from your dashboard.", variant: "destructive" });
    };

    const totalMonthlyRent = useMemo(() => isClient ? leases.reduce((sum, lease) => {
        if (lease.status === 'Active' && lease.contractType === 'Tenancy Agreement' && lease.pricePeriod === 'per month') {
            return sum + lease.price;
        }
        return sum;
    }, 0) : 0, [leases, isClient]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech/eduflow">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to EduFlow Suite
                            </Link>
                        </Button>
                        <div className="text-center mb-12">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Home className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Student Housing Management</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A centralized dashboard to view, manage, and track all student housing and accommodation agreements.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                         <Card>
                             <CardHeader><CardTitle>Active Leases</CardTitle></CardHeader>
                             <CardContent className="text-3xl font-bold text-primary">{isClient ? leases.filter(l => l.status === 'Active').length : <Skeleton className="h-8 w-1/2" />}</CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Total Monthly Rent</CardTitle></CardHeader>
                            <CardContent className="text-3xl font-bold text-primary">{isClient ? `OMR ${totalMonthlyRent.toLocaleString()}`: <Skeleton className="h-8 w-3/4" />}</CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Agreements Expiring Soon</CardTitle></CardHeader>
                            <CardContent className="text-3xl font-bold text-primary">{expiringLeasesCount === null ? <Skeleton className="h-8 w-1/2" /> : expiringLeasesCount}</CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Housing Agreements</CardTitle>
                            <Button asChild>
                                <Link href="/real-estate-tech/docu-chain"><PlusCircle className="mr-2 h-4 w-4"/> Generate New Agreement</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property/Room</TableHead>
                                        <TableHead>Student Name (Lessee)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">
                                                <Skeleton className="h-10 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ) : leases.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                                You have no student housing agreements yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leases.map(lease => (
                                            <TableRow key={lease.id}>
                                                <TableCell>
                                                    <p className="font-medium">{lease.propertyAddress}</p>
                                                    <p className="text-sm text-muted-foreground">{lease.propertyType}</p>
                                                </TableCell>
                                                 <TableCell>
                                                    <p className="font-medium">{lease.lesseeName}</p>
                                                    <DueDateDisplay date={lease.endDate} prefix="Ends:" />
                                                 </TableCell>
                                                 <TableCell>
                                                     <Badge className="bg-green-500/20 text-green-700">{lease.status}</Badge>
                                                 </TableCell>
                                                 <TableCell className="text-right">
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the agreement for {lease.propertyAddress}. This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(lease.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                 </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
