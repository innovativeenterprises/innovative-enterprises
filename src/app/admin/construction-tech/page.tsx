
'use client';

import ConstructionTechPage from '@/app/construction-tech/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Construction Technology",
  description: "Manage all Construction Tech SaaS platforms and tools.",
};

export default function AdminConstructionTechPage() {
    return <ConstructionTechPage />;
}
