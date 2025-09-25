
'use server';

import type { Metadata } from 'next';
import { getProducts, getInvestors, getStaffData, getServices, getSettings } from "@/lib/firestore";
import InvestClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Invest With Us | Innovative Enterprises",
  description: "Explore investment opportunities in our portfolio of 80+ AI-driven technology products and join our journey of innovation.",
};

export default async function InvestPage() {
    const [products, investors, staffData, services, settings] = await Promise.all([
        getProducts(),
        getInvestors(),
        getStaffData(),
        getServices(),
        getSettings()
    ]);
    const allProducts = products.filter(p => p.enabled);

    if (!settings) {
        return <div>Loading...</div>; // Or some error state
    }
    
    return (
        <InvestClientPage 
            initialProducts={allProducts} 
            initialInvestors={investors} 
            staffData={staffData}
            services={services}
            settings={settings}
        />
    );
}

