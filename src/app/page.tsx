
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalogClient from "@/components/service-catalog-client";
import ProductShowcaseClient from "@/components/product-showcase-client";
import ClientTestimonialsClient from "@/components/client-testimonials-client";
import AiToolsCtaClient from "@/components/ai-tools-cta-client";
import { getClients, getServices, getStoreProducts, getTestimonials, getAiTools } from "@/lib/firestore";

export default async function HomePage() {
  const [clients, services, storeProducts, testimonials, aiTools] = await Promise.all([
    getClients(),
    getServices(),
    getStoreProducts(),
    getTestimonials(),
    getAiTools(),
  ]);

  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalogClient services={services} />
      <ProductShowcaseClient products={storeProducts} />
      <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
      <AiToolsCtaClient aiTools={aiTools} />
    </>
  );
}
