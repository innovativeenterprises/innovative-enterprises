import HadeeyaAdminPageClient from './client-page';
import type { Metadata } from 'next';
import { initialGiftCards } from '@/lib/gift-cards';

export const metadata: Metadata = {
    title: "Hadeeya Gift Card Management",
    description: "Monitor and manage all generated digital gift cards.",
};

export default function HadeeyaAdminPage() {
    const giftCards = initialGiftCards;
    return <HadeeyaAdminPageClient initialGiftCards={giftCards} />;
}
