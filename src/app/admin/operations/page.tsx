
import { getCostSettings, getKnowledgeBase, getPricing } from '@/lib/firestore';
import AdminOperationsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Operations | Admin Dashboard",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    const initialCostSettings = await getCostSettings();
    const initialKnowledgeBase = await getKnowledgeBase();
    const initialPricing = await getPricing();

    return (
        <AdminOperationsClientPage 
            initialCostSettings={initialCostSettings} 
            initialKnowledgeBase={initialKnowledgeBase}
            initialPricing={initialPricing}
        />
    );
}
