
'use client';

import ClientTestimonialsClient from "@/components/client-testimonials-client";
import { useClientsData, useTestimonialsData } from "@/hooks/use-data-hooks";


export default function ClientTestimonials() {
    const { clients } = useClientsData();
    const { testimonials } = useTestimonialsData();
    
    return (
        <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
    );
}
