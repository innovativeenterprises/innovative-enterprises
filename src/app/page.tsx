import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { getServices, getProducts, getClients, getTestimonials } from '@/lib/firestore';


export default async function Home() {
  // Data is fetched on the server and passed down to the client components.
  // This avoids client-side data fetching on initial load.
  const [products, services, clients, testimonials] = await Promise.all([
    getProducts(),
    getServices(),
    getClients(),
    getTestimonials(),
  ]);

  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
