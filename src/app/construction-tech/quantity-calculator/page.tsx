
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, ClipboardList, Wand2, FileCheck2, Hammer, Layers, BrickWall, Download, Printer, Briefcase, User, HardHat, DollarSign, ArrowRight, Calculator } from 'lucide-react';
import { generateBoqCategory, generateFullBoq } from '@/ai/flows/boq-generator';
import { BoQGeneratorInputSchema, type BoQItem } from '@/ai/flows/boq-generator.schema';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { analyzeFloorPlan, type FloorPlanAnalysisOutput } from '@/ai/flows/floor-plan-analysis';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fileToDataURI } from '@/lib/utils';
import { useBriefcaseData } from '@/hooks/use-data-hooks';

const FormSchema = BoQGeneratorInputSchema.extend({
    floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan file is required.'),
});
type FormValues = z.infer<typeof FormSchema>;

const calculationSteps = [
    { id: 'Preliminaries', label: 'Preliminaries', icon: Hammer },
    { id: 'Earthwork', label: 'Earthwork', icon: Hammer },
    { id: 'Concrete Works', label: 'Concrete', icon: Layers },
    { id: 'Masonry Works', label: 'Masonry', icon: BrickWall },
    { id: 'Plaster Works', label: 'Plastering', icon: Wand2 },
    { id: 'Finishing Works', label: 'Finishing', icon: Sparkles },
];

