


import { getPosProducts, getDailySales } from '@/lib/firestore';
import AiPosClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI-POS for Education | Innovative Enterprises",
  description: "A smart, AI-driven Point-of-Sale system for university canteens or school stores, featuring inventory management and sales analytics.",
};

export default async function AiPosPage() {
    const [products, dailySales] = await Promise.all([
        getPosProducts(),
        getDailySales()
    ]);
    
    return <AiPosClientPage products={products} initialDailySales={dailySales} />;
}
