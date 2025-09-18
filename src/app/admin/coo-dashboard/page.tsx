
import CooDashboardClient from './client-page';
import type { Metadata } from 'next';
import { getProducts, getProviders, getKpiData } from '@/lib/firestore';
import { analyzeOperations } from '@/ai/flows/agentic-coo';

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

    // Perform the initial analysis on the server.
    const initialAnalysis = await analyzeOperations({
        products,
        providers,
        kpiData,
    });

    return <CooDashboardClient 
        initialProducts={products}
        initialProviders={providers}
        initialKpiData={kpiData}
        initialAnalysis={initialAnalysis}
    />;
}
