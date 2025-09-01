'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileUp, DollarSign, Percent, FileText, Copy, Download, Briefcase, Printer } from 'lucide-react';
import { estimateBoq } from '@/ai/flows/boq-estimator';
import { BoQEstimatorInputSchema, type BoQEstimatorOutput } from '@/ai/flows/boq-estimator.schema';
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCostSettingsData } from '@/app/admin/cost-settings-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

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
  const [isGeneratingTender, setIsGeneratingTender] = useState(false);
  const [response, setResponse] = useState<BoQEstimatorOutput | null>(null);
  const [tenderResponse, setTenderResponse] = useState<string | null>(null);
  const { costSettings } = useCostSettingsData();
  const boqTableRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contingencyPercentage: 10,
      profitMarginPercentage: 15,
    },
  });

  const contingencyPercentage = form.watch('contingencyPercentage');
  const profitMarginPercentage = form.watch('profitMarginPercentage');

  useEffect(() => {
    if (response) {
        const { contingencyPercentage, profitMarginPercentage } = form.getValues();
        const totalDirectCosts = response.costedItems.reduce((sum, item) => sum + item.totalItemCost, 0);
        const contingencyAmount = totalDirectCosts * (contingencyPercentage / 100);
        const subtotal = totalDirectCosts + contingencyAmount;
        const profitAmount = subtotal * (profitMarginPercentage / 100);
        const grandTotal = subtotal + profitAmount;
        
        setResponse(prev => {
            if (!prev) return null;
            return {
                ...prev,
                summary: {
                    totalDirectCosts,
                    contingencyAmount,
                    subtotal,
                    profitAmount,
                    grandTotal,
                }
            };
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contingencyPercentage, profitMarginPercentage]);


  useEffect(() => {
    try {
      const boqData = sessionStorage.getItem('boqDataForEstimator');
      if (boqData && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        const file = new File([boqData], "boq-from-generator.csv", { type: "text/csv" });
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
        form.setValue('boqFile', fileInputRef.current.files);


        toast({
            title: "BoQ Pre-loaded!",
            description: "Your generated Bill of Quantities has been automatically loaded."
        });
        
        sessionStorage.removeItem('boqDataForEstimator');
      }
    } catch(e) {
      console.error("Could not load BoQ from session storage:", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setTenderResponse(null);
    try {
        const boqCsvText = await fileToText(data.boqFile[0]);
        const result = await estimateBoq({
            boqCsvText,
            contingencyPercentage: data.contingencyPercentage,
            profitMarginPercentage: data.profitMarginPercentage,
            marketRates: costSettings,
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

  const handleGenerateTender = async () => {
    if (!response) return;

    const boqFile = form.getValues('boqFile');
    if (!boqFile || boqFile.length === 0) {
        toast({ title: "Error", description: "Could not find the original BoQ file.", variant: "destructive"});
        return;
    }

    setIsGeneratingTender(true);
    setTenderResponse(null);

    try {
        const boqDataUri = await fileToDataURI(boqFile[0]);
        const projectRequirements = `Generate a tender response for a project with an estimated cost of OMR ${response.summary.grandTotal.toFixed(2)}. The project involves the following main categories: ${[...new Set(response.costedItems.map(item => item.category))].join(', ')}.`;

        const result = await generateTenderResponse({
            tenderDocuments: [boqDataUri],
            projectRequirements,
            estimatedCost: response.summary.grandTotal,
        });

        setTenderResponse(result.draftResponse);
        toast({ title: "Tender Response Drafted", description: "A draft response has been generated below." });

    } catch(e) {
        console.error(e);
        toast({ title: 'Tender Generation Failed', description: 'Could not generate the tender response.', variant: 'destructive' });
    } finally {
        setIsGeneratingTender(false);
    }
  };
  
    const handleDownloadCsv = () => {
    if (!response) return;
    const headers = ["Category", "Item Description", "Unit", "Quantity", "Material Unit Cost", "Labor Unit Cost", "Total Item Cost"];
    const rows = response.costedItems.map(item => [
      `"${item.category}"`,
      `"${item.item}"`,
      `"${item.unit}"`,
      item.quantity.toFixed(2),
      item.materialUnitCost.toFixed(2),
      item.laborUnitCost.toFixed(2),
      item.totalItemCost.toFixed(2)
    ].join(','));

    let csvContent = headers.join(',') + '\n' + rows.join('\n');
    
    csvContent += `\n\n\nSummary\n`;
    csvContent += `Direct Costs,${response.summary.totalDirectCosts.toFixed(2)}\n`;
    csvContent += `Contingency,${response.summary.contingencyAmount.toFixed(2)}\n`;
    csvContent += `Subtotal,${response.summary.subtotal.toFixed(2)}\n`;
    csvContent += `Profit Margin,${response.summary.profitAmount.toFixed(2)}\n`;
    csvContent += `Grand Total,${response.summary.grandTotal.toFixed(2)}\n`;


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `BoQ_Cost_Estimate.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintPdf = () => {
    if (!response) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Cost Estimation for BoQ`, 14, 22);

    (doc as any).autoTable({
        html: boqTableRef.current,
        startY: 35,
        headStyles: { fillColor: [41, 52, 98] },
    });
    doc.save(`BoQ_Cost_Estimate.pdf`);
  };

  const handleSaveToBriefcase = () => {
    toast({ title: "Coming Soon!", description: "Saving to E-Briefcase will be implemented in a future update." });
  }

  const handleCopy = () => {
    if (!tenderResponse) return;
    navigator.clipboard.writeText(tenderResponse);
    toast({ title: "Copied!", description: "The draft response has been copied to your clipboard." });
  };

  const handleDownloadTender = () => {
    if (!tenderResponse) return;
    const element = document.createElement("a");
    const file = new Blob([tenderResponse], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "tender_draft_response.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleProceedToEstimator = () => {
    if (!boqItems.length) {
      toast({ title: "No BoQ Data", description: "Please generate a BoQ before proceeding.", variant: "destructive" });
      return;
    }
    const headers = ["Category", "Item Description", "Unit", "Quantity", "Notes"];
    const rows = boqItems.map(item => [
      `"${item.category}"`,
      `"${item.item}"`,
      `"${item.unit}"`,
      item.quantity.toFixed(2),
      `"${item.notes || ''}"`
    ].join(','));
    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    
    try {
        sessionStorage.setItem('boqDataForEstimator', csvContent);
        router.push('/construction-tech/bid-estimator');
    } catch(e) {
        toast({ title: "Error", description: "Could not pass data to the estimator.", variant: 'destructive' });
    }
  }

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
                                <Input 
                                  type="file" 
                                  accept=".csv" 
                                  onChange={(e) => field.onChange(e.target.files)}
                                  ref={fileInputRef} 
                                />
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
                    <p className="mt-4 text-muted-foreground">The AI Quantity Surveyor is calculating costs based on your configured market rates...</p>
                </CardContent>
            </Card>
        )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6"/> Detailed Cost Estimation</CardTitle>
             <div className="flex justify-end gap-2">
                <Button onClick={handleSaveToBriefcase} variant="outline" size="sm"><Briefcase className="mr-2 h-4 w-4" /> Save to Briefcase</Button>
                <Button onClick={handleDownloadCsv} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download CSV</Button>
                <Button onClick={handlePrintPdf} variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" /> Print to PDF</Button>
            </div>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
                <Table ref={boqTableRef}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit</TableHead>
                            <TableHead className="text-right">Material Unit Cost</TableHead>
                            <TableHead className="text-right">Labor Unit Cost</TableHead>
                            <TableHead className="text-right font-semibold">Total Cost (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.costedItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.item}</TableCell>
                                <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                                <TableCell className="text-right">{item.unit}</TableCell>
                                <TableCell className="text-right font-mono">{item.materialUnitCost.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">{item.laborUnitCost.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-semibold">{item.totalItemCost.toFixed(2)}</TableCell>
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
                        <div className="flex justify-between items-center">
                            <Label htmlFor="contingency-inline">Contingency (%)</Label>
                            <FormField
                                control={form.control}
                                name="contingencyPercentage"
                                render={({ field }) => (
                                    <Input 
                                        id="contingency-inline"
                                        type="number" 
                                        {...field}
                                        className="w-24 h-8 text-right font-mono"
                                    />
                                )}
                            />
                            <span className="font-mono">{response.summary.contingencyAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2"><span>Subtotal</span><span className="font-mono">{response.summary.subtotal.toFixed(2)}</span></div>
                         <div className="flex justify-between items-center">
                            <Label htmlFor="profit-inline">Profit Margin (%)</Label>
                             <FormField
                                control={form.control}
                                name="profitMarginPercentage"
                                render={({ field }) => (
                                    <Input 
                                        id="profit-inline"
                                        type="number" 
                                        {...field}
                                        className="w-24 h-8 text-right font-mono"
                                    />
                                )}
                            />
                            <span className="font-mono">{response.summary.profitAmount.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-lg font-bold text-primary border-t pt-2 mt-2"><span>Grand Total (OMR)</span><span className="font-mono">{response.summary.grandTotal.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
             </div>
          </CardContent>
           <CardFooter>
                <Button onClick={handleGenerateTender} disabled={isGeneratingTender} className="w-full">
                    {isGeneratingTender ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Drafting...</> : <><FileText className="mr-2 h-4 w-4" /> Generate Tender Response</>}
                </Button>
            </CardFooter>
        </Card>
      )}

      {tenderResponse && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>AI-Generated Draft Response</CardTitle>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadTender}><Download className="mr-2 h-4 w-4"/> Download</Button>
                </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md border">
                {tenderResponse}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
