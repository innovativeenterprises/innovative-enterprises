
import AdminOperationsClientPage from "./client-page";
import { getKnowledgeBase, getCostSettings } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools to enhance business operations.'
}

export default async function AdminOperationsPage() {
    const [costSettings, knowledgeBase] = await Promise.all([
        getCostSettings(),
        getKnowledgeBase(),
    ]);

    return <AdminOperationsClientPage 
        initialCostSettings={costSettings} 
        initialKnowledgeBase={knowledgeBase}
    />;
}
