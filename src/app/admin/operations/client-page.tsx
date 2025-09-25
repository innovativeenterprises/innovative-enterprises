
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserRoundCheck, FileText, NotebookText, Ticket, Scale, Bot, Sparkles, Loader2, Route, MapPin, ListChecks } from "lucide-react";
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
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { GenerateTenderResponseInputSchema, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant.schema';
import { analyzeMeeting } from '@/ai/flows/meeting-analysis';
import type { MeetingAnalysisOutput } from '@/ai/flows/meeting-analysis.schema';
import { generateCouponCode } from '@/ai/flows/coupon-generator';
import { CouponGeneratorInputSchema, type CouponGeneratorOutput } from '@/ai/flows/coupon-generator.schema';
import { fileToDataURI } from '@/lib/utils';
import { analyzeProTask, type ProTaskAnalysisOutput, ProTaskAnalysisInputSchema } from '@/ai/flows/pro-task-analysis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { OMAN_GOVERNORATES } from '@/lib/oman-locations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { analyzeSanadTask } from '@/ai/flows/sanad-task-analysis';
import type { SanadTaskAnalysisOutput } from '@/ai/flows/sanad-task-analysis.schema';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


// --- ProForm Component Logic ---
const DummyMap = ({ onLocationSelect }: { onLocationSelect: (loc: { lat: number, lon: number, name: string }) => void }) => (
    <div 
        className="h-64 w-full bg-muted rounded-lg flex items-center justify-center border-dashed border-2 cursor-pointer"
        onClick={() => onLocationSelect({ lat: 23.5518, lon: 58.5024, name: 'Al Amerat Office' })}
    >
        <p className="text-muted-foreground text-center">
            <MapPin className="mx-auto h-8 w-8 mb-2"/>
            Click to select start location on map<br/>(Using Al Amerat as default)
        </p>
    </div>
);

const ProTaskFormSchema = ProTaskAnalysisInputSchema.extend({
    serviceName: z.string().min(1, "Please select a service."),
});
type ProTaskFormValues = z.infer<typeof ProTaskFormSchema>;

function ProForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SanadTaskAnalysisOutput | null>(null);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ProTaskFormValues>({
    resolver: zodResolver(ProTaskFormSchema),
    defaultValues: {
      governorate: 'Muscat',
      serviceName: '',
    },
  });

  const handleServiceChange = async (serviceName: string) => {
    if (!serviceName) {
        setAnalysisResult(null);
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeSanadTask({ serviceName });
        setAnalysisResult(result);
    } catch(e) {
        toast({ title: "Analysis Failed", description: "Could not get details for this service.", variant: "destructive"});
    } finally {
        setIsAnalyzing(false);
    }
  }

  const onSubmit: SubmitHandler<ProTaskFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeProTask(data);
      setResponse(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your PRO task has been analyzed and costs estimated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: { lat: number, lon: number, name: string }) => {
    form.setValue('startLocationCoords', { lat: location.lat, lon: location.lon });
    form.setValue('startLocationName', location.name);
    toast({ title: 'Location Selected', description: `${"'" + location.name + "'"} set as the starting point.` });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>PRO Task Delegation</CardTitle>
          <CardDescription>Select the service required, and our AI will plan the optimal route, estimate allowances, and list required documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField
                        control={form.control}
                        name="serviceName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Service</FormLabel>
                                <Select onValueChange={(value) => { field.onChange(value); handleServiceChange(value); }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a government service..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(sanadServiceGroups).map(([group, services]) => (
                                            <SelectGroup key={group}>
                                                <SelectLabel>{group}</SelectLabel>
                                                {services.map(service => (
                                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="governorate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Governorate</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a governorate..." /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {OMAN_GOVERNORATES.map(gov => (
                                            <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div>
                            <FormLabel>Start Location</FormLabel>
                            <DummyMap onLocationSelect={handleLocationSelect} />
                        </div>
                    </div>
                </div>

                 {(isAnalyzing || analysisResult) && (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Bot className="w-6 h-6 text-primary"/>
                            <CardTitle className="text-lg">Agent Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isAnalyzing && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing service requirements...</div>}
                            {analysisResult && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2"><ListChecks /> Required Documents:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {analysisResult.documentList.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                    {analysisResult.notes && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Important Notes:</h4>
                                            <p className="text-muted-foreground italic">{analysisResult.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}


              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Analyze Task & Estimate Costs</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Fahim is planning the route and estimating costs...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Task Analysis & Cost Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Route className="h-5 w-5"/> Trip Plan</h3>
                <p className="text-sm text-muted-foreground">{response.tripDescription}</p>
                 {response.unmappedLocations && response.unmappedLocations.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertTitle>Unmapped Locations</AlertTitle>
                        <AlertDescription>Could not find GPS data for: {response.unmappedLocations.join(', ')}. These locations were not included in the distance calculation.</AlertDescription>
                    </Alert>
                )}
             </div>
             <div>
                <h3 className="font-semibold mb-2">Estimated Allowances</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Allowance</TableHead>
                        <TableHead className="text-right">Amount (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.allowances.map((allowance, index) => (
                        <TableRow key={index}>
                            <TableCell>{allowance.description}</TableCell>
                            <TableCell className="text-right font-medium">{allowance.amount.toFixed(3)}</TableCell>
                        </TableRow>
                        ))}
                         <TableRow className="bg-muted font-bold">
                            <TableCell>Grand Total</TableCell>
                            <TableCell className="text-right text-base text-primary">{response.grandTotal.toFixed(3)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
             </div>
          </CardContent>
           <CardFooter>
                <Button className="w-full" disabled>Assign to PRO Agent</Button>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}


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

