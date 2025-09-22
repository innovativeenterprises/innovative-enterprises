
'use server';

import Hero from "@/app/hero";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import ClientTestimonials from "@/components/client-testimonials";
import AiToolsCta from "@/components/ai-tools-cta";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
    </>
  );
}
