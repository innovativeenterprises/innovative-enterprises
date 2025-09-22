
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, Home, Ticket } from 'lucide-react';
import Link from 'next/link';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';

export function SuccessContent({ requestId, backToBrowseHref, backToRequestsHref, requestsLabel }: {
    requestId: string | null;
    backToBrowseHref: string;
    backToRequestsHref: string;
    requestsLabel: string;
}) {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [request, setRequest] = useState<BookingRequest | undefined>(undefined);

     useEffect(() => {
        setIsClient(true);
        // In a real app, this might come from a context or a fresh fetch.
        // For prototype, we assume it's available or can be fetched if needed.
    }, []);

    useEffect(() => {
        if (isClient && requestId) {
            // This is a placeholder for fetching data if it wasn't in a global store.
            // For now, we assume the requests state is populated from a parent or context.
            // If requests are not in a global store, you'd need a fetch here.
        } else if (isClient && !requestId) {
            notFound();
        }
    }, [isClient, requestId, requests]);
    
    if (!isClient || (requestId && !request)) {
        return (
             <div className="bg-muted/20 min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-lg mx-auto">
                        <Card><CardContent className="p-10"><Skeleton className="h-48 w-full" /></CardContent></Card>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
         <div className="bg-muted/20 min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-lg mx-auto">
                    <Card className="text-center">
                        <CardHeader className="items-center">
                            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
                            <CardDescription className="text-base pt-2">
                                Thank you for your payment. The booking for <strong>{request?.listingTitle}</strong> is confirmed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                The space owner has been notified and will provide the client with access details shortly. You can view all bookings from your dashboard.
                            </p>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button asChild size="lg" className="w-full">
                                <Link href={backToBrowseHref}>
                                    <Home className="mr-2 h-5 w-5" /> Browse More Spaces
                                </Link>
                            </Button>
                             <Button asChild size="lg" variant="outline" className="w-full">
                                <Link href={backToRequestsHref}>
                                    <Ticket className="mr-2 h-5 w-5" /> {requestsLabel}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
