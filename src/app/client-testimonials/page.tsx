
'use server';

import ClientTestimonialsClient from "@/components/client-testimonials";
import { getClients, getTestimonials } from "@/lib/firestore";

export default async function ClientTestimonialsPage() {
    const [clients, testimonials] = await Promise.all([
        getClients(),
        getTestimonials()
    ]);
    
    return (
        <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
    );
}
