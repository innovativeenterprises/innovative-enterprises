
'use server';

import AdminSettingsClientPage from './client-page';
import { getSettings, getPricing, getCostSettings, getPosProducts } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings | Innovative Enterprises",
  description: "Manage core operational settings for your application.",
};

export default async function AdminSettingsPage() {
    const [settings, pricing, costSettings, posProducts] = await Promise.all([
        getSettings(),
        getPricing(),
        getCostSettings(),
        getPosProducts(),
    ]);

    return (
        <AdminSettingsClientPage 
            initialSettings={settings} 
            initialPricing={pricing} 
            initialCostSettings={costSettings} 
            initialPosProducts={posProducts}
        />
    );
}
