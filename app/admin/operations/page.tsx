'use server';

import AdminOperationsClientPage from "./client-page";
import { getPosProducts } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operations | Innovative Enterprises",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    const posProducts = await getPosProducts();

    return (
        <AdminOperationsClientPage
            initialPosProducts={posProducts}
        />
    );
}
