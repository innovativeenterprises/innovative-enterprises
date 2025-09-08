
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateIctProposal } from '@/ai/flows/cctv-quotation';
import type { IctProposalOutput, IctProposalInput } from '@/ai/flows/cctv-quotation.schema';
import { annotateImage } from '@/ai/flows/image-annotation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ClipboardCheck, Info, Camera, FileText, Upload, Wand2, FileCheck2, Download, Image as ImageIcon, Shield, ShieldCheck, Wifi, WifiOff, History, ArrowLeft, Video, Building, Eye, Mic, MicOff, Users, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { analyzeFloorPlan, type FloorPlanAnalysisOutput } from '@/ai/flows/floor-plan-analysis';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan file is required.'),
  coverage: z.enum(['Full', 'Partial']).default('Full'),
  coverageType: z.enum(['Interior', 'Exterior']).optional(),
  connectivity: z.enum(['WiFi', 'Wired']).default('Wired'),
  purpose: z.enum(['General Security', 'Employee Monitoring', 'Asset Protection', 'Customer Traffic Analysis']).default('General Security'),
  remoteViewing: z.boolean().default(true),
  audioRecording: z.boolean().default(false),
  recordingDays: z.coerce.number().min(7).default(30),
  areasToMonitor: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;
type PageState = 'form' | 'loading' | 'result';

