
'use server';

import ClientTestimonials from "@/components/client-testimonials";
import Header from "@/components/layout/header";
import { getClients, getTestimonials } from "@/lib/firestore";

export default async function ClientTestimonialsPage() {
    const [clients, testimonials] = await Promise.all([
        getClients(),
        getTestimonials(),
    ]);

    return (
        <>
            <Header />
            <ClientTestimonials clients={clients} testimonials={testimonials} />
        </>
    );
}
