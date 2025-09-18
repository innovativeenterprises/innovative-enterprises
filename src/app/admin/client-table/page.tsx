
import ClientTable from "../client-table";
import { getClients, getTestimonials } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Clients & Testimonials",
  description: "Manage your client list and public-facing testimonials.",
};

export default async function ClientTablePage() {
    const [clients, testimonials] = await Promise.all([
        getClients(),
        getTestimonials(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Clients & Testimonials</h1>
                <p className="text-muted-foreground">Manage your client list and public-facing testimonials.</p>
            </div>
            <ClientTable initialClients={clients} initialTestimonials={testimonials} />
        </div>
    );
}
