

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, UserCheck, CalendarIcon, MessageSquare, Clock, CreditCard, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import { RequestTable } from '@/components/request-table';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { HireRequest } from '@/lib/raaha-requests';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { ScheduleInterviewDialog, type InterviewValues } from '@/components/schedule-interview-dialog';
import { useToast } from '@/hooks/use-toast';

type GenericRequest = HireRequest | BookingRequest;

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

const columns = [
    {
        Header: 'Listing',
        accessor: 'listingTitle',
        Cell: ({ row }: { row: { original: GenericRequest }}) => {
            const request = row.original as BookingRequest;
            return (
                <div>
                    <p className="font-medium">{request.listingTitle}</p>
                    <p className="text-sm text-muted-foreground">
                        Requested: {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                    </p>
                </div>
            );
        }
    },
    {
        Header: 'Client',
        accessor: 'clientName',
    },
    {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }: { row: { original: GenericRequest }}) => {
            const request = row.original as BookingRequest;
            return getStatusBadge(request.status);
        }
    },
];

export default function MyStairspaceRequestsPage() {
    const { stairspaceRequests, setStairspaceRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();
    
    // In a real app, you would filter requests by the logged-in user.
    // For this prototype, we'll assume we're viewing requests for one client.
    const myRequests = isClient ? stairspaceRequests.filter(r => r.clientName === 'Anwar Ahmed') : [];
    
    const onSchedule = (id: string, values: InterviewValues) => {
        setStairspaceRequests(prev => prev.map(r => 
            r.id === id ? { ...r, interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };
    
    const renderActions = (request: GenericRequest) => {
        const bookingRequest = request as BookingRequest;
        if (bookingRequest.status === 'Booked') {
            return (
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/real-estate-tech/stairspace/checkout/${request.id}`}>
                        <CreditCard className="mr-2 h-4 w-4"/> Complete Payment
                    </Link>
                </Button>
            );
        }
        if (bookingRequest.interviewDate) {
            return (
                <div className="text-xs text-muted-foreground text-right">
                    <div className="flex items-center gap-1.5 font-semibold justify-end">
                        <CalendarIcon className="h-3 w-3 text-primary" />
                        <span>Interview: {format(new Date(bookingRequest.interviewDate), "PPP")}</span>
                    </div>
                </div>
            );
        }
        return <p className="text-xs text-muted-foreground italic">Owner will contact you.</p>;
    };

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
                            <CardTitle>Your Active & Past Requests</CardTitle>
                            <CardDescription>The table below shows the real-time status of each request as updated by the space owner.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <RequestTable 
                                data={myRequests} 
                                columns={columns}
                                isClient={isClient}
                                renderActions={renderActions}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
