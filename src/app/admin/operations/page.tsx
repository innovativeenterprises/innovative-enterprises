
import AdminOperationsClientPage from "@/app/admin/operations/client-page";
import { getKnowledgeBase, getCostSettings, getPricing } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools and configurations to enhance business operations.'
}

export default async function AdminOperationsPage() {
    const [costSettings, knowledgeBase, pricing] = await Promise.all([
        getCostSettings(),
        getKnowledgeBase(),
        getPricing(),
    ]);

    return <AdminOperationsClientPage 
        initialCostSettings={costSettings} 
        initialKnowledgeBase={knowledgeBase}
        initialPricing={pricing}
    />;
}
