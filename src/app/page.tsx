
'use client';

import { useState } from 'react';
import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';
import type { Service } from '@/lib/services';
import { initialServices } from '@/lib/services';
import type { Product } from '@/lib/products';
import { initialProducts } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import { initialClients, initialTestimonials } from '@/lib/clients';
import AdminContentPage from './admin/content/page';


export default function Home() {
  // In a real app, this state would be fetched from a central store or API.
  // For this prototype, we're managing it here to simulate the dynamic
  // connection between the admin panel and the live site.
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // This is a stand-in for a proper admin data management solution.
  // It allows us to simulate the admin panel's data hooks without
  // actually rendering the admin page.
  const AdminDataRoot = () => {
    return (
        <div style={{display: 'none'}}>
            <AdminContentPage />
        </div>
    )
  }

  return (
    <div className="flex flex-col">
      <CompanyOverview />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
      <ChatWidget />
      {/* <AdminDataRoot /> */}
    </div>
  );
}
