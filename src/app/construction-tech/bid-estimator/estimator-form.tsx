
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileUp, DollarSign, Percent, FileText } from 'lucide-react';
import { estimateBoq } from '@/ai/flows/boq-estimator';
import { BoQEstimatorInputSchema, type BoQEstimatorOutput } from '@/ai/flows/boq-estimator.schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

const FormSchema = z.object({
  boqFile: z.any().refine(file => file?.length == 1, 'A Bill of Quantities file is required.'),
  contingencyPercentage: z.coerce.number().min(0).max(100).default(10),
  profitMarginPercentage: z.coerce.number().min(0).max(100).default(15),
});
type FormValues = z.infer<typeof FormSchema>;

export default function EstimatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BoQEstimatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contingencyPercentage: 10,
      profitMarginPercentage: 15,
    },
  });
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const boqCsvText = await fileToText(data.boqFile[0]);
        const result = await estimateBoq({
            boqCsvText,
            contingencyPercentage: data.contingencyPercentage,
            profitMarginPercentage: data.profitMarginPercentage,
        });
        setResponse(result);
        toast({ title: "Estimation Complete!", description: "Your BoQ has been analyzed and costed." });
    } catch(e) {
        console.error(e);
        toast({ title: 'Estimation Failed', description: 'Could not process the BoQ file. Please check the format.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Bill of Quantities</CardTitle>
          <CardDescription>Upload your BoQ file (in CSV format). The AI will analyze it and provide a cost estimation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="boqFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>BoQ Document (.csv)</FormLabel>
                            <FormControl>
                                <Input type="file" accept=".csv" onChange={(e) => field.onChange(e.target.files)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="contingencyPercentage" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Percent className="h-4 w-4"/> Contingency (%)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormDescription>A buffer for unforeseen costs.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="profitMarginPercentage" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><DollarSign className="h-4 w-4"/> Profit Margin (%)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                             <FormDescription>Your desired profit margin.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing & Estimating...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Cost Estimate</>
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
                    <p className="mt-4 text-muted-foreground">The AI Quantity Surveyor is calculating costs based on current market rates...</p>
                </CardContent>
            </Card>
        )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6"/> Detailed Cost Estimation</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Material Cost</TableHead>
                            <TableHead className="text-right">Labor Cost</TableHead>
                            <TableHead className="text-right">Total Cost (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.costedItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <p className="font-medium">{item.item}</p>
                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                </TableCell>
                                <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                                <TableCell className="text-right font-mono">{item.materialUnitCost.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">{item.laborUnitCost.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-bold">{item.totalItemCost.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
             <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div></div>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Direct Costs</span><span className="font-mono">{response.summary.totalDirectCosts.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Contingency ({form.getValues('contingencyPercentage')}%)</span><span className="font-mono">{response.summary.contingencyAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-2"><span>Subtotal</span><span className="font-mono">{response.summary.subtotal.toFixed(2)}</span></div>
                         <div className="flex justify-between"><span>Profit Margin ({form.getValues('profitMarginPercentage')}%)</span><span className="font-mono">{response.summary.profitAmount.toFixed(2)}</span></div>
                         <div className="flex justify-between text-lg font-bold text-primary border-t pt-2 mt-2"><span>Grand Total (OMR)</span><span className="font-mono">{response.summary.grandTotal.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
