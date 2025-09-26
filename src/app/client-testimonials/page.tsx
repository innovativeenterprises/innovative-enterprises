
'use server';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Testimonials',
    description: 'See what our clients are saying about our innovative solutions and partnership.',
};

export default async function ClientTestimonialsPage() {
    // The client component now fetches its own data from the global store.
    return <ClientTestimonialsClient />;
}
