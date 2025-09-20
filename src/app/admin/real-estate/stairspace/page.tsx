
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck, CalendarIcon, MessageSquare, Clock, CreditCard, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { RequestTable, TimeAgoCell } from '@/components/request-table';
import { ScheduleInterviewDialog, type InterviewValues, type GenericRequest } from '@/components/schedule-interview-dialog';
import type { BookingRequest } from '@/lib/stairspace-requests';

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

export default function StairspaceRequestsPage({ initialRequests }: { initialRequests: BookingRequest[] }) {
    const [requests, setRequests] = useState(initialRequests);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onSchedule = (id: string, values: InterviewValues) => {
        setRequests(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'Contacted', interviewDate: values.interviewDate.toISOString(), interviewNotes: values.interviewNotes } : r
        ));
        toast({ title: "Contact Scheduled!", description: `A meeting with ${values.interviewNotes} has been scheduled.` });
    };

    const handleConfirmBooking = (requestId: string) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Booked' } : r));
        toast({ title: 'Booking Confirmed!', description: 'The client has been notified to proceed with payment.' });
    };

    const handlePayment = (requestId: string) => {
        toast({ title: 'Redirecting to payment...', description: 'Please wait.' });
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Confirmed' } : r));
        setTimeout(() => {
            router.push(`/admin/real-estate/stairspace/checkout/${requestId}`);
        }, 1000);
    };

    const columns = [
        { Header: 'Listing', accessor: 'listingTitle' },
        { Header: 'Client', accessor: 'clientName' },
        { Header: 'Request Date', accessor: 'requestDate', Cell: ({ row }: { row: { original: BookingRequest }}) => <TimeAgoCell date={row.original.requestDate} isClient={isClient} /> },
        { Header: 'Status', accessor: 'status', Cell: ({ row }: { row: { original: BookingRequest }}) => getStatusBadge(row.original.status) },
    ];
    
    const renderActions = (request: BookingRequest) => {
        if (request.status === 'Pending') {
            return <Button onClick={() => handleConfirmBooking(request.id)} size="sm" className="w-full">Confirm Booking</Button>;
        }
         if (request.status === 'Booked') {
            return (
                <Button onClick={() => handlePayment(request.id)} size="sm" className="w-full sm:w-auto">
                    <CreditCard className="mr-2 h-4 w-4"/> Process Payment
                </Button>
            );
        }
        return <p className="text-xs text-muted-foreground italic text-right">No action required</p>;
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/admin/real-estate">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Real Estate
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Ticket className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">StairSpace Booking Requests</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                View and manage all incoming booking requests for micro-retail spaces.
                            </p>
                        </div>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Incoming Requests</CardTitle>
                            <CardDescription>Review new requests and confirm bookings to send payment links to clients.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <RequestTable 
                                data={requests} 
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
