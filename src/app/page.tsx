
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getClients, getTestimonials } from "@/lib/firestore";

export default async function HomePage() {
  const [clients, testimonials] = await Promise.all([
      getClients(),
      getTestimonials()
  ]);

  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
    </>
  );
}
