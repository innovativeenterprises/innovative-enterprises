
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProForm from "@/app/admin/operations/pro-form";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, FileUp } from 'lucide-react';
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { GenerateTenderResponseInputSchema, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant.schema';
import { analyzeMeeting } from '@/ai/flows/meeting-analysis';
import type { MeetingAnalysisOutput } from '@/ai/flows/meeting-analysis.schema';
import { generateCouponCode } from '@/ai/flows/coupon-generator';
import { CouponGeneratorInputSchema, type CouponGeneratorOutput } from '@/ai/flows/coupon-generator.schema';
import { fileToDataURI } from '@/lib/utils';


// --- TenderForm Component Logic ---
const TenderFormSchema = GenerateTenderResponseInputSchema.extend({
    tenderFiles: z.any().refine(files => files?.length > 0, 'At least one tender document is required.'),
});
type TenderFormValues = z.infer<typeof TenderFormSchema>;

function TenderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTenderResponseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<TenderFormValues>({
    resolver: zodResolver(TenderFormSchema),
  });

  const onSubmit: SubmitHandler<TenderFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const documentPromises = Array.from(data.tenderFiles as FileList).map(fileToDataURI);
      const tenderDocuments = await Promise.all(documentPromises);
      
      const result = await generateTenderResponse({ ...data, tenderDocuments });
      setResponse(result);
      toast({ title: 'Draft Generated!', description: 'Your tender response draft is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate tender response.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tender Response Assistant</CardTitle>
          <CardDescription>Upload tender documents and provide your company details. The AI will generate a comprehensive draft response.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="tenderFiles" render={({ field }) => (
                <FormItem><FormLabel>Tender Documents</FormLabel><FormControl><Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Your Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : 'Generate Draft Response'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {response && (
        <Card>
          <CardHeader><CardTitle>Generated Tender Response</CardTitle></CardHeader>
          <CardContent className="prose prose-sm max-w-full dark:prose-invert whitespace-pre-wrap">{response.draftResponse}</CardContent>
        </Card>
      )}
    </div>
  );
}

// --- MeetingForm Component Logic ---
const MeetingFormSchema = z.object({
  participants: z.string().min(3, "Please list at least one participant."),
  transcript: z.string().min(20, "Transcript must be at least 20 characters."),
});
type MeetingFormValues = z.infer<typeof MeetingFormSchema>;

function MeetingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MeetingAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(MeetingFormSchema),
  });

  const onSubmit: SubmitHandler<MeetingFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeMeeting(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your meeting minutes have been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze transcript.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Analysis Agent</CardTitle>
          <CardDescription>Paste a meeting transcript to automatically generate minutes of meeting and action items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="participants" render={({ field }) => (
                <FormItem><FormLabel>Participants (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="transcript" render={({ field }) => (
                <FormItem><FormLabel>Meeting Transcript</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : 'Generate Minutes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       {response && (
        <Card>
            <CardHeader><CardTitle>{response.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><h3 className="font-semibold">Summary</h3><p className="text-sm text-muted-foreground">{response.summary}</p></div>
                <div><h3 className="font-semibold">Action Items</h3>
                    <ul className="list-disc pl-5 text-sm">
                        {response.actionItems.map((item, index) => (
                            <li key={index}><strong>{item.assignee}:</strong> {item.task} {item.dueDate && `(Due: ${item.dueDate})`}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}


// --- CouponGenerator Component Logic ---
const CouponFormSchema = CouponGeneratorInputSchema;
type CouponFormValues = z.infer<typeof CouponFormSchema>;

function CouponGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CouponGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(CouponFormSchema),
  });

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateCouponCode(data);
      setResponse(result);
      toast({ title: 'Coupon Generated!', description: 'Your new coupon code is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate coupon.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 items-end">
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Promotion Description</FormLabel><FormControl><Input placeholder="e.g., 'Summer Sale'" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="discountType" render={({ field }) => (
                    <FormItem><FormLabel>Discount Type</FormLabel><FormControl><Input placeholder="Percentage or Fixed" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="discountValue" render={({ field }) => (
                    <FormItem><FormLabel>Value</FormLabel><FormControl><Input placeholder="e.g., 25 or 10OMR" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Code
            </Button>
        </form>
      </Form>
      {response && (
        <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Generated Coupon Code:</p>
            <p className="text-2xl font-bold font-mono bg-muted p-2 rounded-md inline-block">{response.couponCode}</p>
        </div>
      )}
    </div>
  );
}


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

        <Tabs defaultValue="ai-tools" className="w-full">
             <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
                <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                <TabsTrigger value="pos-products">POS Products</TabsTrigger>
                <TabsTrigger value="costing">Market Rates</TabsTrigger>
            </TabsList>
            <TabsContent value="ai-tools" className="mt-6 space-y-8">
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
                            <AccordionContent className="pt-4">
                                {tool.component}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
            </TabsContent>
            <TabsContent value="pricing" className="mt-6">
              <PricingTable initialPricing={initialPricing} />
            </TabsContent>
            <TabsContent value="pos-products" className="mt-6">
                <PosProductTable initialProducts={initialPosProducts} />
            </TabsContent>
            <TabsContent value="costing" className="mt-6 space-y-8">
                <CostSettingsTable initialRates={initialCostSettings} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
