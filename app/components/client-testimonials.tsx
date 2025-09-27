
'use client';

import ClientTestimonialsClient from "@/components/client-testimonials-client";

export default function ClientTestimonials() {
    // This component now just directly renders the client component.
    // The client component fetches data from the global store.
    return (
        <ClientTestimonialsClient />
    );
}
