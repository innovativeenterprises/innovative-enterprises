
import { getProducts, getServices } from "@/lib/firestore";
import EcosystemExplorerClient from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ecosystem Explorer | Innovative Enterprises",
  description: "Explore our integrated ecosystem of AI agents, SaaS platforms, and digital services designed to automate and accelerate your success.",
};


export default async function EcosystemExplorerPage() {
    const [products, services] = await Promise.all([
        getProducts(),
        getServices(),
    ]);

    return <EcosystemExplorerClient products={products} services={services} />;
}
