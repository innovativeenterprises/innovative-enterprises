
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getClients, getTestimonials, getServices, getProducts, getStaffData } from "@/lib/firestore";

export default async function HomePage() {
  const [clients, testimonials, services, products, staffData] = await Promise.all([
      getClients(),
      getTestimonials(),
      getServices(),
      getProducts(),
      getStaffData(),
  ]);

  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta agentCategories={staffData.agentCategories} />
    </>
  );
}
