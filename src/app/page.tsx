'use client';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { useClientsData, useTestimonialsData, useServicesData, useProductsData, useStaffData } from "@/hooks/use-global-store-data";

export default function HomePage() {
  const { clients } = useClientsData();
  const { testimonials } = useTestimonialsData();
  const { services } = useServicesData();
  const { products } = useProductsData();
  const { agentCategories } = useStaffData();
  
  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta agentCategories={agentCategories} />
    </>
  );
}
