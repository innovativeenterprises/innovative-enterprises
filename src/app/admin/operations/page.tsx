
import AdminOperationsClientPage from "./client-page";
import { getKnowledgeBase, getCostSettings, getPricing, getPosProducts } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools and configurations to enhance business operations.'
}

export default async function AdminOperationsPage() {
    const [costSettings, knowledgeBase, pricing, posProducts] = await Promise.all([
        getCostSettings(),
        getKnowledgeBase(),
        getPricing(),
        getPosProducts(),
    ]);

    return <AdminOperationsClientPage 
        initialCostSettings={costSettings} 
        initialKnowledgeBase={knowledgeBase}
        initialPricing={pricing}
        initialPosProducts={posProducts}
    />;
}
