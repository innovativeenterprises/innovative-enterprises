
'use server';

import { getClients, getTestimonials } from "@/lib/firestore";
import ClientTestimonialsClient from "./client-testimonials-client";

export default async function ClientTestimonials() {
  const [clients, testimonials] = await Promise.all([
    getClients(),
    getTestimonials(),
  ]);
  
  return (
      <ClientTestimonialsClient clients={clients} testimonials={testimonials} />
  );
}
