
'use client';

import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale, Facebook } from "lucide-react";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import FacebookCoverGeneratorPage from '@/app/facebook-cover-generator/page';

export default function AdminOperationsPage() {

  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
    { id: 'coupon', title: 'Coupon Generator', icon: Ticket, component: <CouponGenerator /> },
    { id: 'rental', title: 'Asset Rental Proposal Generator', icon: Scale, component: <AssetRentalAgentForm /> },
    { id: 'facebook', title: 'Facebook Cover Generator', icon: Facebook, component: <FacebookCoverGeneratorPage /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools to enhance business operations.
            </p>
        </div>

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
    </div>
  );
}
