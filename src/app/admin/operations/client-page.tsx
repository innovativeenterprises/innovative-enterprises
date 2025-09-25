
'use client';

import ProForm from "./pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale } from "lucide-react";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import ThemeGenerator from "./theme-generator";
import CostSettingsTable from "./cost-settings-table";
import type { CostRate } from "@/lib/cost-settings.schema";


// --- Main Operations Client Page ---
interface AdminOperationsClientPageProps {
    initialCostSettings: CostRate[];
}

export default function AdminOperationsClientPage({ 
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

            <CostSettingsTable initialRates={initialCostSettings} />
            <ThemeGenerator />
        </div>
    </div>
  );
}
