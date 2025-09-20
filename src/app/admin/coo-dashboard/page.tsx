
'use client';

import CooDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { useProductsData, useProvidersData, useCfoData } from '@/hooks/use-global-store-data';

export const metadata: Metadata = {
    title: "AI COO Dashboard",
    description: "JADE's real-time operational analysis of the entire business ecosystem."
};

export default function CooDashboardPage() {
    const { products } = useProductsData();
    const { providers } = useProvidersData();
    const { cfoData } = useCfoData();

    return (
        <CooDashboardPageClient
            products={products}
            providers={providers}
            kpiData={cfoData.kpiData}
        />
    )
}
