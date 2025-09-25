
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalogClient from "@/components/service-catalog-client";
import ProductShowcaseClient from "@/components/product-showcase-client";
import ClientTestimonialsClient from "@/components/client-testimonials-client";
import AiToolsCtaClient from "@/components/ai-tools-cta-client";
import { getClients, getServices, getProducts, getTestimonials, getAiTools } from "@/lib/firestore";

export default async function HomePage() {
  const [clients, services, products, testimonials, aiTools] = await Promise.all([
    getClients(),
    getServices(),
    getProducts(),
    getTestimonials(),
    getAiTools(),
  ]);

  const liveProducts = products.filter(p => p.stage === 'Live & Operating');

  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalogClient services={services} />
      <ProductShowcaseClient products={liveProducts} />
      <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
      <AiToolsCtaClient aiTools={aiTools} />
    </>
  );
}
