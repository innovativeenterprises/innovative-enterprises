import CooDashboardClient from './client-page';
import type { Metadata } from 'next';
import { initialProducts } from '@/lib/products';
import { initialProviders } from '@/lib/providers';
import { kpiData } from '@/lib/cfo-data';

export const metadata: Metadata = {
  title: "AI COO Dashboard",
  description: "JADE's real-time operational analysis of the entire business ecosystem.",
};

export default function CooDashboardPage() {
    // Data is fetched on the server and passed down as props.
    const products = initialProducts;
    const providers = initialProviders;

    return <CooDashboardClient 
        initialProducts={products}
        initialProviders={providers}
        initialKpiData={kpiData}
    />;
}
