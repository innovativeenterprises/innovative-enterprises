'use client';

import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";

export default function HomePageClient() {
  // This component now acts as a simple layout wrapper.
  // The child components will fetch their own data from the global store.
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
