
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCctvQuotation } from '@/ai/flows/cctv-quotation';
import type { CctvQuotationOutput, CctvQuotationInput } from '@/ai/flows/cctv-quotation.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, UploadCloud, Info, ClipboardCheck, CircleDollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  purpose: z.string().min(10, { message: "Please describe the purpose in more detail." }),
  buildingType: z.string().min(3, { message: "Building type is required." }),
  dimensions: z.string().optional(),
  floorPlan: z.any().optional(),
  coverage: z.enum(['Full Environment', 'Partial'], { required_error: "Coverage selection is required." }),
  coverageDetails: z.string().optional(),
  remoteMonitoring: z.enum(['Yes', 'No'], { required_error: "Remote monitoring selection is required." }),
  existingSystem: z.enum(['None', 'Keep Some', 'Replace All'], { required_error: "Existing system selection is required." }),
  dvrSwitchTvLocation: z.string().min(3, { message: "Please specify the location." }),
}).refine(data => data.floorPlan?.length > 0 || data.dimensions, {
    message: "Either a floor plan or building dimensions must be provided.",
    path: ["floorPlan"],
});

type FormValues = z.infer<typeof FormSchema>;

export default function QuotationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CctvQuotationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      purpose: '',
      buildingType: '',
      dimensions: '',
      coverageDetails: '',
      dvrSwitchTvLocation: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      let floorPlanUri: string | undefined;
      if (data.floorPlan && data.floorPlan.length > 0) {
        floorPlanUri = await fileToDataURI(data.floorPlan[0]);
      }

      const input: CctvQuotationInput = {
        ...data,
        remoteMonitoring: data.remoteMonitoring === 'Yes',
        floorPlanUri,
      };

      const result = await generateCctvQuotation(input);
      setResponse(result);
      toast({
        title: 'Quotation Generated!',
        description: 'Your CCTV system quotation is ready for review.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Quotation',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const watchCoverage = form.watch('coverage');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">Generating Your Quotation...</CardTitle>
              <CardDescription>Our AI is analyzing your requirements and designing your system. This may take a moment.</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (response) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Quotation Ready</CardTitle>
              <CardDescription>Quotation ID: <span className="font-mono">{response.quotationId}</span></CardDescription>
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
            <AlertTitle>Solution Summary</AlertTitle>
            <AlertDescription>{response.summary}</AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Equipment Details</h3>
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
                {response.equipmentList.map((item, index) => (
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

          <div className="grid md:grid-cols-2 gap-6">
             <div>
              <h3 className="text-lg font-semibold mb-2">Cabling Estimate</h3>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Total Length:</span> {response.cablingEstimate.totalLengthMeters} meters</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Notes:</span> {response.cablingEstimate.cablingNotes}</p>
            </div>
             <div>
              <h3 className="text-lg font-semibold mb-2">Installation Estimate</h3>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Labor:</span> {response.installationEstimate.laborHours} hours</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Cost:</span> OMR {response.installationEstimate.laborCost.toFixed(2)}</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Notes:</span> {response.installationEstimate.notes}</p>
            </div>
          </div>
          
          <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertTitle>Next Steps</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">{response.nextSteps}</AlertDescription>
          </Alert>

        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={() => setResponse(null)} variant="outline" className="w-full sm:w-auto">Request a New Quotation</Button>
          <Button className="w-full sm:w-auto flex-grow"><CircleDollarSign className="mr-2 h-4 w-4" /> Approve & Post as Work Order</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New CCTV Quotation Request</CardTitle>
        <CardDescription>Fill in the details below to get an AI-generated system design and cost estimate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="buildingType" render={({ field }) => (
                    <FormItem><FormLabel>Building Type</FormLabel><FormControl><Input placeholder="e.g., Villa, Office, Warehouse" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dvrSwitchTvLocation" render={({ field }) => (
                    <FormItem><FormLabel>Proposed DVR/Switch/TV Location</FormLabel><FormControl><Input placeholder="e.g., Under the stairs, IT room" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <FormField control={form.control} name="purpose" render={({ field }) => (
                <FormItem><FormLabel>Purpose of Installation</FormLabel><FormControl><Textarea placeholder="e.g., General security, monitoring employees, watching pets, etc." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="floorPlan" render={({ field }) => (
                    <FormItem><FormLabel>Building Floor Plan / Croquis</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormDescription>A simple sketch is enough.</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dimensions" render={({ field }) => (
                    <FormItem><FormLabel>Building Dimensions (if no plan)</FormLabel><FormControl><Input placeholder="e.g., 25m x 30m, 3 floors" {...field} /></FormControl><FormDescription>Provide overall dimensions.</FormDescription><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="coverage" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Required Coverage</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Full Environment" /></FormControl><FormLabel className="font-normal">Full Environment</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Partial" /></FormControl><FormLabel className="font-normal">Partial</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="remoteMonitoring" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Remote Monitoring</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="existingSystem" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Existing System</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="None" /></FormControl><FormLabel className="font-normal">None</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Keep Some" /></FormControl><FormLabel className="font-normal">Keep Some Components</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Replace All" /></FormControl><FormLabel className="font-normal">Replace All</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            {watchCoverage === 'Partial' && (
                 <FormField control={form.control} name="coverageDetails" render={({ field }) => (
                    <FormItem><FormLabel>Partial Coverage Details</FormLabel><FormControl><Textarea placeholder="e.g., 'Only cover the main entrance, back door, and the ground floor windows.'" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Estimate...</> : <><Sparkles className="mr-2 h-4 w-4" /> Get AI Quotation</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
