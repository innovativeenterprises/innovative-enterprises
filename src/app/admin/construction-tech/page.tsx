
'use server';

import { getProducts } from "@/lib/firestore";
import ConstructionTechClientPage from '@/app/construction-tech/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Construction Technology",
  description: "Manage all Construction Tech SaaS platforms and tools.",
};

export default async function AdminConstructionTechPage() {
    const products = await getProducts();
    return <ConstructionTechClientPage initialProducts={products} isAdmin={true} />;
}
