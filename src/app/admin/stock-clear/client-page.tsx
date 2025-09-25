
'use client';

import { useState, useMemo, useEffect } from "react";
import StockItemTable from "./stock-item-table";
import type { StockItem } from "@/lib/stock-items.schema";
import { useStockItemsData } from "@/hooks/use-data-hooks";

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const { data: items, setData: setItems } = useStockItemsData(initialItems);
    
    return (
       <StockItemTable items={items} setItems={setItems} />
    );
}
