
'use server';

import ConstructionTechClientPage from '@/app/construction-tech/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Construction Technology",
  description: "Manage all Construction Tech SaaS platforms and tools.",
};

export default async function AdminConstructionTechPage() {
    // The client component will now fetch data from the global store.
    // No need to fetch or pass props here.
    return <ConstructionTechClientPage isAdmin={true} />;
}
