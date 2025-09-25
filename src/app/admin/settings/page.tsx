
'use server';

import AdminSettingsClientPage from './client-page';
import { getSettings, getPricing, getCostSettings } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings | Innovative Enterprises",
  description: "Manage core operational settings for your application.",
};

export default async function AdminSettingsPage() {
    const [settings, pricing, costSettings] = await Promise.all([
        getSettings(),
        getPricing(),
        getCostSettings(),
    ]);

    return (
        <AdminSettingsClientPage 
            initialSettings={settings} 
            initialPricing={pricing} 
            initialCostSettings={costSettings} 
        />
    );
}
