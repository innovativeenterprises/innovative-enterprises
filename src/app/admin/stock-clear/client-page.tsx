
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import type { StockItem } from '@/lib/stock-items.schema';
import { useStockItemsData } from '@/hooks/use-data-hooks';
import { AddEditStockItemDialog } from './stock-item-table';
import StockItemTable from './stock-item-table';

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const { data: items, setData: setItems } = useStockItemsData(initialItems);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">StockClear Marketplace</h1>
                <p className="text-muted-foreground">Monitor and manage all overstock and clearance item listings.</p>
            </div>
            <AddEditStockItemDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={(values, id) => {
                    // This logic would ideally be in a shared hook or utility
                    if (id) {
                        setItems(prev => prev.map(item => (item.id === id ? { ...item, ...values } as StockItem : item)));
                    } else {
                        const newItem: StockItem = { ...values, id: `stock_${Date.now()}` };
                        setItems(prev => [newItem, ...prev]);
                    }
                }}
            >
                <div/>
            </AddEditStockItemDialog>
            <StockItemTable items={items} setItems={setItems} />
        </div>
    );
}
