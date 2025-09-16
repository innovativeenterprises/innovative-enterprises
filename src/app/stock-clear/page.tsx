
import { initialStockItems } from '@/lib/stock-items';
import StockClearClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StockClear B2B Marketplace | Innovative Enterprises",
  description: "A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.",
};

export default function StockClearPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <StockClearClientPage initialItems={initialStockItems} />
            </div>
        </div>
    );
}
