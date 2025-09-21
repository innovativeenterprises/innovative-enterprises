
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import type { Product } from '@/lib/products.schema';
import type { Service } from '@/lib/services.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { AiTool } from '@/lib/nav-links';
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

  const allProducts = [...initialProducts, ...initialStoreProducts].filter(p => p.enabled);
  const allEnabledServices = initialServices.filter(s => s.enabled);


  return (
    <>
      <CompanyOverview clients={initialClients} />
      <ServiceCatalog services={allEnabledServices} />
      <ProductShowcase products={allProducts} />
      <ClientTestimonials clients={initialClients} testimonials={initialTestimonials} />
      <AiToolsCta aiTools={initialAiTools} />
    </>
  );
}
