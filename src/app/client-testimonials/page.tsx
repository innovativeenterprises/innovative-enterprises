
import ClientTestimonials from "@/components/client-testimonials";
import { initialClients, initialTestimonials } from '@/lib/clients';

export default function ClientTestimonialsPage() {
    return <ClientTestimonials initialClients={initialClients} initialTestimonials={initialTestimonials} />;
}
