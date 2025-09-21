
'use server';

import CooDashboardClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AI COO Dashboard",
    description: "JADE's real-time operational analysis of the entire business ecosystem."
};

export default async function CooDashboardPage() {
    // This page is now a Server Component. It doesn't fetch data itself,
    // but it sets up the structure for its client component which will.
    return <CooDashboardClientPage />;
}
