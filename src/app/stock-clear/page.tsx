import { initialStockItems } from '@/lib/stock-items';
import StockClearMarketplacePage from './client-page';
import type { Metadata } from 'next';
import { Warehouse } from 'lucide-react';

export const metadata: Metadata = {
  title: "StockClear B2B Marketplace | Innovative Enterprises",
  description: "A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.",
};

export default function StockClearPage() {
    const stockItems = initialStockItems;
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Warehouse className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">StockClear Marketplace</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales. Unlock trapped capital and prevent waste.
                    </p>
                </div>
                <div className="max-w-6xl mx-auto mt-12">
                     <StockClearMarketplacePage initialItems={stockItems} />
                </div>
            </div>
        </div>
    );
}
