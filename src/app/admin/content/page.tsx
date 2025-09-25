
'use server';

import AdminContentClientPage from './client-page';
import { getPricing, getProducts, getServices, getClients, getTestimonials, getStages, getPosProducts } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, clients, and pricing."
};


export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials, pricing, posProducts] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getPricing(),
        getPosProducts(),
    ]);

    return (
        <AdminContentClientPage
            initialServices={services}
            initialProducts={products}
            initialStages={stages}
            initialClients={clients}
            initialTestimonials={testimonials}
            initialPricing={pricing}
            initialPosProducts={posProducts}
        />
    );
}
