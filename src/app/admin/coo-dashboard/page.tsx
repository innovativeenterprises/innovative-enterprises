
'use server';

import CooDashboardClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AI COO Dashboard",
    description: "JADE's real-time operational analysis of the entire business ecosystem."
};


export default async function CooDashboardPage() {
    return (
        <CooDashboardClientPage />
    );
}
