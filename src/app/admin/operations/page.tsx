
'use server';

import AdminOperationsClientPage from "./client-page";
import { getKnowledgeBase, getCostSettings, getPricing } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operations | Innovative Enterprises",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    const [knowledgeBase, costSettings, pricing] = await Promise.all([
        getKnowledgeBase(),
        getCostSettings(),
        getPricing(),
    ]);

    return (
        <AdminOperationsClientPage
            initialKnowledgeBase={knowledgeBase}
            initialCostSettings={costSettings}
            initialPricing={pricing}
        />
    );
}
