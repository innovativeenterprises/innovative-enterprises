

import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { getServices, getProducts, getClients, getTestimonials } from '@/lib/firestore';


export default async function Home() {
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
      <ClientTestimonials initialClients={clients} initialTestimonials={testimonials} />
      <AiToolsCta />
    </>
  );
}
