
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
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
      <ServiceCatalog services={services} />
      <ProductShowcase products={storeProducts} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta aiTools={aiTools} />
    </>
  );
}
