
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateAssetRentalProposal } from '@/ai/flows/asset-rental-agent';
import { AssetRentalInquiryInputSchema, type AssetRentalInquiryInput, type AssetRentalProposalOutput } from '@/ai/flows/asset-rental-agent.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, Briefcase, Download, CheckCircle, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import jsPDF from 'jspdf';

export default function ItRentalAgentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssetRentalProposalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AssetRentalInquiryInput>({
    resolver: zodResolver(AssetRentalInquiryInputSchema),
    defaultValues: {
      projectName: '',
      purposeOfRental: 'Temporary Office Setup',
      numberOfWorkers: 10,
      existingInfrastructure: '',
      missingComponents: '',
      rentalDurationMonths: 1,
      budget: undefined,
    },
  });

  const onSubmit: SubmitHandler<AssetRentalInquiryInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateAssetRentalProposal(data);
      setResponse(result);
      toast({
        title: 'Proposal Generated!',
        description: 'Your custom infrastructure proposal is ready for review.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Proposal',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadAgreement = () => {
    if (!response?.serviceAgreement) return;
    const doc = new jsPDF();
    doc.text(response.serviceAgreement, 10, 10);
    doc.save("Service-Agreement.pdf");
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">Designing Your Solution...</CardTitle>
              <CardDescription>Our AI Architect is analyzing your requirements to build the perfect package.</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (response) {
      return (
         <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-2xl">{response.proposalTitle}</CardTitle>
                <CardDescription>{response.executiveSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended Hardware Package</h3>
                    <div className="space-y-4">
                        {response.recommendedAssets.map(asset => (
                            <Card key={asset.id} className="flex items-start gap-4 p-4">
                                <Image src={asset.image} alt={asset.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={asset.aiHint} />
                                <div className="space-y-1 flex-grow">
                                    <div className="flex justify-between">
                                      <p className="font-semibold">{asset.name}</p>
                                      <p className="font-bold text-lg text-primary">x {asset.quantity}</p>
                                    </div>
                                    <Badge variant="outline">{asset.type}</Badge>
                                    <p className="text-xs text-muted-foreground">{asset.specs}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">/mo per unit</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-md border bg-muted/50 flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Total Estimated Monthly Cost</span>
                    <span className="text-2xl font-bold text-primary">OMR {response.totalMonthlyCost.toFixed(2)}</span>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Draft Service Agreement</h3>
                    <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-80 overflow-y-auto">
                        {response.serviceAgreement}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={() => setResponse(null)} className="w-full sm:w-auto">Request a New Proposal</Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDownloadAgreement}><Download className="mr-2 h-4 w-4"/> Download Agreement</Button>
                        <Button asChild><Link href="/partner"><Mail className="mr-2 h-4 w-4"/> Accept & Proceed</Link></Button>
                    </div>
                 </div>
            </CardFooter>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Rental Proposal Generator</CardTitle>
        <CardDescription>Describe your project, and our AI will recommend a complete rental package.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem><FormLabel>Project or Event Name</FormLabel><FormControl><Input placeholder="e.g., Al Amerat Villa Construction" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="purposeOfRental" render={({ field }) => (
                    <FormItem><FormLabel>Purpose of Rental</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Construction Project">Construction Project</SelectItem>
                        <SelectItem value="Temporary Office Setup">Temporary Office Setup</SelectItem>
                        <SelectItem value="Training Program or Workshop">Training Program or Workshop</SelectItem>
                        <SelectItem value="Special Event">Special Event</SelectItem>
                        <SelectItem value="Short-term Project">Short-term Project</SelectItem>
                        <SelectItem value="Hardware Evaluation or Testing">Hardware Evaluation or Testing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="numberOfWorkers" render={({ field }) => (
                    <FormItem><FormLabel>Number of Workers / Users</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="existingInfrastructure" render={({ field }) => (
                <FormItem>
                    <FormLabel>Existing Infrastructure (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="List any equipment you already have available, e.g., 'We have our own power generator and safety gear.'" {...field} /></FormControl>
                    <FormDescription>This helps the AI avoid recommending items you don't need.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={form.control} name="missingComponents" render={({ field }) => (
                <FormItem>
                    <FormLabel>Specific Required Components (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="If you know exactly what you need, list it here. e.g., 'We need one 20-ton excavator and two pickup trucks.'" {...field} /></FormControl>
                    <FormDescription>Provide this if you have specific hardware in mind.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="rentalDurationMonths" render={({ field }) => (
                    <FormItem><FormLabel>Rental Duration (Months)</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem><FormLabel>Estimated Monthly Budget (OMR, Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Proposal</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
