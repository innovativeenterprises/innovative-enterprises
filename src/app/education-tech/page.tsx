

'use server';

import { getProducts } from "@/lib/firestore";
import EducationTechClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Education Technology Solutions",
  description: "A suite of AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
};

export default async function EducationTechPage() {
    const products = await getProducts();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);
    return <EducationTechClientPage initialProducts={edutechProducts} />;
}
