
'use server';

import CompanyOverviewClient from "@/components/company-overview-client";
import ServiceCatalogClient from "@/components/service-catalog-client";
import ProductShowcaseClient from "@/components/product-showcase-client";
import ClientTestimonialsClient from "@/components/client-testimonials-client";
import AiToolsCtaClient from "@/components/ai-tools-cta-client";
import { getServices, getStoreProducts, getClients, getTestimonials, getAiTools } from "@/lib/firestore";


export default async function HomePage() {
  const [services, products, clients, testimonials, aiTools] = await Promise.all([
    getServices(),
    getStoreProducts(),
    getClients(),
    getTestimonials(),
    getAiTools(),
  ]);

  return (
    <>
      <CompanyOverviewClient clients={clients} />
      <ServiceCatalogClient services={services} />
      <ProductShowcaseClient products={products} />
      <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
      <AiToolsCtaClient aiTools={aiTools} />
    </>
  );
}
