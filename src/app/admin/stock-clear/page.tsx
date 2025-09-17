
import { initialStockItems } from '@/lib/stock-items';
import StockClearClientPage from '@/app/stock-clear/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StockClear Management | Innovative Enterprises",
  description: "Manage all listings on the B2B overstock marketplace.",
};

export default function StockClearAdminPage() {
    return (
         <div className="space-y-8">
            <StockClearClientPage initialItems={initialStockItems} />
        </div>
    );
}
