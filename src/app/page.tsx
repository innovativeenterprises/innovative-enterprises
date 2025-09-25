
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
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
      <ServiceCatalog services={services} />
      <ProductShowcase products={liveProducts} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta aiTools={aiTools} />
    </>
  );
}

