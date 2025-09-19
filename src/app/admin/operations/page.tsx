

import AdminOperationsClientPage from "./client-page";
import { getPricing } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools and configurations to enhance business operations.'
}

export default async function AdminOperationsPage() {
    const pricing = await getPricing();

    return <AdminOperationsClientPage 
        initialPricing={pricing}
    />;
}
