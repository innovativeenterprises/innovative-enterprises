
'use server';

import AdminDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { getFirestoreData } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Admin Dashboard | Innovative Enterprises",
  description: "A high-level overview of the Innovative Enterprises ecosystem.",
};

export default async function AdminDashboardPage() {
    // Data fetching on the server is still needed to populate the initial global store.
    // However, we no longer need to pass the data down as props.
    await getFirestoreData();

    return (
      <AdminDashboardPageClient />
    );
}
