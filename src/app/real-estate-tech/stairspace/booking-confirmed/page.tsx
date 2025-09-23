
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessContent } from '../success-content';
import type { BookingRequest } from '@/lib/stairspace-requests';


function PublicSuccessPage() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get('requestId');
    
    return (
        <SuccessContent 
            requestId={requestId}
            backToBrowseHref="/real-estate-tech/stairspace"
            backToRequestsHref="/real-estate-tech/stairspace/my-requests"
            requestsLabel="View My Bookings"
        />
    )
}

export default function StairspaceBookingConfirmedPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <PublicSuccessPage />
        </Suspense>
    );
}
