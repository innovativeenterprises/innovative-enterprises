
'use server';

import AdminDashboardPageClient from './client-page';
import { getProducts, getProviders, getStaffData } from '@/lib/firestore';

export default async function AdminDashboardPage() {
    const [products, providers, { leadership, staff, agentCategories }] = await Promise.all([
        getProducts(),
        getProviders(),
        getStaffData()
    ]);

    return <AdminDashboardPageClient 
        products={products}
        providers={providers}
        leadership={leadership}
        staff={staff}
        agentCategories={agentCategories}
    />
}
