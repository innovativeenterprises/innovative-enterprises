import CooDashboard from '../coo-dashboard';
import type { Metadata } from 'next';
import { initialProducts } from '@/lib/products';
import { initialProviders } from '@/lib/providers';
import { kpiData } from '@/lib/cfo-data';

export const metadata: Metadata = {
  title: "AI COO Dashboard",
  description: "JADE's real-time operational analysis of the entire business ecosystem.",
};

export default function CooDashboardPage() {
    // In a real app, this would be a dynamic fetch.
    // For the prototype, we use initial static data on the server.
    const products = initialProducts;
    const providers = initialProviders;

    return <CooDashboard 
        initialProducts={products}
        initialProviders={providers}
        initialKpiData={kpiData}
    />;
}
