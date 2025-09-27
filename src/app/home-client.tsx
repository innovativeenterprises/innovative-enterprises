
'use client';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { useProductsData } from "@/hooks/use-data-hooks";

export default function HomeClient() {
  
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
