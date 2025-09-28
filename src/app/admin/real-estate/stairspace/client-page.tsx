
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Ticket, Wand2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { RequestTable } from '@/components/request-table';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { useStairspaceRequestsData } from '@/hooks/use-data-hooks.tsx';
import { generateBookingResponse } from '@/ai/flows/booking-response-generator';
import { Textarea } from '@/components/ui/textarea';
import { getStatusBadge } from '@/components/status-badges';

const ResponseGenerator = ({ request }: { request: BookingRequest }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateBookingResponse({
                listingTitle: request.listingTitle,
                clientName: request.clientName,
                clientMessage: request.message,
            });
            setResponse(result.response);
        } catch (e) {
            toast({ title: 'Error generating response', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSend = () => {
        toast({ title: 'Response Sent!', description: 'The client has been notified.' });
    };

    return (
        <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-sm mb-2">Respond to Client:</h4>
            <div className="space-y-2">
                <Textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Draft your response here or let the AI generate one." rows={4} />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate with AI
                    </Button>
                    <Button size="sm" onClick={handleSend} disabled={!response}>Send Response</Button>
                </div>
            </div>
        </div>
    );
};

export default function StairspaceRequestsClientPage() {
    const { data: requests, setData: setRequests, isClient } = useStairspaceRequestsData();
    const { toast } = useToast();
    const router = useRouter();

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
    
    const renderExpandedContent = (request: BookingRequest) => (
        <div className="p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Client Message:</h4>
            <p className="text-sm text-muted-foreground italic">"{request.message || 'No message provided.'}"</p>
            <ResponseGenerator request={request} />
        </div>
    );

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/admin/real-estate" legacyBehavior>
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
                                renderExpandedContent={(request) => renderExpandedContent(request as BookingRequest)}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
