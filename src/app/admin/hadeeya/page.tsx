
'use server';

import HadeeyaAdminClientPage from './client-page';
import { getGiftCards } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Gift Cards",
  description: "Monitor and manage all issued digital gift cards.",
};


export default async function HadeeyaAdminPage() {
    const giftCards = await getGiftCards();
    return <HadeeyaAdminClientPage initialGiftCards={giftCards} />;
}

    
