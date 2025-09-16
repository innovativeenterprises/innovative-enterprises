
'use client';
    
import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';

export default function Home() {
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog />
      <ProductShowcase />
      <ClientTestimonials />
      <AiToolsCta />
      <ChatWidget />
    </>
  )
}
