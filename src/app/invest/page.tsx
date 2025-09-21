
'use server';

import InvestClientPage from "./client-page";
import type { Metadata } from 'next';
import { getProducts, getInvestors } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Invest With Us | Innovative Enterprises",
  description: "Explore investment opportunities in our portfolio of 80+ AI-driven technology products and join our journey of innovation.",
};

export default async function InvestPage() {
    const [products, investors] = await Promise.all([
        getProducts(),
        getInvestors()
    ]);
    const allProducts = products.filter(p => p.enabled);
    return <InvestClientPage initialProducts={allProducts} initialInvestors={investors} />;
}
