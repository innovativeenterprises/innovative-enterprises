
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { store } from '@/lib/global-store';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Ticket, CalendarIcon, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';

function RequestRow({ request, isClient }: { request: BookingRequest, isClient: boolean }) {
    const [requestDateText, setRequestDateText] = useState("...");
    const [interviewDateText, setInterviewDateText] = useState("");

    useEffect(() => {
        if (isClient) {
             setRequestDateText(formatDistanceToNow(new Date(request.requestDate), { addSuffix: true }));
             if (request.interviewDate) {
                setInterviewDateText(format(new Date(request.interviewDate), "PPP 'at' p"));
            }
        }
    }, [request.requestDate, request.interviewDate, isClient]);

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
         <TableRow key={request.id}>
            <TableCell>
                <p className="font-medium">{request.listingTitle}</p>
                <p className="text-sm text-muted-foreground">
                    Requested: {requestDateText}
                </p>
            </TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>
                 {request.interviewDate && isClient ? (
                    <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                            <CalendarIcon className="h-3 w-3 text-primary" />
                            <span>Interview: {interviewDateText}</span>
                        </div>
                        {request.interviewNotes && (
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-3 w-3" />
                                <span className="truncate">{request.interviewNotes}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic">Owner will contact you soon.</p>
                )}
            </TableCell>
        </TableRow>
    )
}

export default function MyStairspaceRequestsPage() {
    const { stairspaceRequests, isClient } = useStairspaceRequestsData();
    
    // In a real app, you would filter requests by the logged-in user.
    // For this prototype, we'll assume we're viewing requests for one client.
    const myRequests = stairspaceRequests.filter(r => r.clientName === 'Anwar Ahmed');

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/real-estate-tech/stairspace">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to StairSpace
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Ticket className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">My Booking Requests</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Track the status of your StairSpace booking requests.
                            </p>
                        </div>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Submitted Requests</CardTitle>
                            <CardDescription>The table below shows the real-time status of each request as updated by the space owner.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Listing</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Next Steps</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!isClient ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center"><Skeleton className="h-10 w-full" /></TableCell>
                                        </TableRow>
                                    ) : myRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                                You haven't made any booking requests yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        myRequests.map(req => (
                                           <RequestRow key={req.id} request={req} isClient={isClient} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
