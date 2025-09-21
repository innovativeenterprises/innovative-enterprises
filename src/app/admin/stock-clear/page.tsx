
'use server';

import StockClearClientPage from './client-page';
import { getStockItems } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "StockClear Marketplace",
    description: "Monitor and manage all overstock and clearance item listings."
};

export default async function AdminStockClearPage() {
    const stockItems = await getStockItems();
    return <StockClearClientPage initialItems={stockItems} />;
}

    