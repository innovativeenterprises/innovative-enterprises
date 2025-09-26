
'use client';

import type { Metadata } from 'next';
import { usePropertiesData } from '@/hooks/use-data-hooks';
import SmartListingClientPage from "./client-page";

export const metadata: Metadata = {
    title: "Smart Listings | Real Estate",
    description: "Describe your dream property, and let our AI search our listings to find the perfect match for you.",
};


export default function SmartListingPage() {
    const { data: properties } = usePropertiesData();
    return <SmartListingClientPage initialProperties={properties} />;
}
