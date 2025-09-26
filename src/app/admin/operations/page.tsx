'use server';

import AdminOperationsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operations | Innovative Enterprises",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    // Data fetching is no longer needed here as the POS products table has been moved to settings.
    return (
        <AdminOperationsClientPage />
    );
}
