'use client';

import StockClearAdminPage from "./client-page";
import { useStockItemsData } from "@/hooks/use-global-store-data";

export default function StockClearPage() {
    const { stockItems } = useStockItemsData();
    return <StockClearAdminPage initialItems={stockItems} />;
}
