
'use server';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";
import { getFirestoreData } from "@/lib/firestore";
import type { AppState } from "./lib/initial-state";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function HomePage() {
  const { clients, services, products, testimonials, aiTools } = await getFirestoreData();
  const liveProducts = products.filter(p => p.stage === 'Live & Operating');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <CompanyOverview clients={clients} />
        <ServiceCatalog services={services} />
        <ProductShowcase products={liveProducts} />
        <ClientTestimonials clients={clients} testimonials={testimonials} />
        <AiToolsCta aiTools={aiTools} />
      </main>
      <Footer />
    </div>
  );
}
