'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck, CalendarIcon, MessageSquare, Clock, CreditCard, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { RequestTable, TimeAgoCell } from '@/components/request-table';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import { useRouter } from 'next/navigation';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Booking Requests | StairSpace",
    description: "Track the status of your StairSpace booking requests.",
};

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

export default function MyStairspaceRequestsPage() {
    const { stairspaceRequests, setStairspaceRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();
    const router = useRouter();
    
    // In a real app, you would filter requests by the logged-in user.
    // For this prototype, we'll assume we're viewing requests for one client.
    const myRequests = isClient ? stairspaceRequests.filter(r => r.clientName === 'Anwar Ahmed') : [];
    
    const onSchedule = (id: string, values: InterviewValues) => {
        setStairspaceRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Contacted', interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Interview Scheduled!", description: `The interview has been scheduled.` });
    };
    
    const columns = [
        {
            Header: 'Listing',
            accessor: 'listingTitle',
            Cell: ({ row }: { row: { original: BookingRequest }}) => (
                <div>
                    <p className="font-medium">{row.original.listingTitle}</p>
                    <p className="text-sm text-muted-foreground">
                        <TimeAgoCell date={row.original.requestDate} isClient={isClient} />
                    </p>
                </div>
            )
        },
        {
            Header: 'Client',
            accessor: 'clientName',
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }: { row: { original: BookingRequest }}) => getStatusBadge(row.original.status)
        },
    ];

     const renderActions = (request: BookingRequest) => {
        if (request.status === 'Booked') {
            return (
                <Button onClick={() => handlePayment(request.id)} size="sm" className="w-full sm:w-auto">
                    <CreditCard className="mr-2 h-4 w-4"/> Complete Payment
                </Button>
            );
        }
        return <p className="text-xs text-muted-foreground italic text-right">Owner will contact you.</p>;
    };

    const handlePayment = (requestId: string) => {
        toast({ title: 'Redirecting to payment...', description: 'Please wait.' });
        setStairspaceRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Confirmed' } : r));
        setTimeout(() => {
            router.push(`/real-estate-tech/stairspace/booking-confirmed?requestId=${requestId}`);
        }, 1000);
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
                                renderActions={(request) => renderActions(request as BookingRequest)}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}