
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateIctProposal } from '@/ai/flows/cctv-quotation';
import type { IctProposalOutput, IctProposalInput } from '@/ai/flows/cctv-quotation.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, Info, ClipboardCheck, CircleDollarSign, Camera, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  projectName: z.string().min(3, "Project name is required."),
  projectType: z.enum([
    'Temporary Office Setup',
    'Training Program or Workshop',
    'Special Event (e.g., conference, hackathon)',
    'Short-term Project (e.g., data analysis, software dev)',
    'Hardware Evaluation or Testing',
    'Other'
  ]),
  surveillanceDetails: z.string().min(10, "Please describe your security needs."),
});

type FormValues = z.infer<typeof FormSchema>;

type PageState = 'form' | 'loading' | 'result';

export default function EstimatorForm() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<IctProposalOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: '',
      projectType: 'Temporary Office Setup',
      surveillanceDetails: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setResponse(null);
    try {
      const input: IctProposalInput = {
        ...data,
        numberOfUsers: 1, // Default value not relevant for surveillance only
        projectDurationMonths: 1, // Default value not relevant for surveillance only
        primaryGoal: 'Surveillance system installation', // Default value
        includeSurveillance: true, // Always true for this form
      };
      const result = await generateIctProposal(input);
      setResponse(result);
      setPageState('result');
      toast({
        title: 'Proposal Generated!',
        description: 'Your custom surveillance proposal is ready for review.',
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

  if (pageState === 'loading') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">Designing Your System...</CardTitle>
              <CardDescription>Our AI Solutions Architect is designing your surveillance system. This may take a moment.</CardDescription>
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
        <CardFooter className="justify-center">
            <Button onClick={() => { setResponse(null); setPageState('form'); }} variant="outline" className="w-full sm:w-auto">Request a New Proposal</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Surveillance Proposal Request</CardTitle>
        <CardDescription>Describe your project and security needs, and our AI will design a complete surveillance package for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="projectName" render={({ field }) => (
                  <FormItem><FormLabel>Project or Location Name</FormLabel><FormControl><Input placeholder="e.g., 'Al Khuwair Villa' or 'Sohar Warehouse'" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="projectType" render={({ field }) => (
                  <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="Temporary Office Setup">Office / Commercial Building</SelectItem>
                      <SelectItem value="Training Program or Workshop">Residential Villa / House</SelectItem>
                      <SelectItem value="Special Event (e.g., conference, hackathon)">Retail Shop / Store</SelectItem>
                      <SelectItem value="Short-term Project (e.g., data analysis, software dev)">Warehouse / Industrial</SelectItem>
                      <SelectItem value="Hardware Evaluation or Testing">School / Educational Institute</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                  </SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="surveillanceDetails" render={({ field }) => (
                <FormItem>
                    <FormLabel>Security & Surveillance Requirements</FormLabel>
                    <FormControl><Textarea placeholder="Describe your security needs. e.g., 'Cover all entrances and the main event hall. Night vision is required for external doors. We need storage for 30 days of recordings.'" {...field} rows={5} /></FormControl>
                    <FormDescription>The more detail you provide, the better the AI's recommendation will be.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
              <Sparkles className="mr-2 h-4 w-4" /> Get AI Proposal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

