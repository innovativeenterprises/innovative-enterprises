
'use server';

import AdminContentClientPage from './client-page';
import { getPricing, getProducts, getServices, getClients, getTestimonials, getStages, getPosProducts, getKnowledgeBase, getCostSettings } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content & Data Management",
    description: "Manage your public-facing services, products, clients, and internal data like pricing and AI knowledge."
};


export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials, pricing, posProducts, knowledgeBase, costSettings] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getPricing(),
        getPosProducts(),
        getKnowledgeBase(),
        getCostSettings(),
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
            initialKnowledgeBase={knowledgeBase}
            initialCostSettings={costSettings}
        />
    );
}
