'use client';

import HadeeyaAdminPage from "./client-page";
import { useGiftCardsData } from "@/hooks/use-global-store-data";

export default function HadeeyaPage() {
    const { giftCards } = useGiftCardsData();
    return <HadeeyaAdminPage initialGiftCards={giftCards} />;
}
