'use client';

import { useState } from "react";
import StockItemTable from "./stock-item-table";
import type { StockItem } from "@/lib/stock-items.schema";

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const [items, setItems] = useState<StockItem[]>(initialItems);
    
    return (
       <StockItemTable items={items} setItems={setItems} />
    );
}