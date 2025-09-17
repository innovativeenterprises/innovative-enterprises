
import CooDashboardClient from './client-page';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { getProviders } from '@/lib/providers';
import { kpiData } from '@/lib/cfo-data';

export const metadata: Metadata = {
  title: "AI COO Dashboard",
  description: "JADE's real-time operational analysis of the entire business ecosystem.",
};

export default async function CooDashboardPage() {
    const products = await getProducts();
    const providers = await getProviders();

    return <CooDashboardClient 
        initialProducts={products}
        initialProviders={providers}
        initialKpiData={kpiData}
    />;
}
