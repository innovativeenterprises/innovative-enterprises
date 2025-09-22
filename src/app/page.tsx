
'use server';

import CompanyOverviewClient from "@/components/company-overview-client";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { getClients } from "@/lib/firestore";

export default async function HomePage() {
  const clients = await getClients();
  return (
    <>
      <CompanyOverviewClient clients={clients} />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
