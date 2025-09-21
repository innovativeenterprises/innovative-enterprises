
'use server';

import { getProducts } from '@/lib/firestore';
import ConstructionTechClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Construction Technology",
    description: "Manage and monitor all construction-focused platforms and tools."
};

export default async function ConstructionTechPage() {
    const products = await getProducts();
    const contechProducts = products.filter(p => p.category === "Construction Tech");
    return <ConstructionTechClientPage initialProducts={contechProducts} />;
}
