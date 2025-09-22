
'use server';

import CompanyOverviewClient from "@/components/company-overview-client";
import ServiceCatalogClient from "@/components/service-catalog-client";
import ProductShowcaseClient from "@/components/product-showcase-client";
import ClientTestimonialsClient from "@/components/client-testimonials-client";
import AiToolsCtaClient from "@/components/ai-tools-cta-client";
import { getClients, getTestimonials, getServices, getStoreProducts, getAiTools } from "@/lib/firestore";

export default async function HomePage() {
  const [clients, testimonials, services, storeProducts, aiTools] = await Promise.all([
    getClients(),
    getTestimonials(),
    getServices(),
    getStoreProducts(),
    getAiTools(),
  ]);

  return (
    <>
      <CompanyOverviewClient clients={clients} />
      <ServiceCatalogClient services={services} />
      <ProductShowcaseClient products={storeProducts} />
      <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
      <AiToolsCtaClient aiTools={aiTools} />
    </>
  );
}
