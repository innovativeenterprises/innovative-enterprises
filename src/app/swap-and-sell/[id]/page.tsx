
'use server';

import { getUsedItems } from "@/lib/firestore";
import ItemDetailClientPage from "./client-page";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const items = await getUsedItems();
  const item = items.find(p => p.id === params.id);

  if (!item) {
    return {
      title: 'Item Not Found',
    };
  }

  return {
    title: `${item.name} | Swap & Sell Hub`,
    description: item.description,
  };
}


export default async function ItemDetailPage({ params }: { params: { id: string } }) {
    const items = await getUsedItems();
    const item = items.find(p => p.id === params.id);
    
    return <ItemDetailClientPage item={item} />;
}
