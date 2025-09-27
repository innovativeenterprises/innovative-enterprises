

'use client';

import AdminContentClientPage from './client-page';
import type { Metadata } from 'next';

// Although this is a client component now, we can still provide metadata.
// Next.js will handle this correctly.
export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, clients, and pricing."
};


export default function AdminContentPage() {
    return (
        <AdminContentClientPage />
    );
}

