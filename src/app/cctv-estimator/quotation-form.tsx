
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateIctProposal } from '@/ai/flows/cctv-quotation';
import type { IctProposalOutput, IctProposalInput } from '@/ai/flows/cctv-quotation.schema';
import { analyzeWorkOrder } from '@/ai/flows/work-order-analysis';
import type { Opportunity } from '@/lib/opportunities';
import { useOpportunitiesData } from '@/app/admin/opportunity-table';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, Info, ClipboardCheck, CircleDollarSign, Camera, FileText, Server, Laptop, Cpu, Users, Building, Download, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const FormSchema = z.object({
  projectName: z.string().min(3, "Project name, institution ID, or event name is required."),
  projectType: z.enum([
    'Temporary Office Setup',
    'Training Program or Workshop',
    'Special Event (e.g., conference, hackathon)',
    'Short-term Project (e.g., data analysis, software dev)',
    'Hardware Evaluation or Testing',
    'Other'
  ]),
  numberOfUsers: z.coerce.number().min(1, "Please specify the number of users/attendees."),
  rentalPeriod: z.enum(['daily', 'weekly', 'monthly', 'annually']),
  projectDuration: z.coerce.number().min(1, "Duration must be at least 1."),
  primaryGoal: z.string().min(10, "Please briefly describe the main goal."),
  
  includeSurveillance: z.boolean().default(false),
  surveillanceDetails: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions to proceed." }),
});


type FormValues = z.infer<typeof FormSchema>;

type PageState = 'form' | 'loading' | 'result';

