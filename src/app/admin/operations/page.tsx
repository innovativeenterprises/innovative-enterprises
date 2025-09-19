
import AdminOperationsClientPage from "./client-page";
import type { Metadata } from 'next';
import { getKnowledgeBase, getPricing } from "@/lib/firestore";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools and configurations to enhance business operations.'
}

export default async function AdminOperationsPage() {
    const [knowledgeBase, pricing] = await Promise.all([
        getKnowledgeBase(),
        getPricing(),
    ]);

    return <AdminOperationsClientPage 
        initialKnowledgeBase={knowledgeBase}
        initialPricing={pricing}
    />;
}
