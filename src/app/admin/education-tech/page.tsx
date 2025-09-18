
import { getProducts } from "@/lib/firestore";
import type { Metadata } from 'next';
import EducationTechClientPage from './client-page';

export const metadata: Metadata = {
  title: "Education Technology | Admin Dashboard",
  description: "Manage and monitor all education-focused platforms and tools.",
};


export default async function EducationTechAdminPage() {
    const products = await getProducts();
    const edutechProducts = products.filter(p => p.category === "Education Tech" && p.enabled);

    return <EducationTechClientPage products={edutechProducts} />;
}
