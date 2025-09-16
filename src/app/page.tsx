
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { initialServices } from "@/lib/services";
import { initialProducts } from "@/lib/products";

export default function Home() {
  const products = initialProducts;
  const services = initialServices;
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
