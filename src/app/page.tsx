

'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getProducts, getStoreProducts, getServices, getClients, getTestimonials, getAiTools } from '@/lib/firestore';


export default async function HomePage() {
  const [
    products,
    storeProducts,
    services,
    clients,
    testimonials,
    aiTools
  ] = await Promise.all([
    getProducts(),
    getStoreProducts(),
    getServices(),
    getClients(),
    getTestimonials(),
    getAiTools()
  ]);

  const allProducts = [...products, ...storeProducts].filter(p => p.enabled);

  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={allProducts} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta aiTools={aiTools} />
    </>
  );
}
