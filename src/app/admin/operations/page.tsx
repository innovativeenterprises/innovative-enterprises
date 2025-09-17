
import AdminOperationsClientPage from "./client-page";
import { initialCostSettings } from "@/lib/cost-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Operations | Admin Dashboard',
    description: 'A suite of internal AI tools to enhance business operations.'
}

export default function AdminOperationsPage() {
    // Data is fetched on the server and passed to the client component.
    const costSettings = initialCostSettings;
    return <AdminOperationsClientPage initialCostSettings={costSettings} />;
}
