
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, Home, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useStairspaceRequestsData } from '@/hooks/use-global-store-data';
import type { BookingRequest } from '@/lib/stairspace-requests';
import { Skeleton } from '@/components/ui/skeleton';

function SuccessContent() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get('requestId');
    const { stairspaceRequests, isClient } = useStairspaceRequestsData();
    const [request, setRequest] = useState<BookingRequest | undefined>(undefined);

    useEffect(() => {
        if (isClient && requestId) {
            const foundRequest = stairspaceRequests.find(r => r.id === requestId);
            if (!foundRequest) {
                // If no request is found for the given ID, redirect or show an error
                notFound();
            } else {
                setRequest(foundRequest);
            }
        }
    }, [isClient, requestId, stairspaceRequests]);
    
    if (!isClient || !request) {
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
                                Thank you for your payment. Your booking for <strong>{request.listingTitle}</strong> is confirmed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                The space owner has been notified and will provide you with access details shortly. You can view all your bookings from your "My Requests" page.
                            </p>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button asChild size="lg" className="w-full">
                                <Link href="/real-estate-tech/stairspace">
                                    <Home className="mr-2 h-5 w-5" /> Browse More Spaces
                                </Link>
                            </Button>
                             <Button asChild size="lg" variant="outline" className="w-full">
                                <Link href="/real-estate-tech/stairspace/my-requests">
                                    <Ticket className="mr-2 h-5 w-5" /> View My Bookings
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}


export default function StairspaceBookingConfirmedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
