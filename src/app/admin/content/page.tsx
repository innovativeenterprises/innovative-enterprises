
'use server';

import AdminContentClientPage from './client-page';
import { getProducts, getServices, getClients, getTestimonials, getStages } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, and clients."
};


export default async function AdminContentPage() {
    // These fetches are still necessary to populate the initial global store on the server.
    await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
    ]);

    return (
        <AdminContentClientPage />
    );
}
