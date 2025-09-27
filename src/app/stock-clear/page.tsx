
'use server';

import StockClearClientPage from './client-page';
import type { Metadata } from 'next';
import { getStockItems } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "StockClear Marketplace",
    description: "A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales."
};

export default async function StockClearPage() {
    return <StockClearClientPage />;
}
