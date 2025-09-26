'use client';

import { useState } from 'react';
import type { StockItem } from '@/lib/stock-items.schema';
import { useStockItemsData } from '@/hooks/use-data-hooks';
import StockItemTable from './stock-item-table';

export default function StockClearClientPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">StockClear Marketplace</h1>
                <p className="text-muted-foreground">Monitor and manage all overstock and clearance item listings.</p>
            </div>
            <StockItemTable />
        </div>
    );
}
