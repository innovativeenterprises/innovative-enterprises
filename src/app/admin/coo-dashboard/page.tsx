
'use server';

import { getProducts, getProviders, getCfoData } from '@/lib/firestore';
import type { Metadata } from 'next';
import CooDashboardClientPage from './client-page';

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

    return <CooDashboardClientPage initialProducts={products} initialProviders={providers} initialCfoData={cfoData} />;
}
