
'use server';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import type { Client, Testimonial } from '@/lib/clients.schema';

export default async function ClientTestimonials({ clients, testimonials }: { clients: Client[], testimonials: Testimonial[] }) {
    return (
        <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
    );
}
