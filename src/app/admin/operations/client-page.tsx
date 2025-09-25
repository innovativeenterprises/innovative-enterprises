
'use client';

import ProForm from "./pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale } from "lucide-react";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Pricing } from "@/lib/pricing.schema";
import type { PosProduct } from "@/lib/pos-data.schema";
import PricingTable from "@/app/admin/pricing-table";
import PosProductTable from "@/app/admin/pos-product-table";
import CostSettingsTable from "./cost-settings-table";
import type { CostRate } from "@/lib/cost-settings.schema";


// --- Main Operations Client Page ---
interface AdminOperationsClientPageProps {
    initialPricing: Pricing[];
    initialPosProducts: PosProduct[];
    initialCostSettings: CostRate[];
}

export default function AdminOperationsClientPage({ 
    initialPricing,
    initialPosProducts,
    initialCostSettings,
}: AdminOperationsClientPageProps) {

  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
    { id: 'coupon', title: 'Coupon Generator', icon: Ticket, component: <CouponGenerator /> },
    { id: 'rental', title: 'Asset Rental Proposal Generator', icon: Scale, component: <AssetRentalAgentForm /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations & Settings</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools and operational configurations.
            </p>
        </div>

        <div className="space-y-8">
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ai-tools">
                    <AccordionTrigger>
                        <h2 className="text-2xl font-bold">Internal AI Tools</h2>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                         <Accordion type="single" collapsible className="w-full">
                            {internalTools.map(tool => (
                                <AccordionItem value={tool.id} key={tool.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-3">
                                            <tool.icon className="h-5 w-5 text-primary" />
                                            <span className="text-lg font-semibold">{tool.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        {tool.component}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
             </Accordion>

            <Tabs defaultValue="pricing" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                    <TabsTrigger value="pos-products">POS Products</TabsTrigger>
                    <TabsTrigger value="costing">Market Rates</TabsTrigger>
                </TabsList>
                <TabsContent value="pricing" className="mt-6">
                <PricingTable initialPricing={initialPricing} />
                </TabsContent>
                <TabsContent value="pos-products" className="mt-6">
                    <PosProductTable initialProducts={initialPosProducts} />
                </TabsContent>
                <TabsContent value="costing" className="mt-6">
                    <CostSettingsTable initialRates={initialCostSettings} />
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
