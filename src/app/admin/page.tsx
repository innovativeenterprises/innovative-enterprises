
'use server';

import AdminDashboardPageClient from './dashboard-client';
import { getProducts, getStaffData, getProviders, getOpportunities, getServices } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Dashboard | Innovative Enterprises",
  description: "A high-level overview of the Innovative Enterprises ecosystem.",
};

export default async function AdminDashboardPage() {
    const [products, providers, staffData, opportunities, services] = await Promise.all([
        getProducts(),
        getProviders(),
        getStaffData(),
        getOpportunities(),
        getServices()
    ]);
    
    const { leadership, staff, agentCategories } = staffData;

    return <AdminDashboardPageClient 
        products={products}
        providers={providers}
        leadership={leadership}
        staff={staff}
        agentCategories={agentCategories}
        opportunities={opportunities}
        services={services}
    />
}
