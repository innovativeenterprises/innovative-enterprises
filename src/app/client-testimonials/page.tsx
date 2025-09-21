
'use client';

import ClientTestimonialsClient from "@/components/client-testimonials";
import { useClientsData, useTestimonialsData } from "@/hooks/use-global-store-data";


export default function ClientTestimonialsPage() {
    const { clients } = useClientsData();
    const { testimonials } = useTestimonialsData();
    
    return (
        <>
            <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
        </>
    );
}
