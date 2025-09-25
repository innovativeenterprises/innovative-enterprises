
'use server';

import RealEstateTechClientPage from "@/app/admin/real-estate-tech/client-page";
import { getProducts } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Real Estate Technology Solutions",
  description: "Discover a portfolio of AI-driven SaaS platforms to modernize property valuation, management, and investment for the Gulf region.",
};

export default async function RealEstateTechPage() {
    const products = await getProducts();
    const realEstateProducts = products.filter(p => p.category === "Real Estate Tech" && p.enabled);
    return <RealEstateTechClientPage initialProducts={realEstateProducts} />;
}
