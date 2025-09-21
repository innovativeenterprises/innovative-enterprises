
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getProducts, getServices, getClients, getTestimonials } from "@/lib/firestore";

export default async function HomePage() {
  const [products, services, clients, testimonials] = await Promise.all([
      getProducts(),
      getServices(),
      getClients(),
      getTestimonials(),
  ]);

  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
    </>
  );
}
