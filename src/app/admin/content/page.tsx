
'use server';

import AdminContentClientPage from './client-page';
import { getProducts, getServices, getClients, getTestimonials, getStages, getKnowledgeBase } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content & Data Management",
    description: "Manage your public-facing services, products, clients, and AI knowledge base."
};


export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials, knowledgeBase] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getKnowledgeBase(),
    ]);

    return (
        <AdminContentClientPage
            initialServices={services}
            initialProducts={products}
            initialStages={stages}
            initialClients={clients}
            initialTestimonials={testimonials}
            initialKnowledgeBase={knowledgeBase}
        />
    );
}
