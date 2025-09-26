
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { getFirestoreData } from "@/lib/firestore";
import type { AppState } from "./lib/initial-state";

interface HomePageProps {
  initialState: AppState;
}

export default async function HomePage({ initialState }: HomePageProps) {
  const { clients, services, products, testimonials, aiTools } = await getFirestoreData();
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
