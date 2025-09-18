

import CooDashboardClient from './client-page';
import type { Metadata } from 'next';
import { getProducts, getProviders, getKpiData } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "AI COO Dashboard",
  description: "JADE's real-time operational analysis of the entire business ecosystem.",
};

export default async function CooDashboardPage() {
    const [products, providers, kpiData] = await Promise.all([
        getProducts(),
        getProviders(),
        getKpiData(),
    ]);

    return <CooDashboardClient 
        initialProducts={products}
        initialProviders={providers}
        initialKpiData={kpiData}
    />;
}
