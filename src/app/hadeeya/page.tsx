

'use server';

import HadeeyaClientPage from './client-page';
import { getGiftCards } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Gift Cards",
  description: "Create and send personalized digital gift cards for any occasion.",
};


export default async function HadeeyaPage() {
    const giftCards = await getGiftCards();
    return <HadeeyaClientPage initialGiftCards={giftCards} />;
}
