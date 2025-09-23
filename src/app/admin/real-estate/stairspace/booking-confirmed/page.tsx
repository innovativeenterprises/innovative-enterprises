
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessContent } from '@/app/real-estate-tech/stairspace/success-content';
import type { BookingRequest } from '@/lib/stairspace-requests';

function PublicSuccessPage() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get('requestId');
    
    return (
        <SuccessContent 
            requestId={requestId}
            backToBrowseHref="/real-estate-tech/stairspace"
            backToRequestsHref="/admin/real-estate/stairspace"
            requestsLabel="View All Bookings"
        />
    )
}

export default function AdminStairspaceBookingConfirmedPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <PublicSuccessPage />
        </Suspense>
    );
}
