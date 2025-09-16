import HadeeyaPageClient from './client-page';
import { initialGiftCards } from '@/lib/gift-cards';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Digital Gift Cards | Innovative Enterprises",
  description: "The perfect gift for any occasion. Create and send a personalized digital gift card in minutes.",
};

export default function HadeeyaPage() {
    return <HadeeyaPageClient initialGiftCards={initialGiftCards} />;
}
