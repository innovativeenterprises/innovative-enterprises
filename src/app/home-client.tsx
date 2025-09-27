
'use client';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { useServicesData, useProductsData, useClientsData, useTestimonialsData, useAiToolsData } from '@/hooks/use-data-hooks';

export default function HomeClient() {
  // These hooks now safely access the pre-loaded data from the global store
  useServicesData();
  useProductsData();
  useClientsData();
  useTestimonialsData();
  useAiToolsData();
  
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
