
import HadeeyaAdminPageClient from './client-page';
import { getGiftCards } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Gift Cards | Admin Dashboard",
  description: "Manage and monitor all issued Hadeeya digital gift cards.",
};


export default async function HadeeyaAdminPage() {
    const giftCards = await getGiftCards();

    return (
       <HadeeyaAdminPageClient initialGiftCards={giftCards} />
    );
}
