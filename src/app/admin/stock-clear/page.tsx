'use server';

import StockClearClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "StockClear Marketplace Admin",
    description: "Monitor and manage all overstock and clearance item listings."
};

export default async function AdminStockClearPage() {
    // Data is fetched and loaded into the global store in the root layout.
    return <StockClearClientPage />;
}
