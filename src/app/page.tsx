
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getServices, getProducts, getClients, getTestimonials, getAiTools, getStoreProducts } from "@/lib/firestore";

export default async function HomePage() {
  const services = await getServices();
  const products = await getProducts();
  const clients = await getClients();
  const testimonials = await getTestimonials();
  const aiTools = await getAiTools();
  const storeProducts = await getStoreProducts();

  const allSaaSProducts = products;
  const allProducts = [...allSaaSProducts, ...storeProducts].filter(p => p.enabled);

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
