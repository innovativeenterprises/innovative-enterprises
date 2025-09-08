
'use client';

import { useState, useEffect } from 'react';
import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';
import { useServicesData, useProductsData, useClientsData } from '@/hooks/use-global-store-data';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceCatalogSkeleton = () => (
    <section id="services" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
    </section>
);
const ProductShowcaseSkeleton = () => (
     <section id="products" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
            </div>
        </div>
    </section>
);
const ClientTestimonialsSkeleton = () => (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
         <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
            </div>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
                 {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-12 w-32" />)}
             </div>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
             </div>
         </div>
    </section>
);


export default function Home() {
  const { services, isClient: isServicesClient } = useServicesData();
  const { products, isClient: isProductsClient } = useProductsData();
  const { clients, testimonials, isClient: isClientsClient } = useClientsData();
  
  const isClient = isServicesClient && isProductsClient && isClientsClient;
  
  return (
     <>
      <CompanyOverview />
      {isClient ? <ServiceCatalog services={services} /> : <ServiceCatalogSkeleton />}
      {isClient ? <ProductShowcase products={products} /> : <ProductShowcaseSkeleton />}
      {isClient ? <ClientTestimonials clients={clients} testimonials={testimonials} /> : <ClientTestimonialsSkeleton />}
      <AiToolsCta />
      {isClient && <ChatWidget />}
    </>
  )
}
