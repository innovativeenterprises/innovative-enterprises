

'use client';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Testimonials',
    description: 'See what our clients are saying about our innovative solutions and partnership.',
};

export default function ClientTestimonialsPage() {
    return <ClientTestimonialsClient />;
}