export default function QuotationForm() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [isPosting, setIsPosting] = useState(false);
  const [response, setResponse] = useState<IctProposalOutput | null>(null);
  const { toast } = useToast();
  const { setOpportunities } = useOpportunitiesData();
  const router = useRouter();


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: '',
      projectType: 'Temporary Office Setup',
      numberOfUsers: 10,
      rentalPeriod: 'monthly',
      projectDuration: 3,
      primaryGoal: '',
      includeSurveillance: false,
      surveillanceDetails: '',
      termsAccepted: false,
    },
  });

  // Convert various durations to months for the AI flow
  const getDurationInMonths = (duration: number, period: 'daily' | 'weekly' | 'monthly' | 'annually') => {
      switch(period) {
          case 'daily': return duration / 30;
          case 'weekly': return duration / 4;
          case 'monthly': return duration;
          case 'annually': return duration * 12;
          default: return duration;
      }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setResponse(null);
    try {
      const durationInMonths = getDurationInMonths(data.projectDuration, data.rentalPeriod);
      const result = await generateIctProposal({
          ...data,
          projectDurationMonths: durationInMonths,
      });
      setResponse(result);
      setPageState('result');
      toast({
        title: 'Proposal Generated!',
        description: 'Your custom ICT proposal is ready for review.',
      });
    } catch (error) {
      console.error(error);
      setPageState('form');
      toast({
        title: 'Error Generating Proposal',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePostAsWorkOrder = async () => {
    if (!response) return;

    setIsPosting(true);
    toast({ title: 'Posting Work Order...', description: 'Please wait while we convert your proposal into an opportunity.' });

    try {
        const workOrderAnalysis = await analyzeWorkOrder({
            title: response.proposalTitle,
            description: response.executiveSummary,
            budget: `Approx. OMR ${response.totalEstimatedCost.toFixed(2)}`,
            timeline: `${form.getValues('projectDuration')} ${form.getValues('rentalPeriod')}`,
        });
        
        const newOpportunity: Opportunity = {
            id: `ICT-${Date.now()}`,
            title: response.proposalTitle,
            type: workOrderAnalysis.category,
            prize: `OMR ${response.totalEstimatedCost.toFixed(2)}`,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: workOrderAnalysis.summary,
            iconName: 'Server',
            badgeVariant: 'outline',
            status: 'Open',
        };

        setOpportunities(prev => [newOpportunity, ...prev]);
        
        toast({
            title: 'Work Order Posted!',
            description: 'Your project is now listed in our opportunities network.',
            variant: 'default',
            duration: 9000,
            action: (
                <Button variant="outline" size="sm" asChild>
                  <a href="/opportunities">View Opportunities</a>
                </Button>
            ),
        });

        router.push('/opportunities');

    } catch (error) {
        console.error("Failed to post work order:", error);
        toast({
            title: 'Posting Failed',
            description: 'There was an error posting your work order. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsPosting(false);
    }
  };

  const handleDownloadTerms = () => {
    // This is a placeholder for a real document.
    const termsContent = `
# INFRARENT - RENTAL AGREEMENT & TERMS OF SERVICE

**Last Updated: ${new Date().toLocaleDateString()}**

This document constitutes a binding agreement between you ("the Client") and Innovative Enterprises ("the Company") for the rental of IT equipment ("Assets").

## 1. Rental Period
The rental period begins on the date of delivery and continues for the duration specified in the proposal.

## 2. Client Responsibilities
- The Client is responsible for the safekeeping and proper use of all rented Assets.
- Any loss or damage to the Assets due to negligence, misuse, or theft will be billed to the Client at full replacement cost.
- The Client agrees not to perform any unauthorized repairs, modifications, or alterations to the Assets.

## 3. Liability
The Company is not liable for any data loss, business interruption, or consequential damages arising from the use or failure of the rented Assets. The Client is responsible for their own data backup and disaster recovery planning.

## 4. Return of Assets
All Assets must be returned in the same condition as they were received, barring normal wear and tear, at the end of the rental period.

By checking the "Accept Terms & Conditions" box, you acknowledge that you have read, understood, and agreed to these terms.
    `;
    const element = document.createElement("a");
    const file = new Blob([termsContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "InfraRent_Terms_and_Conditions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  if (pageState === 'loading') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">Designing Your Solution...</CardTitle>
              <CardDescription>Our AI Solutions Architect is analyzing your requirements to build the perfect technology package. This may take a moment.</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pageState === 'result' && response) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{response.proposalTitle}</CardTitle>
              <CardDescription>Generated Proposal ID: <span className="font-mono">{response.proposalId}</span></CardDescription>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-primary">OMR {response.totalEstimatedCost.toFixed(2)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <ClipboardCheck className="h-4 w-4" />
            <AlertTitle>Executive Summary</AlertTitle>
            <AlertDescription>{response.executiveSummary}</AlertDescription>
          </Alert>

            {response.recommendedAssets.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended IT Rental Package</h3>
                    <div className="space-y-4">
                        {response.recommendedAssets.map(asset => (
                            <Card key={asset.id} className="flex items-start gap-4 p-3 bg-muted/50">
                                <Image src={asset.image} alt={asset.name} width={60} height={60} className="rounded-md object-cover" />
                                <div className="space-y-1 flex-grow">
                                    <div className="flex justify-between">
                                      <p className="font-semibold text-sm">{asset.name}</p>
                                      <p className="font-bold text-base text-primary">x {asset.quantity}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{asset.specs}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">/mo each</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            {response.surveillanceSystem.equipmentList.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Proposed Surveillance System (Purchase)</h3>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price (OMR)</TableHead>
                        <TableHead className="text-right">Total (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.surveillanceSystem.equipmentList.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.item}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            )}
          
          <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertTitle>Next Steps</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">{response.nextSteps}</AlertDescription>
          </Alert>

        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={() => { setResponse(null); setPageState('form'); }} variant="outline" className="w-full sm:w-auto">Request a New Proposal</Button>
          <Button onClick={handlePostAsWorkOrder} className="w-full sm:w-auto flex-grow" disabled={isPosting}>
            {isPosting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
            ) : (
                <><CircleDollarSign className="mr-2 h-4 w-4" /> Approve & Post as Work Order</>
            )}
            </Button>
        </CardFooter>
      </Card>
    )
  }

  const watchIncludeSurveillance = form.watch('includeSurveillance');

  return (
    <Card>
      <CardHeader>
        <CardTitle>New ICT & Surveillance Proposal Request</CardTitle>
        <CardDescription>Describe your project, and our AI will design a complete technology package for you.</CardDescription>
        <div className="pt-2">
            <Link href="/surveillance-estimator" className="text-sm text-primary hover:underline">
               Looking only for a surveillance system? Click here for our dedicated estimator.
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem><FormLabel>Project / Event / Institution Name</FormLabel><FormControl><Input placeholder="e.g., 'Q4 Sales Kickoff' or 'Partner ID: 12345'" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

             <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="projectType" render={({ field }) => (
                    <FormItem><FormLabel>Project Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Temporary Office Setup">Temporary Office Setup</SelectItem>
                        <SelectItem value="Training Program or Workshop">Training Program or Workshop</SelectItem>
                        <SelectItem value="Special Event (e.g., conference, hackathon)">Special Event</SelectItem>
                        <SelectItem value="Short-term Project (e.g., data analysis, software dev)">Short-term Project</SelectItem>
                        <SelectItem value="Hardware Evaluation or Testing">Hardware Evaluation/Testing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="numberOfUsers" render={({ field }) => (
                    <FormItem><FormLabel>Number of Attendees / Users</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="rentalPeriod" render={({ field }) => (
                    <FormItem><FormLabel>Rental Period</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="projectDuration" render={({ field }) => (
                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>


            <FormField control={form.control} name="primaryGoal" render={({ field }) => (
                <FormItem>
                    <FormLabel>Primary Goal / Task Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe what the users will be doing. e.g., 'Users will be running data analysis software that requires powerful machines.' or 'We need a reliable network for a 3-day conference with 200 attendees.'" {...field} /></FormControl>
                    <FormDescription>The more detail you provide, the better the AI's recommendation will be.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            
             <FormField
              control={form.control}
              name="includeSurveillance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Surveillance System?</FormLabel>
                    <FormDescription>
                      Add a one-time purchase CCTV system to your proposal.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchIncludeSurveillance && (
                 <FormField control={form.control} name="surveillanceDetails" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Surveillance Requirements (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Describe your security needs. e.g., 'Cover all entrances and the main event hall. Night vision is required for external doors.'" {...field} /></FormControl>
                        <FormDescription>If left blank, the AI will design a standard security package based on your project type.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Terms & Conditions</CardTitle>
                </CardHeader>
                 <CardContent>
                    <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                I have read and agree to the Rental Agreement and Terms of Service.
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                    />
                 </CardContent>
                 <CardFooter>
                      <Button type="button" variant="outline" onClick={handleDownloadTerms}>
                        <Download className="mr-2 h-4 w-4" /> Download Terms & Conditions
                    </Button>
                 </CardFooter>
            </Card>


            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                <Sparkles className="mr-2 h-4 w-4" /> Get AI Proposal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
