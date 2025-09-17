
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { initialServices } from "@/lib/services";
import { initialProducts } from "@/lib/products";
import { initialClients, initialTestimonials } from "@/lib/clients";

export default function Home() {
  const products = initialProducts;
  const services = initialServices;
  const clients = initialClients;
  const testimonials = initialTestimonials;

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
