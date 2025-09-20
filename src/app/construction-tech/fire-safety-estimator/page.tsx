
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, FileCheck2, Download, Image as ImageIcon, Shield, ShieldCheck, Siren, FireExtinguisher, Bell, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { estimateFireSafety } from '@/ai/flows/fire-safety-estimator';
import type { FireSafetyEstimatorOutput } from '@/ai/flows/fire-safety-estimator.schema';
import { transformImage } from '@/ai/flows/image-transformer';
import { fileToDataURI } from '@/lib/utils';
import { analyzeFloorPlan, type FloorPlanAnalysisOutput } from '@/ai/flows/floor-plan-analysis';

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan file is required.'),
  projectType: z.enum(['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Educational']),
  numberOfFloors: z.coerce.number().int().positive(),
  totalAreaSqM: z.coerce.number().positive(),
  occupancyLoad: z.coerce.number().positive(),
  hasKitchens: z.boolean().default(false),
  hasServerRoom: z.boolean().default(false),
});

type FormValues = z.infer<typeof FormSchema>;
type PageState = 'form' | 'loading' | 'result';

export default function FireSafetyEstimatorPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [loadingMessage, setLoadingMessage] = useState('Estimating equipment needs...');
  const [response, setResponse] = useState<FireSafetyEstimatorOutput | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FloorPlanAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectType: 'Commercial',
      numberOfFloors: 1,
      occupancyLoad: 50,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setLoadingMessage('Estimating equipment and costs...');
    setResponse(null);
    setAnnotatedImageUrl(null);

    try {
      const floorPlanUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImageUrl(floorPlanUri);

      const estimationResult = await estimateFireSafety({ ...data, floorPlanUri });
      setResponse(estimationResult);

      setLoadingMessage('Generating equipment placement plan...');
      const equipmentList = estimationResult.equipmentList.map(item => `'${item.quantity}x ${item.item}'`).join(', ');
      
      const annotationResult = await transformImage({
        baseImageUri: floorPlanUri,
        prompt: `Overlay professional, semi-transparent icons on this floor plan to show the placement of the following fire safety equipment: ${equipmentList}. Place detectors and sprinklers evenly. Place extinguishers near exits and high-risk areas. Place call points at exits.`
      });
      setAnnotatedImageUrl(annotationResult.imageDataUri);

      setPageState('result');
      toast({
        title: 'Estimate Generated!',
        description: 'Your fire and safety system proposal is ready.',
      });
    } catch (error) {
      console.error(error);
      setPageState('form');
      toast({
        title: 'Error Generating Estimate',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleFloorPlanAnalysis = async () => {
    const floorPlanFile = form.getValues('floorPlanFile');
    if (!floorPlanFile || floorPlanFile.length === 0) {
        toast({ title: 'Please select a floor plan file first.', variant: 'destructive' });
        return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
        const uri = await fileToDataURI(floorPlanFile[0]);
        const result = await analyzeFloorPlan({ documentDataUri: uri });
        setAnalysis(result);
        
        if (result.projectType) {
            form.setValue('projectType', result.projectType as any);
        }
        if(result.numberOfFloors) {
            form.setValue('numberOfFloors', result.numberOfFloors);
        }

        toast({ title: 'Floor Plan Analyzed', description: 'AI has pre-filled some project details.' });

    } catch (e) {
        console.error("Floor plan analysis failed:", e);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the floor plan. Please check the file and try again.",
          variant: "destructive",
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setPageState('form');
    setResponse(null);
    setAnnotatedImageUrl(null);
    setBaseImageUrl(null);
    form.reset();
  }

  const renderContent = () => {
    switch(pageState) {
        case 'loading':
            return (
                <Card>
                    <CardContent className="p-10 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <div className="space-y-2">
                        <CardTitle className="text-2xl">{loadingMessage}</CardTitle>
                        <CardDescription>Our AI Engineer is analyzing your project. This may take a moment.</CardDescription>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            );
        case 'result':
            if (!response) return null;
            return (
                 <Card>
                    <CardHeader>
                        <CardTitle>Fire & Safety System - Preliminary Proposal</CardTitle>
                        <CardDescription>This is an AI-generated estimate based on the provided details. All designs must be verified by a certified engineer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {annotatedImageUrl && baseImageUrl && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Proposed Equipment Layout</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-center mb-2 text-sm text-muted-foreground">Original Plan</h4>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
                                            <Image src={baseImageUrl} alt="Original Floor Plan" layout="fill" objectFit="contain" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-center mb-2 text-sm text-muted-foreground">AI Placement</h4>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
                                            <Image src={annotatedImageUrl} alt="Annotated Floor Plan" layout="fill" objectFit="contain" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Button asChild variant="outline" size="sm">
                                        <a href={annotatedImageUrl} download="fire-safety-plan.png"><Download className="mr-2 h-4 w-4" /> Download Plan</a>
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Estimated Bill of Materials</h3>
                            <Table>
                                <TableHeader><TableRow><TableHead>System</TableHead><TableHead>Item</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Unit Cost</TableHead><TableHead className="text-right">Total Cost</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {response.equipmentList.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Badge variant={item.type === 'Detection & Alarm' ? 'default' : 'secondary'}>{item.type}</Badge></TableCell>
                                            <TableCell className="font-medium">{item.item}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-mono">OMR {item.unitCost.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono font-semibold">OMR {item.totalCost.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-muted/50">
                                <CardHeader><CardTitle className="text-lg">Cost Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Total Material Cost:</span><span className="font-mono">OMR {response.totalMaterialCost.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Estimated Installation:</span><span className="font-mono">OMR {response.estimatedInstallationCost.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t"><span>Grand Total:</span><span className="font-mono">OMR {response.grandTotal.toFixed(2)}</span></div>
                                </CardContent>
                            </Card>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {response.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={resetForm} variant="outline" className="w-full">Start a New Estimate</Button>
                    </CardFooter>
                </Card>
            );
        default:
             return (
                <Card>
                    <CardHeader>
                        <CardTitle>New Fire & Safety Estimate</CardTitle>
                        <CardDescription>Provide building details and upload a floor plan to get started.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="floorPlanFile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>1. Upload Floor Plan</FormLabel>
                                         <div className="flex gap-2">
                                            <FormControl className="flex-1">
                                                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
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
                            <div className="grid md:grid-cols-3 gap-6">
                                <FormField control={form.control} name="projectType" render={({ field }) => (
                                    <FormItem><FormLabel>2. Project Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                        <SelectItem value="Residential">Residential</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                        <SelectItem value="Industrial">Industrial</SelectItem>
                                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                                        <SelectItem value="Educational">Educational</SelectItem>
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="numberOfFloors" render={({ field }) => (
                                    <FormItem><FormLabel>3. Number of Floors</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="totalAreaSqM" render={({ field }) => (
                                    <FormItem><FormLabel>4. Total Area (sq.m)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="occupancyLoad" render={({ field }) => (
                                <FormItem><FormLabel>5. Estimated Max Occupancy</FormLabel><FormControl><Input type="number" placeholder="e.g., 150 people" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="space-y-3">
                                <FormLabel>6. Special Areas</FormLabel>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <FormField control={form.control} name="hasKitchens" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Contains commercial kitchens</FormLabel></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="hasServerRoom" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Contains server/data room</FormLabel></FormItem>
                                    )}/>
                                </div>
                            </div>
                            <Button type="submit" disabled={pageState === 'loading'} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            <Sparkles className="mr-2 h-4 w-4" /> Generate Estimate
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            );
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Siren className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Fire & Safety Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your building's floor plan and provide some basic details. Our AI will generate a preliminary list of required fire alarm and firefighting equipment, along with a cost estimate, and show you a proposed layout.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
