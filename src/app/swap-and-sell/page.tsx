
'use server';

import SwapSellClientPage from './client-page';
import { getUsedItems } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Swap & Sell Hub | Innovative Enterprises",
  description: "A community marketplace for used or old items. Easily list items for sale, donation, or as a gift.",
};

export default async function SwapAndSellPage() {
    const items = await getUsedItems();
    return <SwapSellClientPage initialItems={items} />;
}
