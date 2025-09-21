

'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getProducts, getStoreProducts, getServices, getClients, getTestimonials, getAiTools } from "@/lib/firestore";

export default async function HomePage() {
  const [
    initialProducts,
    initialStoreProducts,
    initialServices,
    initialClients,
    initialTestimonials,
    initialAiTools,
  ] = await Promise.all([
    getProducts(),
    getStoreProducts(),
    getServices(),
    getClients(),
    getTestimonials(),
    getAiTools(),
  ]);

  return (
    <>
      <CompanyOverview clients={initialClients} />
      <ServiceCatalog services={initialServices} />
      <ProductShowcase products={initialProducts} />
      <ClientTestimonials clients={initialClients} testimonials={initialTestimonials} />
      <AiToolsCta aiTools={initialAiTools} />
    </>
  );
}
