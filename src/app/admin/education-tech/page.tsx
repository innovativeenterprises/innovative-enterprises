
'use server';

import { getProducts } from '@/lib/firestore';
import EducationTechClientPage from './client-page';
import type { Product } from '@/lib/products.schema';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Education Technology",
  description: "Manage and monitor all education-focused platforms and tools."
};


export default async function EducationTechPage() {
    const products = await getProducts();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);
    return <EducationTechClientPage initialProducts={edutechProducts} />;
}
    
