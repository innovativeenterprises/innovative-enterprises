

'use client';

import { getPosProducts, getDailySales } from '@/lib/firestore';
import AiPosClientPage from './client-page';
import type { Metadata } from 'next';
import { initialPosProducts, initialDailySales } from '@/lib/pos-data';

export const metadata: Metadata = {
  title: "AI-POS for Education | Innovative Enterprises",
  description: "A smart, AI-driven Point-of-Sale system for university canteens or school stores, featuring inventory management and sales analytics.",
};

export default function AiPosPage() {
    const products = initialPosProducts;
    const dailySales = initialDailySales;
    return <AiPosClientPage products={products} initialDailySales={dailySales} />;
}
