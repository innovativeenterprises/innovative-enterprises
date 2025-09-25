
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Route, MapPin, ListChecks, FileText, Bot, NotebookText, Ticket, Scale, Copy, Download, Mail } from 'lucide-react';
import { analyzeProTask, type ProTaskAnalysisOutput, ProTaskAnalysisInputSchema } from '@/ai/flows/pro-task-analysis';
import { generateTenderResponse, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant';
import { GenerateTenderResponseInputSchema } from '@/ai/flows/tender-response-assistant.schema';
import { analyzeMeeting, type MeetingAnalysisOutput } from '@/ai/flows/meeting-analysis';
import { CouponGeneratorInputSchema, type CouponGeneratorOutput } from '@/ai/flows/coupon-generator.schema';
import { generateCouponCode } from '@/ai/flows/coupon-generator';
import { AssetRentalInquiryInputSchema, type AssetRentalInquiryInput, type AssetRentalProposalOutput } from '@/ai/flows/asset-rental-agent.schema';
import { generateAssetRentalProposal } from '@/ai/flows/asset-rental-agent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { analyzeSanadTask } from '@/ai/flows/sanad-task-analysis';
import type { SanadTaskAnalysisOutput } from '@/ai/flows/sanad-task-analysis.schema';
import { OMAN_GOVERNORATES } from '@/lib/oman-locations';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from 'next/image';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { UserRoundCheck } from "lucide-react";
import { fileToDataURI } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// --- PRO Task Delegation Form ---
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
const ProTaskFormSchema = ProTaskAnalysisInputSchema.extend({ serviceName: z.string().min(1, "Please select a service.") });
type ProTaskFormValues = z.infer<typeof ProTaskFormSchema>;
const ProForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SanadTaskAnalysisOutput | null>(null);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ProTaskFormValues>({
    resolver: zodResolver(ProTaskFormSchema),
    defaultValues: { governorate: 'Muscat', serviceName: '' },
  });

  const handleServiceChange = async (serviceName: string) => {
    if (!serviceName) { setAnalysisResult(null); return; }
    setIsAnalyzing(true); setAnalysisResult(null);
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
    setIsLoading(true); setResponse(null);
    try {
      const result = await analyzeProTask(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your PRO task has been analyzed and costs estimated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze the task. Please try again.', variant: 'destructive' });
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
          <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField control={form.control} name="serviceName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Service</FormLabel>
                                <Select onValueChange={(value) => { field.onChange(value); handleServiceChange(value); }} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Choose a government service..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {Object.entries(sanadServiceGroups).map(([group, services]) => (
                                            <SelectGroup key={group}><SelectLabel>{group}</SelectLabel>{services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}</SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-6">
                        <FormField control={form.control} name="governorate" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Governorate</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a governorate..." /></SelectTrigger></FormControl>
                                    <SelectContent>{OMAN_GOVERNORATES.map(gov => <SelectItem key={gov} value={gov}>{gov}</SelectItem>)}</SelectContent>
                                </Select><FormMessage />
                                </FormItem>
                            )}
                        />
                         <div><FormLabel>Start Location</FormLabel><DummyMap onLocationSelect={handleLocationSelect} /></div>
                    </div>
                </div>
                {(isAnalyzing || analysisResult) && (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0"><Bot className="w-6 h-6 text-primary"/><CardTitle className="text-lg">Agent Analysis</CardTitle></CardHeader>
                        <CardContent>
                            {isAnalyzing && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing service requirements...</div>}
                            {analysisResult && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2"><ListChecks /> Required Documents:</h4>
                                        <ul className="list-disc pl-5 space-y-1">{analysisResult.documentList.map((doc, i) => <li key={i}>{doc}</li>)}</ul>
                                    </div>
                                    {analysisResult.notes && (<div><h4 className="font-semibold mb-2">Important Notes:</h4><p className="text-muted-foreground italic">{analysisResult.notes}</p></div>)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Task & Estimate Costs</>}
              </Button>
            </form></Form>
        </CardContent>
      </Card>
      {isLoading && (<Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Fahim is planning the route and estimating costs...</p></CardContent></Card>)}
      {response && (
        <Card className="mt-8">
          <CardHeader><CardTitle>Task Analysis & Cost Estimate</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Route className="h-5 w-5"/> Trip Plan</h3>
                <p className="text-sm text-muted-foreground">{response.tripDescription}</p>
                 {response.unmappedLocations && response.unmappedLocations.length > 0 && (<Alert variant="destructive" className="mt-2"><AlertTitle>Unmapped Locations</AlertTitle><AlertDescription>Could not find GPS data for: {response.unmappedLocations.join(', ')}. These locations were not included in the distance calculation.</AlertDescription></Alert>)}
             </div>
             <div>
                <h3 className="font-semibold mb-2">Estimated Allowances</h3>
                 <Table><TableHeader><TableRow><TableHead>Allowance</TableHead><TableHead className="text-right">Amount (OMR)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {response.allowances.map((allowance, index) => (<TableRow key={index}><TableCell>{allowance.description}</TableCell><TableCell className="text-right font-medium">{allowance.amount.toFixed(3)}</TableCell></TableRow>))}
                         <TableRow className="bg-muted font-bold"><TableCell>Grand Total</TableCell><TableCell className="text-right text-base text-primary">{response.grandTotal.toFixed(3)}</TableCell></TableRow>
                    </TableBody>
                </Table>
             </div>
          </CardContent>
           <CardFooter><Button className="w-full" disabled>Assign to PRO Agent</Button></CardFooter>
        </Card>
      )}
    </div>
  );
}

// --- Tender Response Assistant ---
const TenderFormSchema = GenerateTenderResponseInputSchema.extend({ documentFiles: z.any().refine(files => files?.length > 0, 'At least one tender document is required.') });
type TenderFormValues = z.infer<typeof TenderFormSchema>;
const TenderForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTenderResponseOutput | null>(null);
  const { toast } = useToast();
  const form = useForm<TenderFormValues>({ resolver: zodResolver(TenderFormSchema), defaultValues: { projectRequirements: '', companyName: 'Innovative Enterprises' } });

  const onSubmit: SubmitHandler<TenderFormValues> = async (data) => {
    setIsLoading(true); setResponse(null);
    try {
      const documentPromises = Array.from(data.documentFiles as FileList).map(fileToDataURI);
      const tenderDocuments = await Promise.all(documentPromises);
      const result = await generateTenderResponse({ tenderDocuments, ...data });
      setResponse(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate tender response. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => { if (response) { navigator.clipboard.writeText(response.draftResponse); toast({ title: "Copied!", description: "The draft response has been copied to your clipboard." }); } };
  const handleDownload = () => { if (response) { const element = document.createElement("a"); const file = new Blob([response.draftResponse], {type: 'text/plain'}); element.href = URL.createObjectURL(file); element.download = "tender_draft_response.txt"; document.body.appendChild(element); element.click(); document.body.removeChild(element); } };

  return (
    <div className="space-y-8">
      <Card><CardHeader><CardTitle>Tender Response Assistant</CardTitle><CardDescription>Upload the tender documents and specify the project requirements. Our AI will generate a tailored draft response.</CardDescription></CardHeader>
        <CardContent>
          <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="documentFiles" render={({ field }) => (<FormItem><FormLabel>Tender Documents</FormLabel><FormControl><Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="projectRequirements" render={({ field }) => (<FormItem><FormLabel>Project Requirements Summary</FormLabel><FormControl><Textarea placeholder="Summarize the key requirements, scope, and deliverables mentioned in the tender documents." rows={8} {...field}/></FormControl><FormMessage /></FormItem>)}/>
              <Accordion type="single" collapsible><AccordionItem value="optional-info"><AccordionTrigger><h3 className="text-lg font-semibold">Optional: Add More Details for a Better Response</h3></AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Your Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="projectName" render={({ field }) => (<FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="tenderingAuthority" render={({ field }) => (<FormItem><FormLabel>Tendering Authority</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <FormField control={form.control} name="companyOverview" render={({ field }) => (<FormItem><FormLabel>Company Overview</FormLabel><FormControl><Textarea rows={3} placeholder="e.g., A reputable construction company with X years of experience..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             <FormField control={form.control} name="relevantExperience" render={({ field }) => (<FormItem><FormLabel>Relevant Experience / Past Projects</FormLabel><FormControl><Textarea rows={3} placeholder="e.g., Successfully completed the Al-Ameen Mosque project..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             <FormField control={form.control} name="projectTeam" render={({ field }) => (<FormItem><FormLabel>Key Project Team</FormLabel><FormControl><Textarea rows={2} placeholder="e.g., John Doe (Project Manager), Jane Smith (Lead Engineer)" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="estimatedCost" render={({ field }) => (<FormItem><FormLabel>Estimated Cost (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <FormField control={form.control} name="priceValidityDays" render={({ field }) => (<FormItem><FormLabel>Price Validity (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <FormField control={form.control} name="estimatedSchedule" render={({ field }) => (<FormItem><FormLabel>Estimated Schedule</FormLabel><FormControl><Input placeholder="e.g., 6 months" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                             <FormField control={form.control} name="contactInfo" render={({ field }) => (<FormItem><FormLabel>Your Contact Information</FormLabel><FormControl><Input placeholder="e.g., John Doe, CEO, +968 1234 5678" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                      </AccordionContent>
                  </AccordionItem></Accordion>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Response...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Draft</>}</Button>
            </form></Form>
        </CardContent>
      </Card>
      {isLoading && (<Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Our AI is analyzing the tender and drafting your response...</p></CardContent></Card>)}
      {response && (<Card className="mt-8"><CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6"/> AI-Generated Draft Response</CardTitle><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button><Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button></div></CardHeader><CardContent className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md border">{response.draftResponse}</CardContent></Card>)}
    </div>
  );
}

// --- Meeting Analysis Form ---
const MeetingFormSchema = z.object({ transcript: z.string().min(50, 'Transcript must be at least 50 characters.'), participants: z.string().min(1, 'Please list at least one participant.') });
type MeetingFormValues = z.infer<typeof MeetingFormSchema>;
const MeetingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MeetingAnalysisOutput | null>(null);
  const { toast } = useToast();
  const form = useForm<MeetingFormValues>({ resolver: zodResolver(MeetingFormSchema), defaultValues: { transcript: '', participants: '' } });

  const onSubmit: SubmitHandler<MeetingFormValues> = async (data) => {
    setIsLoading(true); setResponse(null);
    try {
      const result = await analyzeMeeting(data);
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your meeting transcript has been summarized.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to analyze the meeting transcript. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card><CardHeader><CardTitle>Meeting Transcript Analysis</CardTitle><CardDescription>Paste your meeting transcript below. Our AI will generate a summary, list discussion points, and extract action items.</CardDescription></CardHeader>
        <CardContent>
          <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="participants" render={({ field }) => (<FormItem><FormLabel>Participants</FormLabel><FormControl><Input placeholder="e.g., Jumaa Al Hadidi, Anwar Ahmed, Huda Al Salmi" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="transcript" render={({ field }) => (<FormItem><FormLabel>Meeting Transcript</FormLabel><FormControl><Textarea placeholder="Paste the full meeting transcript here..." rows={12} {...field}/></FormControl><FormMessage /></FormItem>)}/>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Meeting</>}</Button>
            </form></Form>
        </CardContent>
      </Card>
      {isLoading && (<Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Our AI is analyzing your meeting... This may take a moment.</p></CardContent></Card>)}
      {response && (<Card className="mt-8"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6"/> Meeting Summary: {response.title}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold flex items-center gap-2 mb-2"><ListChecks className="h-5 w-5"/> Key Discussion Points</h3><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{response.discussionPoints.map((point, index) => <li key={index}>{point}</li>)}</ul></div>
             <div><h3 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle className="h-5 w-5"/> Decisions Made</h3><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{response.decisionsMade.map((decision, index) => <li key={index}>{decision}</li>)}</ul></div>
             <div><h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5"/> Action Items</h3><ul className="space-y-2 text-sm">{response.actionItems.map((item, index) => (<li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-muted rounded-md"><span>{item.task}</span><div className="flex items-center gap-4"><Badge variant="secondary" className="flex items-center gap-1"><Users className="h-3 w-3"/>{item.assignee}</Badge>{item.dueDate && <Badge variant="outline" className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{item.dueDate}</Badge>}</div></li>))}</ul></div>
          </CardContent></Card>)}
    </div>
  );
}

// --- Coupon Generator ---
const CouponFormSchema = z.object({ description: z.string().min(5, "Please describe the promotion."), discountType: z.enum(['percentage', 'fixed'], { required_error: "You need to select a discount type." }), discountValue: z.coerce.number().positive("Discount value must be positive."), usageLimit: z.coerce.number().optional() });
type CouponFormValues = z.infer<typeof CouponFormSchema>;
interface GeneratedCoupon extends CouponFormValues { code: string; }
const CouponGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<GeneratedCoupon | null>(null);
  const { toast } = useToast();
  const form = useForm<CouponFormValues>({ resolver: zodResolver(CouponFormSchema), defaultValues: { discountType: 'percentage', discountValue: 10 } });

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    setIsLoading(true); setGeneratedCoupon(null);
    try {
      const result = await generateCouponCode(data);
      setGeneratedCoupon({ ...data, code: result.couponCode });
      toast({ title: 'Coupon Generated!', description: `Your new code "${result.couponCode}" has been created.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate coupon code. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyCode = () => { if (generatedCoupon) { navigator.clipboard.writeText(generatedCoupon.code); toast({ title: 'Copied!', description: `Coupon code "${generatedCoupon.code}" copied to clipboard.`}); } };

  return (
    <div className="space-y-8">
      <Card><CardHeader><CardTitle>Coupon Code Generator</CardTitle><CardDescription>Create a new promotional coupon code for your customers.</CardDescription></CardHeader>
        <CardContent>
          <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Promotion Description</FormLabel><FormControl><Input placeholder="e.g., 'Summer Sale 2024' or 'New User Welcome Offer'" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="discountType" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Discount Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="percentage" /></FormControl><FormLabel className="font-normal">Percentage (%)</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="fixed" /></FormControl><FormLabel className="font-normal">Fixed Amount (OMR)</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)}/>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="discountValue" render={({ field }) => (<FormItem><FormLabel>Discount Value</FormLabel><FormControl><Input type="number" placeholder="e.g., 25 or 10.50" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="usageLimit" render={({ field }) => (<FormItem><FormLabel>Usage Limit (Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Code...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Coupon</>}</Button>
            </form></Form>
        </CardContent>
      </Card>
      {isLoading && (<Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Mira is thinking of a catchy code...</p></CardContent></Card>)}
      {generatedCoupon && (<Card className="mt-8"><CardHeader><CardTitle>New Coupon Created!</CardTitle><CardDescription>Share this code with your customers. It is now active.</CardDescription></CardHeader><CardContent><Alert><Ticket className="h-4 w-4"/><AlertTitle className="flex justify-between items-center"><div className="flex items-end gap-2"><span className="text-2xl font-bold tracking-widest font-mono text-primary">{generatedCoupon.code}</span><span className="text-sm text-muted-foreground pb-1">({generatedCoupon.description})</span></div><Button variant="outline" size="sm" onClick={handleCopyCode}><Copy className="mr-2 h-4 w-4"/> Copy Code</Button></AlertTitle><AlertDescription className="mt-4 grid grid-cols-2 gap-2"><div><p className="font-semibold">Discount</p><p>{generatedCoupon.discountValue}{generatedCoupon.discountType === 'percentage' ? '%' : ' OMR'}</p></div><div><p className="font-semibold">Usage Limit</p><p>{generatedCoupon.usageLimit || 'Unlimited'}</p></div></AlertDescription></AlertContent></Card>)}
    </div>
  );
}


// --- Asset Rental Agent Form ---
const AssetRentalAgentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssetRentalProposalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AssetRentalInquiryInput>({
    resolver: zodResolver(AssetRentalInquiryInputSchema),
    defaultValues: { projectName: '', purposeOfRental: 'Construction Project', numberOfWorkers: 10, existingInfrastructure: '', missingComponents: '', rentalDurationMonths: 1, budget: undefined },
  });

  const onSubmit: SubmitHandler<AssetRentalInquiryInput> = async (data) => {
    setIsLoading(true); setResponse(null);
    try {
      const result = await generateAssetRentalProposal(data);
      setResponse(result);
      toast({ title: 'Proposal Generated!', description: 'Your custom infrastructure proposal is ready for review.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error Generating Proposal', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadAgreement = () => { if (!response?.serviceAgreement) return; const doc = new jsPDF(); doc.text(response.serviceAgreement, 10, 10); doc.save("Service-Agreement.pdf"); };

  if (isLoading) return <Card><CardContent className="p-10 text-center"><div className="flex flex-col items-center gap-6"><Loader2 className="h-12 w-12 text-primary animate-spin" /><div className="space-y-2"><CardTitle className="text-2xl">Designing Your Solution...</CardTitle><CardDescription>Our AI Architect is analyzing your requirements to build the perfect package.</CardDescription></div></div></CardContent></Card>;
  
  if (response) return (
         <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4"><CheckCircle className="h-12 w-12 text-green-500" /></div>
                <CardTitle className="text-2xl">{response.proposalTitle}</CardTitle><CardDescription>{response.executiveSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"><div><h3 className="text-lg font-semibold mb-2">Recommended Hardware Package</h3><div className="space-y-4">
                        {response.recommendedAssets.map(asset => (
                            <Card key={asset.id} className="flex items-start gap-4 p-4">
                                <Image src={asset.image} alt={asset.name} width={80} height={80} className="rounded-md object-cover" />
                                <div className="space-y-1 flex-grow"><div className="flex justify-between"><p className="font-semibold">{asset.name}</p><p className="font-bold text-lg text-primary">x {asset.quantity}</p></div><Badge variant="outline">{asset.type}</Badge><p className="text-xs text-muted-foreground">{asset.specs}</p></div>
                                <div className="text-right"><p className="text-sm font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p><p className="text-xs text-muted-foreground">/mo per unit</p></div>
                            </Card>
                        ))}</div></div>
                <div className="p-4 rounded-md border bg-muted/50 flex justify-between items-center"><span className="text-muted-foreground font-semibold">Total Estimated Monthly Cost</span><span className="text-2xl font-bold text-primary">OMR {response.totalMonthlyCost.toFixed(2)}</span></div>
                <div><h3 className="text-lg font-semibold mb-2">Draft Service Agreement</h3><div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-80 overflow-y-auto">{response.serviceAgreement}</div></div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={() => setResponse(null)} className="w-full sm:w-auto">Request a New Proposal</Button>
                    <div className="flex gap-2"><Button variant="outline" onClick={handleDownloadAgreement}><Download className="mr-2 h-4 w-4"/> Download Agreement</Button><Button asChild><Link href="/partner"><Mail className="mr-2 h-4 w-4"/> Accept & Proceed</Link></Button></div>
                 </div>
            </CardFooter>
        </Card>
      );

  return (
    <Card>
      <CardHeader><CardTitle>AI-Powered Rental Proposal Generator</CardTitle><CardDescription>Describe your project, and our AI will recommend a complete rental package.</CardDescription></CardHeader>
      <CardContent>
        <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="projectName" render={({ field }) => (<FormItem><FormLabel>Project or Event Name</FormLabel><FormControl><Input placeholder="e.g., Al Amerat Villa Construction" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="purposeOfRental" render={({ field }) => (<FormItem><FormLabel>Purpose of Rental</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Construction Project">Construction Project</SelectItem><SelectItem value="Temporary Office Setup">Temporary Office Setup</SelectItem><SelectItem value="Training Program or Workshop">Training Program or Workshop</SelectItem><SelectItem value="Special Event">Special Event</SelectItem><SelectItem value="Short-term Project">Short-term Project</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="numberOfWorkers" render={({ field }) => (<FormItem><FormLabel>Number of Workers / Users</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            </div>
            <FormField control={form.control} name="existingInfrastructure" render={({ field }) => (<FormItem><FormLabel>Existing Infrastructure (Optional)</FormLabel><FormControl><Textarea placeholder="List any equipment you already have available, e.g., 'We have our own power generator and safety gear.'" {...field} /></FormControl><FormDescription>This helps the AI avoid recommending items you don't need.</FormDescription><FormMessage /></FormItem>)}/>
             <FormField control={form.control} name="missingComponents" render={({ field }) => (<FormItem><FormLabel>Specific Required Components (Optional)</FormLabel><FormControl><Textarea placeholder="If you know exactly what you need, list it here. e.g., 'We need one 20-ton excavator and two pickup trucks.'" {...field} /></FormControl><FormDescription>Provide this if you have specific hardware in mind.</FormDescription><FormMessage /></FormItem>)}/>
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="rentalDurationMonths" render={({ field }) => (<FormItem><FormLabel>Rental Duration (Months)</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                 <FormField control={form.control} name="budget" render={({ field }) => (<FormItem><FormLabel>Estimated Monthly Budget (OMR, Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Proposal</>}</Button>
          </form></Form>
      </CardContent>
    </Card>
  );
};


export default function AdminOperationsClientPage() {

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
                A suite of internal AI tools and configurations to enhance business operations.
            </p>
        </div>

        <Tabs defaultValue="ai-tools" className="w-full">
             <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="ai-tools">AI Tools & Generators</TabsTrigger>
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
        </Tabs>
    </div>
  );
}

    