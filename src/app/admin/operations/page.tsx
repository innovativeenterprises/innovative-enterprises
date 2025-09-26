
'use server';

import AdminOperationsClientPage from "./client-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operations | Innovative Enterprises",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    // This page may not need to fetch data anymore if all tables are moved.
    // Keeping the structure in case other data-dependent components are added later.
    return (
        <AdminOperationsClientPage />
    );
}
