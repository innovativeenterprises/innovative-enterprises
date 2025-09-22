
'use server';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import { getClients, getTestimonials } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Testimonials',
    description: 'See what our clients are saying about our innovative solutions and partnership.',
};

export default async function ClientTestimonialsPage() {
    const [clients, testimonials] = await Promise.all([
        getClients(),
        getTestimonials(),
    ]);

    return (
        <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
    );
}
