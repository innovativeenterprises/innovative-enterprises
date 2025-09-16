
import { initialPosProducts } from '@/lib/pos-data';
import AiPosClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI-POS for Education | Innovative Enterprises",
  description: "A smart, AI-driven Point-of-Sale system for university canteens or school stores, featuring inventory management and sales analytics.",
};

export default function AiPosPage() {
    const products = initialPosProducts;
    return <AiPosClientPage products={products} />;
}
