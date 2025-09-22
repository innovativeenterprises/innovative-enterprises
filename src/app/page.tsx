
'use server';

import ClientTestimonials from "@/components/client-testimonials";
import Hero from "@/app/hero";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import { getServices, getProducts, getClients, getTestimonials, getAiTools } from "@/lib/firestore";

export default async function HomePage() {
    const [services, products, clients, testimonials, aiTools] = await Promise.all([
        getServices(),
        getProducts(),
        getClients(),
        getTestimonials(),
        getAiTools(),
    ]);

  return (
    <>
      <Hero clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta aiTools={aiTools} />
    </>
  );
}

    