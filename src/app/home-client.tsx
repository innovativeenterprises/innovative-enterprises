
'use client';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { useProductsData, useAiToolsData } from "@/hooks/use-data-hooks";

export default function HomeClient() {
  const { data: products } = useProductsData();
  const { data: aiTools } = useAiToolsData();
  
  const liveProducts = products.filter(p => p.stage === 'Live & Operating');

  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase products={liveProducts} />
      <ClientTestimonials />
      <AiToolsCta aiTools={aiTools} />
    </>
  );
}
