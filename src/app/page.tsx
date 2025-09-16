import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { initialProducts } from "@/lib/products";
import { initialServices } from "@/lib/services";
import { initialClients, initialTestimonials } from "@/lib/clients";

export default function Home() {
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog services={initialServices} />
      <ProductShowcase products={initialProducts} />
      <ClientTestimonials clients={initialClients} testimonials={initialTestimonials} />
      <AiToolsCta />
    </>
  );
}
