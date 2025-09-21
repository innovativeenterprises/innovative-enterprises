

'use server';

import AutomotiveTechClientPage from "./client-page";
import { getProducts } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Automotive Technology Solutions",
  description: "Driving the future of mobility with AI-powered platforms for rental agencies, fleet management, and beyond.",
};


export default async function AutomotiveTechPage() {
    const products = await getProducts();
    const autotechProducts = products.filter(p => p.category === "Automotive Tech" && p.enabled);
    
    return <AutomotiveTechClientPage initialProducts={autotechProducts} />;
}
