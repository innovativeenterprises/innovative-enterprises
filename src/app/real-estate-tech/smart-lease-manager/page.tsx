
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Calendar, Trash2, Home, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/global-store';
import type { SignedLease } from '@/lib/leases';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SmartLeaseManagerPage() {
    const [leases, setLeases] = useState<SignedLease[]>([]);
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const updateLeases = () => setLeases(store.get().signedLeases);
        updateLeases();
        const unsubscribe = store.subscribe(updateLeases);
        return () => unsubscribe();
    }, []);

    const handleDelete = (id: string) => {
        store.set(state => ({
            ...state,
            signedLeases: state.signedLeases.filter(lease => lease.id !== id)
        }));
        toast({ title: "Agreement Deleted", description: "The agreement has been removed from your dashboard.", variant: "destructive" });
    };
    
    if (!isClient) {
        return (
             <div className="bg-background min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <FileText className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">SmartLease Manager</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            A centralized dashboard to view, manage, and track all your digitally signed lease and sale agreements.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Your Agreements</CardTitle>
                            <Button asChild>
                                <Link href="/real-estate-tech/docu-chain"><PlusCircle className="mr-2 h-4 w-4"/> Generate New Contract</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Parties</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leases.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                                You have no signed agreements yet.
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
                                                    <Badge variant="outline">{lease.contractType}</Badge>
                                                 </TableCell>
                                                 <TableCell>
                                                    <p className="text-sm"><strong>Lessor:</strong> {lease.lessorName}</p>
                                                    <p className="text-sm"><strong>Lessee:</strong> {lease.lesseeName}</p>
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
