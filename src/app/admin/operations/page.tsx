
'use server';

import AdminOperationsClientPage from "./client-page";
import { getCostSettings } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operations & Settings | Innovative Enterprises",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    const costSettings = await getCostSettings();

    return (
        <AdminOperationsClientPage
            initialCostSettings={costSettings}
        />
    );
}
