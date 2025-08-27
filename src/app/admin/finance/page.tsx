
'use client';

import CfoDashboard from "@/app/cfo/cfo-dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield } from "lucide-react";


export default function AdminFinancePage() {
  return (
    <div className="space-y-8">
        <CfoDashboard />
    </div>
  );
}
