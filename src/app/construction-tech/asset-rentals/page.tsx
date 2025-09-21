
'use server';

import { Server } from "lucide-react";
import AssetRentalsClientPage from "./client-page";
import { getAssets } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Asset & Equipment Rentals | Innovative Enterprises",
    description: "Browse our catalog of high-quality construction equipment, vehicles, and IT hardware available for rent, or let our AI build a custom package for you.",
};

export default async function AssetRentalsPage() {
    const assets = await getAssets();
    return <AssetRentalsClientPage initialAssets={assets} />;
}
