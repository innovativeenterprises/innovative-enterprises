
'use server';

import AdminDashboardPageClient from './dashboard-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Dashboard | Innovative Enterprises",
  description: "A high-level overview of the Innovative Enterprises ecosystem.",
};

export default async function AdminDashboardPage() {
    return <AdminDashboardPageClient />
}
