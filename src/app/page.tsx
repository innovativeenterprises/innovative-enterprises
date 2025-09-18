
'use client';

import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import { useProductsData, useServicesData, useClientsData, useTestimonialsData } from '@/hooks/use-global-store-data';


export default function Home() {
  const { products } = useProductsData();
  const { services } = useServicesData();
  const { clients } = useClientsData();
  const { testimonials } = useTestimonialsData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
        {/* This is a blank canvas. You can ask Aida, your AI assistant, to build out this page for you. */}
    </div>
  );
}
