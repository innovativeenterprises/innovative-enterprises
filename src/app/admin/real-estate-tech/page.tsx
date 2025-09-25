
'use server';

import { getProducts } from "@/lib/firestore";
import RealEstateTechClientPage from '@/app/real-estate-tech/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Real Estate Technology",
  description: "Manage all Real Estate Tech SaaS platforms and tools.",
};

export default async function AdminRealEstateTechPage() {
    const products = await getProducts();
    return <RealEstateTechClientPage initialProducts={products} isAdmin={true} />;
}
