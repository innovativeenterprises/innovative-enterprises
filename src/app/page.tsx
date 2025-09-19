import HomePageClient from "./home-page-client";
import { getProducts, getServices, getClients, getTestimonials } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
  description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
};


export default async function HomePage() {
  const [products, services, clients, testimonials] = await Promise.all([
    getProducts(),
    getServices(),
    getClients(),
    getTestimonials()
  ]);

  return (
    <HomePageClient 
      products={products}
      services={services}
      clients={clients}
      testimonials={testimonials}
    />
  );
}
