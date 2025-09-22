
'use server';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import { getClients, getTestimonials } from "@/lib/firestore";

export default async function ClientTestimonials() {
    const [clients, testimonials] = await Promise.all([
        getClients(),
        getTestimonials(),
    ]);

    return (
        <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
    );
}
