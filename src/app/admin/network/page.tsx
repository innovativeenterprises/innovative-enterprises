
'use server';

import NetworkPageClient from './client-page';
import { getProviders, getAssets } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Network Management",
    description: "Manage your external network of providers and rental assets."
};

export default async function NetworkPage() {
    const [providers, assets] = await Promise.all([
        getProviders(),
        getAssets(),
    ]);

    return <NetworkPageClient initialProviders={providers || []} initialAssets={assets || []} />;
}
