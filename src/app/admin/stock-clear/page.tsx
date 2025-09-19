
import { getStockItems } from '@/lib/firestore';
import StockClearClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StockClear Management | Innovative Enterprises",
  description: "Manage all listings on the B2B overstock marketplace.",
};

export default async function StockClearAdminPage() {
    const stockItems = await getStockItems();
    return <StockClearClientPage initialItems={stockItems} />;
}
