'use server';

import type { Metadata } from 'next';
import { getProducts } from '@/lib/firestore';
import ConstructionTechClientPage from './client-page';

export const metadata: Metadata = {
  title: "Construction Technology Solutions",
  description: "A suite of AI-powered SaaS platforms designed to automate, optimize, and revolutionize the construction industry in the Gulf and beyond.",
};

export default async function ConstructionTechPage() {
    const products = await getProducts();
    const contechProducts = products.filter(p => p.category === "Construction Tech" && p.enabled);
    
  return (
    <ConstructionTechClientPage initialProducts={contechProducts} />
  );
}
