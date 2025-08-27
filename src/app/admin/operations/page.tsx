
'use client';

import { useState, useEffect } from 'react';
import OpportunityTable, { useOpportunitiesData } from "../opportunity-table";
import PricingTable, { usePricingData } from "../pricing-table";
import StageTable, { useProjectStagesData } from "../stage-table";
import AssetTable, { useAssetsData } from "../asset-table";
import ProForm from "@/app/admin/operations/pro-form";
import TenderForm from "@/app/admin/operations/tender-form";
import TrainingForm from "@/app/admin/operations/training-form";
import MeetingForm from "@/app/admin/operations/meeting-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, BrainCircuit, NotebookText } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


export default function AdminOperationsPage() {
  const opportunityData = useOpportunitiesData();
  const pricingData = usePricingData();
  const stageData = useProjectStagesData();
  const assetData = useAssetsData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const internalTools = [
    { id: 'pro', title: 'PRO Task Delegation', icon: UserRoundCheck, component: <ProForm /> },
    { id: 'tender', title: 'Tender Response Assistant', icon: FileText, component: <TenderForm /> },
    { id: 'training', title: 'AI Training Center', icon: BrainCircuit, component: <TrainingForm /> },
    { id: 'meeting', title: 'Online Meeting Agent', icon: NotebookText, component: <MeetingForm /> },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                Manage business operations, internal AI tools, and platform settings.
            </p>
        </div>
        <OpportunityTable {...opportunityData} />
        <PricingTable {...pricingData} />
        <StageTable {...stageData} />
        
        {isClient ? (
            <AssetTable {...assetData} />
        ) : (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="pt-8">
           <h2 className="text-2xl font-bold mb-4">Internal AI Tools</h2>
            <Accordion type="single" collapsible className="w-full">
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
