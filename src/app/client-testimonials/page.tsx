
'use server';

import ClientTestimonials from "@/components/client-testimonials";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Testimonials',
    description: 'See what our clients are saying about our innovative solutions and partnership.',
};

export default async function ClientTestimonialsPage() {
    return (
        // The ClientTestimonials component now fetches its own data
        <ClientTestimonials />
    );
}