export default function EstimatorForm() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [loadingMessage, setLoadingMessage] = useState('Designing Your System...');
  const [response, setResponse] = useState<IctProposalOutput | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FloorPlanAnalysisOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coverage: 'Full',
      connectivity: 'Wired',
      purpose: 'General Security',
      remoteViewing: true,
      audioRecording: false,
      recordingDays: 30,
      areasToMonitor: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setLoadingMessage('Generating Equipment Proposal...');
    setResponse(null);
    setAnnotatedImageUrl(null);

    const floorPlanFile = data.floorPlanFile[0];
    const floorPlanUri = await fileToDataURI(floorPlanFile);
    setBaseImageUrl(floorPlanUri);

    try {
      let surveillanceDetails = `
        - Purpose: ${data.purpose}
        - Coverage Level: ${data.coverage}
        - Connectivity: ${data.connectivity}
        - Recording Storage: ${data.recordingDays} days
        - Key Areas to Monitor: ${data.areasToMonitor || 'General coverage'}
        - Remote Viewing: ${data.remoteViewing ? 'Required' : 'Not Required'}
        - Audio Recording: ${data.audioRecording ? 'Required' : 'Not Required'}
      `;
      if (data.coverage === 'Partial' && data.coverageType) {
        surveillanceDetails += `\n- Partial Coverage Area: ${data.coverageType}`;
      }

      const proposalInput: IctProposalInput = {
        projectName: floorPlanFile.name,
        projectType: analysis?.projectType as any,
        includeSurveillance: true,
        surveillanceDetails: surveillanceDetails,
        purpose: data.purpose,
        coverageType: data.coverageType,
        remoteViewing: data.remoteViewing,
        audioRecording: data.audioRecording,
      };
      
      const proposalResult = await generateIctProposal(proposalInput);
      setResponse(proposalResult);
      
      setLoadingMessage('Placing Equipment on Floor Plan...');
      const equipmentList = proposalResult.surveillanceSystem.equipmentList.map(item => `${item.quantity}x ${item.item}`).join(', ');
      
      const annotationResult = await annotateImage({
          baseImageUri: floorPlanUri,
          prompt: `Overlay professional, semi-transparent icons on this floor plan to show the placement of the following surveillance equipment: ${equipmentList}. Place cameras logically based on the requirements: ${surveillanceDetails}.`
      });
      
      setAnnotatedImageUrl(annotationResult.imageDataUri);

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

  const CardSelector = ({ name, options }: { name: "coverage" | "connectivity" | "remoteViewing" | "audioRecording" | "coverageType" | "purpose", options: {value: any, label: string, icon: React.ElementType, description: string}[]}) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <FormItem key={String(option.value)}>
                <FormControl>
                  <Card
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      field.value === option.value && "ring-2 ring-primary shadow-lg"
                    )}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                      <option.icon className="w-8 h-8 text-primary" />
                      <FormLabel className="font-semibold cursor-pointer">{option.label}</FormLabel>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </CardContent>
                  </Card>
                </FormControl>
              </FormItem>
            ))}
          </div>
        </FormItem>
      )}
    />
  );

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
        
        let specs = form.getValues('areasToMonitor') || '';
        if (result.dimensions) {
            specs += `\nEstimated building dimensions from plan: ${result.dimensions}.`;
        }
        if (result.suggestedDvrLocation) {
            specs += `\nConsider placing the main equipment in the ${result.suggestedDvrLocation}.`;
        }
        
        if (result.projectType) {
            const currentValues = form.getValues();
            form.reset({
                ...currentValues,
                areasToMonitor: specs.trim(),
            });
        } else {
             form.setValue('areasToMonitor', specs.trim());
        }

        toast({ title: 'Floor Plan Analyzed', description: 'AI has provided insights. Review the pre-filled "Specific Areas to Monitor" section.' });

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
  
  const watchCoverage = form.watch('coverage');


  if (pageState === 'loading') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">{loadingMessage}</CardTitle>
              <CardDescription>Our AI Architect is working. This may take up to a minute.</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pageState === 'result' && response) {
    const totalPurchaseCost = response.costBreakdown.grandTotalForPurchaseOption || response.costBreakdown.totalPurchaseCost;
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
              <p className="text-3xl font-bold text-primary">OMR {totalPurchaseCost.toFixed(2)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <ClipboardCheck className="h-4 w-4" />
            <AlertTitle>Executive Summary</AlertTitle>
            <AlertDescription>{response.executiveSummary}</AlertDescription>
          </Alert>
            
          {annotatedImageUrl && baseImageUrl && (
               <div>
                  <h3 className="text-lg font-semibold mb-2">Annotated Installation Plan</h3>
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
                        <a href={annotatedImageUrl} download="annotated_plan.png"><Download className="mr-2 h-4 w-4" /> Download Plan</a>
                    </Button>
                  </div>
              </div>
          )}

          {response.surveillanceSystem.equipmentList.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Proposed Equipment List (Purchase)</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Unit Price (OMR)</TableHead><TableHead className="text-right">Total (OMR)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {response.surveillanceSystem.equipmentList.map((item, index) => (
                    <TableRow key={index}><TableCell>{item.item}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right">{item.unitPrice.toFixed(2)}</TableCell><TableCell className="text-right font-medium">{item.totalPrice.toFixed(2)}</TableCell></TableRow>
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
            <Button onClick={() => { setResponse(null); setPageState('form'); form.reset(); }} variant="outline" className="w-full sm:w-auto">Request a New Proposal</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Surveillance Proposal Request</CardTitle>
        <CardDescription>Answer a few questions and our AI will design a complete surveillance package for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <FormField
                control={form.control}
                name="floorPlanFile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>1. Upload your Building Floor Plan</FormLabel>
                         <div className="flex gap-2">
                            <FormControl className="flex-1">
                                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => {
                                    field.onChange(e.target.files);
                                    setAnalysis(null); // Reset analysis if file changes
                                }} />
                            </FormControl>
                            <Button type="button" variant="secondary" onClick={handleFloorPlanAnalysis} disabled={isAnalyzing}>
                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                Analyze
                            </Button>
                        </div>
                        <FormDescription>Upload a floor plan, sketch, or photo. Our AI will analyze it to assist you.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {analysis && (
                <Alert>
                    <FileCheck2 className="h-4 w-4" />
                    <AlertTitle>AI Analysis Complete</AlertTitle>
                    <AlertDescription>
                        {analysis.projectType && <p><strong>Inferred Project Type:</strong> {analysis.projectType}</p>}
                        {analysis.dimensions && <p><strong>Dimensions:</strong> {analysis.dimensions}</p>}
                        {analysis.suggestedDvrLocation && <p><strong>Suggested Equipment Room:</strong> {analysis.suggestedDvrLocation}</p>}
                        <p className="text-xs mt-1">This information has been added to the "Specific Areas to Monitor" section below. You can edit it if needed.</p>
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-3">
                <FormLabel>2. Select Coverage Level</FormLabel>
                <CardSelector
                    name="coverage"
                    options={[
                        { value: 'Full', label: 'Full Coverage', icon: ShieldCheck, description: "Monitor all critical areas and perimeters." },
                        { value: 'Partial', label: 'Partial Coverage', icon: Shield, description: "Focus only on specific, high-priority zones." },
                    ]}
                />
            </div>

             {watchCoverage === 'Partial' && (
              <div className="space-y-3">
                  <FormLabel>2a. Specify Partial Coverage Area</FormLabel>
                   <CardSelector
                      name="coverageType"
                      options={[
                          { value: 'Interior', label: 'Interior', icon: Building, description: 'Monitor inside rooms and hallways.' },
                          { value: 'Exterior', label: 'Exterior', icon: Camera, description: 'Monitor outdoor areas and building perimeter.' },
                      ]}
                  />
              </div>
            )}
             <div className="space-y-3">
                <FormLabel>3. Select Purpose of Surveillance</FormLabel>
                <CardSelector
                    name="purpose"
                    options={[
                        { value: 'General Security', label: 'General Security', icon: ShieldCheck, description: "Deterrence and incident review." },
                        { value: 'Employee Monitoring', label: 'Employee Monitoring', icon: Users, description: "Monitor staff activity and productivity." },
                        { value: 'Asset Protection', label: 'Asset Protection', icon: Briefcase, description: "Protect valuable equipment or stock." },
                        { value: 'Customer Traffic Analysis', label: 'Traffic Analysis', icon: Eye, description: "Analyze customer flow and behavior." },
                    ]}
                />
            </div>
            
            <div className="space-y-3">
                <FormLabel>4. Select Connectivity Type</FormLabel>
                <CardSelector
                    name="connectivity"
                    options={[
                        { value: 'Wired', label: 'Wired (PoE)', icon: WifiOff, description: "Reliable, powered over ethernet. Recommended." },
                        { value: 'WiFi', label: 'Wireless (Wi-Fi)', icon: Wifi, description: "Flexible placement, requires power outlets." },
                    ]}
                />
            </div>
            
            <div className="space-y-3">
                <FormLabel>5. Select Viewing & Audio Options</FormLabel>
                 <CardSelector
                    name="remoteViewing"
                    options={[
                        { value: true, label: 'Remote Viewing', icon: Eye, description: "Access live feed from your mobile." },
                        { value: false, label: 'Local Only', icon: Shield, description: "Viewing only available on-site." },
                    ]}
                />
                 <div className="pt-4">
                  <CardSelector
                      name="audioRecording"
                      options={[
                          { value: true, label: 'With Audio', icon: Mic, description: "Cameras will record audio." },
                          { value: false, label: 'No Audio', icon: MicOff, description: "Video only, no audio recording." },
                      ]}
                  />
                 </div>
            </div>

            <FormField
              control={form.control}
              name="recordingDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><History className="h-5 w-5"/> 6. Recording Storage Duration</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormDescription>How many days of continuous recording do you need to store?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField control={form.control} name="areasToMonitor" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Video className="h-5 w-5"/> 7. Specific Areas to Monitor (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., 'Main entrance, back door, parking lot, and server room.'" {...field} rows={3} /></FormControl>
                </FormItem>
            )} />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg" disabled={pageState === 'loading' || isAnalyzing}>
                {pageState === 'loading' || isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Get AI Proposal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
