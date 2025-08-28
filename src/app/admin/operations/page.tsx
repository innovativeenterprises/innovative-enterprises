
'use client';

import { useState, useEffect } from 'react';
import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import TrainingForm from "@/app/admin/operations/training-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import CouponGenerator from "@/app/admin/operations/coupon-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, BrainCircuit, NotebookText, Ticket } from "lucide-react";


export default function AdminOperationsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'training', title: 'AI Training Center', icon: BrainCircuit, component: <TrainingForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
    { id: 'coupon', title: 'Coupon Generator', icon: Ticket, component: <CouponGenerator /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                A suite of internal AI tools to enhance business operations.
            </p>
        </div>
        
        <div className="pt-8">
           <h2 className="text-2xl font-bold mb-4">Internal AI Tools</h2>
            <Accordion type="single" collapsible className="w-full" defaultValue="pro">
              {internalTools.map(tool => (
                 <AccordionItem value={tool.id} key={tool.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                            <tool.icon className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">{tool.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {tool.component}
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
    </div>
  );
}
