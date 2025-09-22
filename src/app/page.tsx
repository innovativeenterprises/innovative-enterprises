
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/app/client-testimonials/page";
import AiToolsCta from "@/components/ai-tools-cta";
import { getProducts, getClients, getTestimonials, getServices } from "@/lib/firestore";

export default async function HomePage() {
  const products = await getProducts();
  const clients = await getClients();
  const testimonials = await getTestimonials();
  const services = await getServices();
  
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
