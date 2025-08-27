
'use client';

import CfoDashboard from "@/app/cfo/cfo-dashboard";
import AuditForm from "@/app/financial-audit/audit-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield } from "lucide-react";


export default function AdminFinancePage() {
  return (
    <div className="space-y-8">
        <CfoDashboard />

        <div className="pt-8">
           <h2 className="text-2xl font-bold mb-4">Financial Tools</h2>
            <Accordion type="single" collapsible className="w-full">
                 <AccordionItem value="audit">
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Financial Audit Hub</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <AuditForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}