export default function QuantityCalculatorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FloorPlanAnalysisOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [boqItems, setBoqItems] = useState<BoQItem[]>([]);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const boqTableRef = useRef(null);
  const router = useRouter();
  const { setBriefcase } = useBriefcaseData();
  
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        projectName: '',
        ownerName: '',
        contractorName: '',
        projectType: 'Residential Villa',
        numberOfFloors: 1,
        additionalSpecs: '',
    },
  });
  
  const handleFloorPlanAnalysis = async () => {
    const floorPlanFile = form.getValues('floorPlanFile');
    if (!floorPlanFile || floorPlanFile.length === 0) {
        toast({ title: 'Please select a floor plan file first.', variant: 'destructive' });
        return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    setBoqItems([]);
    setCompletedSteps([]);
    setGeneratedSummary(null);

    try {
        const uri = await fileToDataURI(floorPlanFile[0]);
        form.setValue('floorPlanUri', uri);
        const result = await analyzeFloorPlan({ documentDataUri: uri });
        setAnalysis(result);
        
        let specs = form.getValues('additionalSpecs') || '';
        if (result.dimensions) {
            specs += `\nEstimated building dimensions from plan: ${result.dimensions}.`;
        }
        if (result.suggestedDvrLocation) {
            specs += `\nConsider placing the main equipment in the ${result.suggestedDvrLocation}.`;
        }
        if (result.projectType) {
            form.setValue('projectType', result.projectType as any);
        }
        if(result.numberOfFloors) {
            form.setValue('numberOfFloors', result.numberOfFloors);
        }
        if(result.projectName) {
            form.setValue('projectName', result.projectName);
        }
        if(result.ownerName) {
            form.setValue('ownerName', result.ownerName);
        }
        if(result.contractorName) {
            form.setValue('contractorName', result.contractorName);
        }
        if(!form.getValues('projectName')) {
            form.setValue('projectName', `Project for ${floorPlanFile[0].name}`);
        }

        form.setValue('additionalSpecs', specs.trim());

        toast({ title: 'Floor Plan Analyzed', description: 'AI has pre-filled the project details. Please review and continue.' });

    } catch (e) {
        console.error("Floor plan analysis failed:", e);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the floor plan. Please check the file and try again, or describe your needs manually.",
          variant: "destructive",
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleStepGeneration = async (category: string) => {
    setIsGenerating(category);
    const formData = form.getValues();
    if (!formData.floorPlanUri) {
        toast({title: "Error", description: "Please analyze a floor plan first.", variant: 'destructive'});
        setIsGenerating(null);
        return;
    }

    try {
        const result = await generateBoqCategory({
            ...formData,
            category,
        });
        
        setBoqItems(prev => [...prev, ...result.boqItems]);
        setCompletedSteps(prev => [...prev, category]);
        
        if (completedSteps.length + 1 === calculationSteps.length) {
            setGeneratedSummary("All categories have been calculated. This provides a preliminary Bill of Quantities for your project.");
        }

    } catch (e) {
        console.error(e);
        toast({ title: "Calculation Failed", description: `Could not generate BoQ for ${category}.`, variant: 'destructive' });
    } finally {
        setIsGenerating(null);
    }
  };

  const handleFullBoqGeneration = async () => {
    setIsGenerating('all');
    setBoqItems([]);
    setCompletedSteps([]);
    const formData = form.getValues();
     if (!formData.floorPlanUri) {
        toast({title: "Error", description: "Please analyze a floor plan first.", variant: 'destructive'});
        setIsGenerating(null);
        return;
    }

    try {
        const result = await generateFullBoq(formData);

        setBoqItems(result.boqItems);
        setCompletedSteps(calculationSteps.map(s => s.id));
        setGeneratedSummary("All categories have been calculated. This provides a preliminary Bill of Quantities for your project.");

    } catch (e) {
         console.error(e);
        toast({ title: "Calculation Failed", description: `Could not generate the full BoQ. Please try again.`, variant: 'destructive' });
    } finally {
        setIsGenerating(null);
    }
  };
  
   const handleDownloadCsv = () => {
    if (!boqItems.length) return;
    const headers = ["Category", "Item Description", "Unit", "Quantity", "Notes"];
    const rows = boqItems.map(item => [
      `"${item.category}"`,
      `"${item.item}"`,
      `"${item.unit}"`,
      item.quantity.toFixed(2),
      `"${item.notes || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `BoQ_${form.getValues('projectName').replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintPdf = () => {
    if (!boqItems.length) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Bill of Quantities for: ${form.getValues('projectName')}`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    const ownerName = form.getValues('ownerName');
    const contractorName = form.getValues('contractorName');
    if (ownerName) doc.text(`Owner: ${ownerName}`, 14, 30);
    if (contractorName) doc.text(`Contractor: ${contractorName}`, 120, 30);

    (doc as any).autoTable({
        html: boqTableRef.current,
        startY: 35,
        headStyles: { fillColor: [41, 52, 98] },
    });
    doc.save(`BoQ_${form.getValues('projectName').replace(/\s+/g, '_')}.pdf`);
  };

  const handleSaveToBriefcase = () => {
    if (!boqItems.length) {
        toast({ title: 'No BoQ data to save.', variant: 'destructive'});
        return;
    }
    const newBoq = {
        id: `boq_${Date.now()}`,
        name: form.getValues('projectName') || 'Unnamed Project',
        date: new Date().toISOString(),
        items: boqItems,
    };
    setBriefcase(prev => {
        if (!prev) return null;
        return {
            ...prev,
            savedBoqs: [newBoq, ...prev.savedBoqs],
        }
    });
    toast({ title: "BoQ Saved!", description: "The project has been saved to your E-Briefcase." });
  }

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
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Bill of Quantities (BoQ) Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your building floor plan and specify your project details. Our AI Quantity Surveyor will analyze the plan and generate a preliminary Bill of Quantities for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Provide your project information and upload the floor plan. Use the AI Analyzer for assistance.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="projectName" render={({ field }) => (
                                <FormItem><FormLabel>Project Name / Reference</FormLabel><FormControl><Input placeholder="e.g., Al Amerat Villa" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                            <FormField control={form.control} name="ownerName" render={({ field }) => (
                                <FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input placeholder="e.g., Mr. Ahmed Al-Habsi" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                            <FormField control={form.control} name="contractorName" render={({ field }) => (
                                <FormItem><FormLabel>Contractor Name</FormLabel><FormControl><Input placeholder="e.g., Innovative Builders LLC" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="floorPlanFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Floor Plan Document (PDF or Image)</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl className="flex-1">
                                            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => {
                                                field.onChange(e.target.files);
                                                setAnalysis(null); setBoqItems([]); setCompletedSteps([]); setGeneratedSummary(null);
                                            }} />
                                        </FormControl>
                                        <Button type="button" variant="secondary" onClick={handleFloorPlanAnalysis} disabled={isAnalyzing}>
                                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                            Analyze
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {analysis && (
                            <Alert>
                                <FileCheck2 className="h-4 w-4" />
                                <AlertTitle>AI Analysis Complete</AlertTitle>
                                <AlertDescription>
                                    {analysis.dimensions && <p><strong>Dimensions:</strong> {analysis.dimensions}</p>}
                                    {analysis.suggestedDvrLocation && <p><strong>Suggested Equipment Room:</strong> {analysis.suggestedDvrLocation}</p>}
                                    <p className="text-xs mt-1">This information has been added to the specifications below. You can now generate the BoQ.</p>
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="projectType" render={({ field }) => (
                                <FormItem><FormLabel>Project Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a project type..." /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Residential Villa">Residential Villa</SelectItem>
                                    <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                                    <SelectItem value="Industrial Warehouse">Industrial Warehouse</SelectItem>
                                    <SelectItem value="Mixed-Use Building">Mixed-Use Building</SelectItem>
                                    <SelectItem value="Renovation Project">Renovation Project</SelectItem>
                                    <SelectItem value="Landscaping Project">Landscaping Project</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                                )}
                            />
                            <FormField control={form.control} name="numberOfFloors" render={({ field }) => (
                                <FormItem><FormLabel>Number of Floors</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="additionalSpecs" render={({ field }) => (
                            <FormItem><FormLabel>Additional Specifications (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., 'Use high-strength concrete for foundations. Include basic electrical wiring and plumbing fixtures in the BoQ.'" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </form>
                </Form>
                </CardContent>
            </Card>

            {(analysis || form.getValues('floorPlanUri')) && (
                <Card>
                    <CardHeader>
                    <CardTitle>Generate Bill of Quantities</CardTitle>
                    <CardDescription>Generate quantities for each category step-by-step, or generate the full BoQ at once.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {calculationSteps.map(step => (
                            <Button 
                                key={step.id} 
                                onClick={() => handleStepGeneration(step.id)} 
                                disabled={!!isGenerating || completedSteps.includes(step.id)}
                                variant={completedSteps.includes(step.id) ? 'default' : 'secondary'}
                                className={completedSteps.includes(step.id) ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                {isGenerating === step.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                ) : (
                                    <step.icon className="mr-2 h-4 w-4" />
                                )}
                                {step.label}
                            </Button>
                        ))}
                    </div>
                        <div className="pt-4 border-t">
                            <Button 
                                onClick={handleFullBoqGeneration} 
                                disabled={!!isGenerating}
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                size="lg"
                            >
                                {isGenerating === 'all' ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating Full BoQ...</>
                                ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Generate Full BoQ (All Categories)</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}


            {boqItems.length > 0 && (
                <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList className="h-6 w-6"/> Preliminary Bill of Quantities</CardTitle>
                    {generatedSummary && <CardDescription>{generatedSummary}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table ref={boqTableRef}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Item Description</TableHead>
                                    <TableHead className="text-center">Unit</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {boqItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.category}</TableCell>
                                        <TableCell>
                                            {item.item}
                                            {item.notes && <p className="text-xs text-muted-foreground italic">Note: {item.notes}</p>}
                                        </TableCell>
                                        <TableCell className="text-center">{item.unit}</TableCell>
                                        <TableCell className="text-right font-mono">{item.quantity.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row gap-2 justify-end">
                    <Button onClick={handleSaveToBriefcase} variant="outline"><Briefcase className="mr-2 h-4 w-4" /> Save to Briefcase</Button>
                    <Button onClick={handleDownloadCsv} variant="outline"><Download className="mr-2 h-4 w-4" /> Download CSV</Button>
                    <Button onClick={handlePrintPdf}><Printer className="mr-2 h-4 w-4" /> Print to PDF</Button>
                </CardFooter>
                </Card>
            )}

            {boqItems.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3"><ArrowRight className="h-6 w-6 text-primary"/> Next Steps</CardTitle>
                        <CardDescription>Now that you have your Bill of Quantities, take the next step in your project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5"/> Cost Estimation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Use our BidWise Estimator to get a detailed cost breakdown and generate a professional tender response based on your BoQ.</p>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleProceedToEstimator}>Go to BidWise Estimator</Button>
                                </CardFooter>
                            </Card>
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><HardHat className="h-5 w-5"/> Find a Contractor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Post this project to our Business Hub to receive competitive bids from our network of vetted contractors and service providers.</p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild>
                                        <Link href="/submit-work">Post a Job on Business Hub</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
