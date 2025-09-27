
'use server';

import { getStockItems } from "@/lib/firestore";
import StockItemDetailClientPage from "./client-page";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const items = await getStockItems();
  const item = items.find(p => p.id === params.id);

  if (!item) {
    return {
      title: 'Item Not Found',
    };
  }

  return {
    title: `${item.name} | StockClear Marketplace`,
    description: item.description,
  };
}


export default async function StockItemDetailPage({ params }: { params: { id: string } }) {
    const items = await getStockItems();
    const item = items.find(p => p.id === params.id);
    
    return <StockItemDetailClientPage item={item} />;
}
