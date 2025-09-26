
'use server';

import AdminContentClientPage from './client-page';
import { getProducts, getServices, getClients, getTestimonials, getStages, getPricing, getPosProducts } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, clients, and pricing."
};


export default async function AdminContentPage() {
    // Data is fetched here to ensure it's available for the initial state of the global store,
    // but we no longer need to pass it down as props.
    await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getPricing(),
        getPosProducts(),
    ]);

    return (
        <AdminContentClientPage />
    );
}
