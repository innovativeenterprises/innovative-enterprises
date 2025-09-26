'use server';

import AdminSettingsClientPage from './client-page';
import { getSettings, getPricing, getCostSettings, getPosProducts } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings | Innovative Enterprises",
  description: "Manage core operational settings, pricing, and configurations for your application.",
};

export default async function AdminSettingsPage() {
    // These fetches are still necessary to populate the initial global store on the server.
    await Promise.all([
        getSettings(),
        getPricing(),
        getCostSettings(),
        getPosProducts(),
    ]);

    return (
        <AdminSettingsClientPage />
    );
}