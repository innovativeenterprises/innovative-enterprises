
'use server';

import { getProperties } from "@/lib/firestore";
import SmartListingClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Smart Listings | Real Estate",
    description: "Describe your dream property, and let our AI search our listings to find the perfect match for you.",
};


export default async function SmartListingPage() {
    const properties = await getProperties();
    return <SmartListingClientPage initialProperties={properties} />;
}
