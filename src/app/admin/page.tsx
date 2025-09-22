
'use server';

import AdminDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { getProducts, getProviders, getOpportunities, getServices, getStaffData } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Admin Dashboard | Innovative Enterprises",
  description: "A high-level overview of the Innovative Enterprises ecosystem.",
};

export default async function AdminDashboardPage() {
    const [products, providers, opportunities, services, staffData] = await Promise.all([
        getProducts(),
        getProviders(),
        getOpportunities(),
        getServices(),
        getStaffData(),
    ]);

    return (
      <AdminDashboardPageClient
        initialProducts={products}
        initialProviders={providers}
        initialOpportunities={opportunities}
        initialServices={services}
        initialStaffData={staffData}
      />
    );
}
