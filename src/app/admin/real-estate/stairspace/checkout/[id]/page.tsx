
'use server';

import { Suspense } from 'react';
import { getStairspaceRequests } from '@/lib/firestore';
import { SuccessContent } from '@/app/real-estate/stairspace/success-content';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const requests = await getStairspaceRequests();
  return requests.map((req) => ({
    id: req.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const requests = await getStairspaceRequests();
  const request = requests.find(r => r.id === params.id);
  const title = request ? `Booking Confirmed: ${request.listingTitle}` : "Booking Confirmed";
  return {
    title,
    description: "Your StairSpace booking payment was successful.",
  };
}


function AdminSuccessPage({ requestId }: { requestId: string | null}) {
    return (
        <SuccessContent 
            requestId={requestId}
            backToBrowseHref="/real-estate-tech/stairspace"
            backToRequestsHref="/admin/real-estate/stairspace"
            requestsLabel="View All Bookings"
        />
    )
}

export default async function AdminStairspaceCheckoutSuccessPage({ params }: { params: { id: string } }) {
    const requestId = params.id as string;
    
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <AdminSuccessPage requestId={requestId} />
        </Suspense>
    );
}
