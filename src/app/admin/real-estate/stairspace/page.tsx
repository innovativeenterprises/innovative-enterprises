
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { store } from '@/lib/global-store';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function StairspaceRequestsPage() {
    const [requests, setRequests] = useState<BookingRequest[]>(store.get().stairspaceRequests);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setRequests(store.get().stairspaceRequests);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = (requestId: string, newStatus: BookingRequest['status']) => {
        store.set(state => ({
            ...state,
            stairspaceRequests: state.stairspaceRequests.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        }));
        toast({ title: "Status Updated", description: "The request status has been changed." });
    };

    const getStatusBadge = (status: BookingRequest['status']) => {
        switch (status) {
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
            case 'Contacted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Contacted</Badge>;
            case 'Booked': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Booked</Badge>;
            case 'Closed': return <Badge variant="destructive">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/admin/real-estate">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Real Estate
                    </Link>
                </Button>
                <CardHeader className="text-center px-0">
                    <CardTitle className="text-3xl font-bold">StairSpace Booking Requests</CardTitle>
                    <CardDescription>View and manage all incoming booking requests for micro-retail spaces.</CardDescription>
                </CardHeader>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Listing</TableHead>
                                <TableHead>Client Details</TableHead>
                                <TableHead>Requested On</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No booking requests yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map(request => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <p className="font-medium">{request.listingTitle}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{request.message}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{request.clientName}</p>
                                            <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-1">
                                                <a href={`mailto:${request.clientEmail}`} className="flex items-center gap-1.5 hover:text-primary"><Mail className="h-3 w-3"/> {request.clientEmail}</a>
                                                <a href={`tel:${request.clientPhone}`} className="flex items-center gap-1.5 hover:text-primary"><Phone className="h-3 w-3"/> {request.clientPhone}</a>
                                            </div>
                                        </TableCell>
                                        <TableCell>{isClient ? formatDistanceToNow(new Date(request.requestDate), { addSuffix: true }) : '...'}</TableCell>
                                        <TableCell>
                                            <Select value={request.status} onValueChange={(value: BookingRequest['status']) => handleStatusChange(request.id, value)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue>{getStatusBadge(request.status)}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                                    <SelectItem value="Booked">Booked</SelectItem>
                                                    <SelectItem value="Closed">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
