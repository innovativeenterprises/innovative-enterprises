
'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { SuccessContent } from '@/app/real-estate-tech/stairspace/success-content';

function AdminSuccessPage() {
    const params = useParams();
    const requestId = params.id as string;
    
    return (
        <SuccessContent 
            requestId={requestId}
            backToBrowseHref="/real-estate-tech/stairspace"
            backToRequestsHref="/admin/real-estate/stairspace"
            requestsLabel="View All Bookings"
        />
    )
}

export default function AdminStairspaceCheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <AdminSuccessPage />
        </Suspense>
    );
}
