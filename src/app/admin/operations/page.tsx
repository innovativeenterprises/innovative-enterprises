
import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, BrainCircuit, NotebookText, Ticket, Scale, Palette, Gift } from "lucide-react";
import KnowledgeTable from './knowledge-table';
import ThemeGenerator from "./theme-generator";
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';
import { initialKnowledgeBase } from "@/lib/knowledge";

export default function AdminOperationsPage() {

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
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools to enhance business operations.
            </p>
        </div>

        <ThemeGenerator />
        <KnowledgeTable initialKnowledgeBase={initialKnowledgeBase} />
        
        <div className="pt-8">
           <h2 className="text-2xl font-bold mb-4">Other Internal AI Tools</h2>
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
    </div>
  );
}

    