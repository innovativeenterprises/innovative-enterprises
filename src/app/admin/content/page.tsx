
import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import PricingTable from "@/app/admin/pricing-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosProductTable from "@/app/admin/pos-product-table";
import { getPricing, getProducts, getServices, getClients, getTestimonials, getPosProducts, getStages, getGiftCards } from '@/lib/firestore';
import HadeeyaAdminPageClient from "../hadeeya/client-page";

export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials, pricing, posProducts, giftCards] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getPricing(),
        getPosProducts(),
        getGiftCards(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">
                    Manage your public-facing services, products, clients, and pricing.
                </p>
            </div>
            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                    <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                    <TabsTrigger value="pos">AI-POS Products</TabsTrigger>
                    <TabsTrigger value="gift-cards">Hadeeya Gift Cards</TabsTrigger>
                </TabsList>
                <TabsContent value="services" className="mt-6">
                    <ServiceTable initialServices={services} />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                    <ProductTable initialProducts={products} initialStages={stages} />
                </TabsContent>
                <TabsContent value="clients" className="mt-6">
                    <ClientTable initialClients={clients} initialTestimonials={testimonials} />
                </TabsContent>
                <TabsContent value="pricing" className="mt-6">
                    <PricingTable pricing={pricing} />
                </TabsContent>
                <TabsContent value="pos" className="mt-6">
                    <PosProductTable initialProducts={posProducts} />
                </TabsContent>
                 <TabsContent value="gift-cards" className="mt-6">
                   <HadeeyaAdminPageClient initialGiftCards={giftCards} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
