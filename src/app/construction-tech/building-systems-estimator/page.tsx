
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, FileCheck2, Download, Image as ImageIcon, Shield, ShieldCheck, Siren, Cpu, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { estimateFireSafety } from '@/ai/flows/fire-safety-estimator';
import type { FireSafetyEstimatorOutput } from '@/ai/flows/fire-safety-estimator.schema';
import { estimateSmartHome } from '@/ai/flows/smart-home-estimator';
import type { SmartHomeEstimatorOutput } from '@/ai/flows/smart-home-estimator.schema';
import { transformImage } from '@/ai/flows/image-transformer';
import { fileToDataURI } from '@/lib/utils';
import { analyzeFloorPlan, type FloorPlanAnalysisOutput } from '@/ai/flows/floor-plan-analysis';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan file is required.'),
  projectType: z.enum(['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Educational']),
  numberOfFloors: z.coerce.number().int().positive(),
  totalAreaSqM: z.coerce.number().positive(),
  occupancyLoad: z.coerce.number().positive(),
  includeFireSafety: z.boolean().default(true),
  includeSmartHome: z.boolean().default(false),
  hasKitchens: z.boolean().default(false),
  hasServerRoom: z.boolean().default(false),
  automationLevel: z.enum(['Essential', 'Advanced', 'Luxury']),
});

type FormValues = z.infer<typeof FormSchema>;
type PageState = 'form' | 'loading' | 'result';

export default function BuildingSystemsEstimatorPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [loadingMessage, setLoadingMessage] = useState('Estimating equipment needs...');
  const [fireResponse, setFireResponse] = useState<FireSafetyEstimatorOutput | null>(null);
  const [smartHomeResponse, setSmartHomeResponse] = useState<SmartHomeEstimatorOutput | null>(null);
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
      includeFireSafety: true,
      includeSmartHome: false,
      automationLevel: 'Advanced',
    },
  });
  
  const watchIncludeFireSafety = form.watch('includeFireSafety');
  const watchIncludeSmartHome = form.watch('includeSmartHome');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.includeFireSafety && !data.includeSmartHome) {
      toast({ title: 'No systems selected', description: 'Please select at least one system to estimate.', variant: 'destructive' });
      return;
    }
    setPageState('loading');
    setLoadingMessage('Estimating equipment and costs...');
    setFireResponse(null);
    setSmartHomeResponse(null);
    setAnnotatedImageUrl(null);

    try {
      const floorPlanUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImageUrl(floorPlanUri);

      const [fireResult, smartHomeResult] = await Promise.all([
        data.includeFireSafety ? estimateFireSafety({ ...data, floorPlanUri }) : Promise.resolve(null),
        data.includeSmartHome ? estimateSmartHome({ ...data, floorPlanUri }) : Promise.resolve(null),
      ]);
      
      setFireResponse(fireResult);
      setSmartHomeResponse(smartHomeResult);

      setLoadingMessage('Generating equipment placement plan...');
      
      const fireEquipment = fireResult?.equipmentList.map(item => `'${item.quantity}x ${item.item}'`).join(', ') || '';
      const smartEquipment = smartHomeResult?.equipmentList.map(item => `'${item.quantity}x ${item.item}'`).join(', ') || '';
      
      const annotationResult = await transformImage({
        baseImageUri: floorPlanUri,
        prompt: `Overlay professional, semi-transparent icons on this floor plan to show the placement of the following building systems equipment: Fire Safety items - ${fireEquipment}. Smart Home items - ${smartEquipment}. Place detectors and sprinklers evenly. Place extinguishers and call points near exits and high-risk areas. Place smart hubs centrally.`
      });
      setAnnotatedImageUrl(annotationResult.imageDataUri);

      setPageState('result');
      toast({
        title: 'Estimate Generated!',
        description: 'Your building systems proposal is ready.',
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
    setFireResponse(null);
    setSmartHomeResponse(null);
    setAnnotatedImageUrl(null);
    setBaseImageUrl(null);
    setAnalysis(null);
    form.reset();
  }
  
  const totalCost = (fireResponse?.grandTotal || 0) + (smartHomeResponse?.grandTotal || 0);

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
                        <CardDescription>Our AI Engineer is analyzing your project. This may take up to a minute.</CardDescription>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            );
        case 'result':
            if (!fireResponse && !smartHomeResponse) return null;
            return (
                 <Card>
                    <CardHeader>
                        <CardTitle>Building Systems - Preliminary Proposal</CardTitle>
                        <CardDescription>This is an AI-generated estimate. All designs must be verified by a certified engineer.</CardDescription>
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
                                        <a href={annotatedImageUrl} download="systems-plan.png"><Download className="mr-2 h-4 w-4" /> Download Plan</a>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {fireResponse && (
                             <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Siren className="h-5 w-5 text-red-500" /> Fire & Safety System</h3>
                                <Table>
                                    <TableHeader><TableRow><TableHead>System</TableHead><TableHead>Item</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Total Cost</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {fireResponse.equipmentList.map((item, index) => (
                                            <TableRow key={`fire-${index}`}><TableCell><Badge variant="destructive">{item.type}</Badge></TableCell><TableCell>{item.item}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right font-mono">OMR {item.totalCost.toFixed(2)}</TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                          {smartHomeResponse && (
                             <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Cpu className="h-5 w-5 text-blue-500" /> Smart Home System</h3>
                                <Table>
                                    <TableHeader><TableRow><TableHead>System</TableHead><TableHead>Device</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Total Cost</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {smartHomeResponse.equipmentList.map((item, index) => (
                                            <TableRow key={`smart-${index}`}><TableCell><Badge variant="secondary">{item.type}</Badge></TableCell><TableCell>{item.item}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right font-mono">OMR {item.totalCost.toFixed(2)}</TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                       <Card className="bg-muted/50">
                            <CardHeader><CardTitle className="text-lg">Total Cost Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {fireResponse && <div className="flex justify-between"><span>Fire & Safety System Total:</span><span className="font-mono font-semibold">OMR {fireResponse.grandTotal.toFixed(2)}</span></div>}
                                {smartHomeResponse && <div className="flex justify-between"><span>Smart Home System Total:</span><span className="font-mono font-semibold">OMR {smartHomeResponse.grandTotal.toFixed(2)}</span></div>}
                                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t"><span>Grand Total:</span><span className="font-mono">OMR {totalCost.toFixed(2)}</span></div>
                            </CardContent>
                        </Card>
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
                        <CardTitle>New Building Systems Estimate</CardTitle>
                        <CardDescription>Upload a floor plan and select the systems you need to get an AI-generated estimate.</CardDescription>
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
                                                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => {
                                                    field.onChange(e.target.files);
                                                    setAnalysis(null);
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
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="projectType" render={({ field }) => (
                                    <FormItem><FormLabel>2. Project Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                        <SelectItem value="Residential">Residential</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                        <SelectItem value="Industrial">Industrial</SelectItem>
                                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                                        <SelectItem value="Educational">Educational</SelectItem>
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="totalAreaSqM" render={({ field }) => (
                                    <FormItem><FormLabel>3. Total Area (sq.m)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="numberOfFloors" render={({ field }) => (
                                    <FormItem><FormLabel>4. Number of Floors</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="occupancyLoad" render={({ field }) => (
                                    <FormItem><FormLabel>5. Max Occupancy</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <div className="space-y-3 pt-2">
                                <FormLabel>6. Select Systems to Estimate</FormLabel>
                                <div className="space-y-2">
                                     <FormField control={form.control} name="includeFireSafety" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-0.5"><FormLabel>Fire & Safety System</FormLabel></div></FormItem>
                                    )}/>
                                     <FormField control={form.control} name="includeSmartHome" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-0.5"><FormLabel>Smart Home System</FormLabel></div></FormItem>
                                    )}/>
                                </div>
                            </div>
                            {watchIncludeSmartHome && (
                                <FormField
                                    control={form.control}
                                    name="automationLevel"
                                    render={({ field }) => (
                                        <FormItem><FormLabel>Smart Home Automation Level</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                            <SelectItem value="Essential">Essential (Lighting & Hub)</SelectItem>
                                            <SelectItem value="Advanced">Advanced (Lighting, Climate, Security)</SelectItem>
                                            <SelectItem value="Luxury">Luxury (Full Automation & Entertainment)</SelectItem>
                                        </SelectContent></Select><FormMessage /></FormItem>
                                    )}
                                />
                            )}
                            <Button type="submit" disabled={pageState === 'loading' || isAnalyzing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
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
             <Button asChild variant="outline" className="mb-4">
                <Link href="/construction-tech">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Construction Tech
                </Link>
            </Button>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Cpu className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Building Systems Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your building's floor plan and get a preliminary estimate and equipment layout for Fire Safety and Smart Home systems.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
