
import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import { getClients, getTestimonials, getServices, getProducts, getStaffData } from "@/lib/firestore";

// This is now a Server Component
export default async function HomePage() {
  const [clients, testimonials, services, products, staffData] = await Promise.all([
    getClients(),
    getTestimonials(),
    getServices(),
    getProducts(),
    getStaffData(),
  ]);

  const { agentCategories } = staffData;
  
  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta agentCategories={agentCategories} />
    </>
  );
}
