
'use client';

import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
  description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
};


export default function HomePage() {
  // This component now acts as a simple layout wrapper.
  // The child components will fetch their own data from the global store.
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
