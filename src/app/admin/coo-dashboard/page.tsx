
'use server';

import CooDashboardClientPage from './client-page';
import { getProducts, getProviders, getCfoData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AI COO Dashboard",
    description: "JADE's real-time operational analysis of the entire business ecosystem."
};

export default async function CooDashboardPage() {
    const [products, providers, cfoData] = await Promise.all([
        getProducts(),
        getProviders(),
        getCfoData(),
    ]);

    if (!cfoData) {
        // Handle the case where cfoData is null, maybe render an error or a loading state
        return <div>Error loading financial data.</div>;
    }

    return <CooDashboardClientPage initialProducts={products} initialProviders={providers} initialCfoData={cfoData} />;
}
