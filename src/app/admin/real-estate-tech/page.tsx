
'use server';

import RealEstateTechClientPage from '@/app/real-estate-tech/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Real Estate Technology",
  description: "Manage all Real Estate Tech SaaS platforms and tools.",
};

export default async function AdminRealEstateTechPage() {
    // The client component will now fetch data from the global store.
    return <RealEstateTechClientPage isAdmin={true} />;
}
