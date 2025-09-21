
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/app/client-testimonials/page";
import { getProducts, getServices } from "@/lib/firestore";

export default async function HomePage() {
  const products = await getProducts();
  const services = await getServices();

  return (
    <>
      <CompanyOverview />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
