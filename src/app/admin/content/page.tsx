import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import PricingTable from "@/app/admin/pricing-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosProductTable from "@/app/admin/pos-product-table";
import { initialPricing } from "@/lib/pricing";


export default function AdminContentPage() {
  const pricing = initialPricing;

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Site Content</h1>
            <p className="text-muted-foreground">
                Manage your public-facing services, products, clients, and pricing.
            </p>
        </div>
        <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                <TabsTrigger value="pos">AI-POS Products</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-6">
                <ServiceTable />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
                <ProductTable />
            </TabsContent>
            <TabsContent value="clients" className="mt-6">
                 <ClientTable />
            </TabsContent>
            <TabsContent value="pricing" className="mt-6">
                <PricingTable pricing={pricing} setPricing={() => {}} isClient={true} />
            </TabsContent>
            <TabsContent value="pos" className="mt-6">
                <PosProductTable />
            </TabsContent>
        </Tabs>
    </div>
  );
}
