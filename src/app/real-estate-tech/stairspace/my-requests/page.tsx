
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { store } from '@/lib/global-store';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, UserCheck, CalendarIcon, MessageSquare, Clock, CreditCard, Ticket } from 'lucide-react';
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
            case 'Booked': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Booked & Awaiting Payment</Badge>;
            case 'Closed': return <Badge variant="destructive">Closed</Badge>;
            case 'Confirmed': return <Badge variant="default" className="bg-green-700 text-white">Confirmed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
        <Card key={request.id}>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                    <CardTitle className="text-lg">{request.listingTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                        <Clock className="h-3 w-3"/> Requested {requestDateText}
                    </CardDescription>
                </div>
                {getStatusBadge(request.status)}
            </CardHeader>
            <CardContent>
                 {request.status === 'Booked' ? (
                     <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link href={`/real-estate-tech/stairspace/checkout/${request.id}`}>
                            <CreditCard className="mr-2 h-4 w-4"/> Complete Booking & Payment
                        </Link>
                     </Button>
                 ) : request.interviewDate && isClient ? (
                    <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center gap-2 font-semibold">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span>Interview Scheduled: {interviewDateText}</span>
                        </div>
                        {request.interviewNotes && (
                            <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 mt-0.5" />
                                <span className="italic">{request.interviewNotes}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">The space owner will contact you shortly regarding next steps.</p>
                )}
            </CardContent>
        </Card>
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
                    
                    <div className="space-y-4">
                        {!isClient ? (
                            <>
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </>
                        ) : myRequests.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    You haven't made any booking requests yet.
                                </CardContent>
                            </Card>
                        ) : (
                            myRequests.map(req => (
                                <RequestRow key={req.id} request={req} isClient={isClient} />
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
