
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCctvQuotation } from '@/ai/flows/cctv-quotation';
import type { CctvQuotationOutput, CctvQuotationInput } from '@/ai/flows/cctv-quotation.schema';
import { analyzeFloorPlan } from '@/ai/flows/floor-plan-analysis';
import { analyzeWorkOrder } from '@/ai/flows/work-order-analysis';
import type { Opportunity } from '@/lib/opportunities';
import { useOpportunitiesData } from '@/app/admin/opportunity-table';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, UploadCloud, Info, ClipboardCheck, CircleDollarSign, Camera, ScanLine, Building, Home, Warehouse, School, Hospital, Hotel, Wifi, WifiOff, Expand, Shrink, Construction, Plus, RefreshCw, Shield, Users, VenetianMask, PawPrint, Baby, Video, AudioWaveform, CameraOff, TowerControl, Tv, Sun, Moon, Map } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CameraCapture } from '@/components/camera-capture';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const buildingTypes = [
    { id: 'Villa', label: 'Villa', icon: Home },
    { id: 'Office Building', label: 'Office', icon: Building },
    { id: 'Warehouse', label: 'Warehouse', icon: Warehouse },
    { id: 'School', label: 'School', icon: School },
    { id: 'Hospital', label: 'Hospital', icon: Hospital },
    { id: 'Hotel', label: 'Hotel', icon: Hotel },
];

const purposePresets = [
    { id: 'general_security', label: 'General Security', description: 'Overall surveillance for safety and deterrence.', icon: Shield },
    { id: 'employee_monitoring', label: 'Employee Monitoring', description: 'Overseeing staff activity and productivity.', icon: Users },
    { id: 'theft_prevention', label: 'Theft Prevention', description: 'Focusing on deterring and catching theft.', icon: VenetianMask },
    { id: 'child_monitoring', label: 'Child Monitoring', description: 'Keeping an eye on children at home.', icon: Baby },
    { id: 'pet_monitoring', label: 'Pet Monitoring', description: 'Watching over pets while you are away.', icon: PawPrint },
];

const surveillanceAreaTypes = [
    { id: 'Internal Only', label: 'Internal', description: 'Inside the building', icon: Home },
    { id: 'External Only', label: 'External', description: 'Outside perimeter', icon: Sun },
    { id: 'Both', label: 'Both', description: 'Internal and external', icon: Map },
];

const coverageTypes = [
    { id: 'Full Environment', label: 'Full', description: 'Cover all areas', icon: Expand },
    { id: 'Partial', label: 'Partial', description: 'Cover specific areas', icon: Shrink },
];

const remoteMonitoringTypes = [
    { id: 'Yes', label: 'Yes', description: 'Monitor from anywhere', icon: Wifi },
    { id: 'No', label: 'No', description: 'Local viewing only', icon: WifiOff },
];

const existingSystemTypes = [
    { id: 'None', label: 'None', description: 'New installation', icon: Plus },
    { id: 'Keep Some', label: 'Keep Some', description: 'Integrate parts', icon: Construction },
    { id: 'Replace All', label: 'Replace All', description: 'Full upgrade', icon: RefreshCw },
];

const FormSchema = z.object({
  purposePreset: z.string().optional(),
  purpose: z.string().min(10, { message: "Please describe the purpose in more detail." }),
  buildingType: z.string({ required_error: "Please select a building type." }),
  buildingDimensions: z.string().optional(),
  numberOfFloors: z.coerce.number().optional(),
  buildingHeight: z.string().optional(),
  floorPlanUri: z.string().optional(),
  floorPlanFile: z.any().optional(),
  surveillanceArea: z.enum(['Internal Only', 'External Only', 'Both'], { required_error: "Please select the surveillance area." }),
  coverage: z.enum(['Full Environment', 'Partial'], { required_error: "Coverage selection is required." }),
  coverageDetails: z.string().optional(),
  remoteMonitoring: z.enum(['Yes', 'No'], { required_error: "Remote monitoring selection is required." }),
  existingSystem: z.enum(['None', 'Keep Some', 'Replace All'], { required_error: "Existing system selection is required." }),
  dvrSwitchTvLocation: z.string().min(3, { message: "Please specify the location." }),
  
  // New fields
  cameraType: z.enum(['Any', 'Dome', 'Bullet', 'PTZ']),
  cameraResolution: z.enum(['Standard HD', '4K Ultra HD']),
  nightVision: z.boolean(),
  audioRecording: z.boolean(),
  storageDuration: z.coerce.number().min(7),

}).refine(data => data.floorPlanUri || (data.floorPlanFile && data.floorPlanFile.length > 0) || data.buildingDimensions, {
    message: "A floor plan, sketch, photo, or building dimensions must be provided.",
    path: ["floorPlanFile"],
}).refine(data => data.coverage !== 'Partial' || (data.coverage === 'Partial' && data.coverageDetails && data.coverageDetails.length > 5), {
    message: "Please describe which areas need partial coverage.",
    path: ["coverageDetails"],
});


type FormValues = z.infer<typeof FormSchema>;

type PageState = 'form' | 'capturing' | 'loading' | 'analyzing_plan' | 'result';

export default function QuotationForm() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [isPosting, setIsPosting] = useState(false);
  const [response, setResponse] = useState<CctvQuotationOutput | null>(null);
  const { toast } = useToast();
  const { setOpportunities } = useOpportunitiesData();
  const router = useRouter();


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      purpose: '',
      buildingType: '',
      buildingDimensions: '',
      coverageDetails: '',
      dvrSwitchTvLocation: '',
      floorPlanUri: '',
      cameraType: 'Any',
      cameraResolution: 'Standard HD',
      nightVision: true,
      audioRecording: false,
      storageDuration: 30,
      numberOfFloors: 1,
      buildingHeight: '',
    },
  });

  const handlePreAnalysis = async (uri: string) => {
    setPageState('analyzing_plan');
    try {
        const result = await analyzeFloorPlan({ documentDataUri: uri });
        if(result.dimensions) form.setValue('buildingDimensions', result.dimensions);
        if(result.suggestedDvrLocation) form.setValue('dvrSwitchTvLocation', result.suggestedDvrLocation);
        toast({ title: 'Pre-Analysis Complete', description: 'AI has suggested dimensions and DVR location.' });
    } catch (e) {
        toast({ title: 'Pre-Analysis Failed', description: 'Could not analyze image. Please enter details manually.', variant: 'destructive' });
    } finally {
        setPageState('form');
    }
  }

  const onImageCaptured = (imageUri: string) => {
    form.setValue('floorPlanUri', imageUri);
    form.setValue('floorPlanFile', undefined); // Clear file input if camera is used
    setPageState('form');
    toast({ title: 'Image Captured!', description: "The captured image will now be analyzed."})
    handlePreAnalysis(imageUri);
  }
  
  const onFileSelected = async (files: FileList | null) => {
    if (files && files.length > 0) {
        const file = files[0];
        form.setValue('floorPlanUri', ''); // Clear captured image if file is selected
        const uri = await fileToDataURI(file);
        handlePreAnalysis(uri);
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setResponse(null);
    try {
      let finalFloorPlanUri = data.floorPlanUri;
      if (data.floorPlanFile && data.floorPlanFile.length > 0) {
        finalFloorPlanUri = await fileToDataURI(data.floorPlanFile[0]);
      }

      if (!finalFloorPlanUri && !data.buildingDimensions) {
          toast({ title: 'Input Missing', description: 'Please provide a plan, photo, or dimensions.', variant: 'destructive'});
          setPageState('form');
          return;
      }

      const input: CctvQuotationInput = {
        ...data,
        remoteMonitoring: data.remoteMonitoring === 'Yes',
        floorPlanUri: finalFloorPlanUri,
      };

      const result = await generateCctvQuotation(input);
      setResponse(result);
      setPageState('result');
      toast({
        title: 'Quotation Generated!',
        description: 'Your CCTV system quotation is ready for review.',
      });
    } catch (error) {
      console.error(error);
      setPageState('form');
      toast({
        title: 'Error Generating Quotation',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePostAsWorkOrder = async () => {
    if (!response) return;

    setIsPosting(true);
    toast({ title: 'Posting Work Order...', description: 'Please wait while we convert your quotation into an opportunity.' });

    try {
        const workOrderAnalysis = await analyzeWorkOrder({
            title: `CCTV Installation for ${form.getValues('buildingType')}`,
            description: response.summary,
            budget: `Approx. OMR ${response.totalEstimatedCost.toFixed(2)}`,
            timeline: 'To be determined',
        });
        
        const newOpportunity: Opportunity = {
            id: response.quotationId,
            title: `CCTV Installation for ${form.getValues('buildingType')}`,
            type: workOrderAnalysis.category,
            prize: `OMR ${response.totalEstimatedCost.toFixed(2)}`,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: workOrderAnalysis.summary,
            iconName: 'Trophy',
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


  const watchCoverage = form.watch('coverage');
  const watchFloorPlanUri = form.watch('floorPlanUri');

  if (pageState === 'loading' || pageState === 'analyzing_plan') {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">{pageState === 'loading' ? 'Generating Your Quotation...' : 'Analyzing Floor Plan...'}</CardTitle>
              <CardDescription>{pageState === 'loading' ? 'Our AI is designing your system. This may take a moment.' : 'Our AI is extracting details from your image.'}</CardDescription>
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

          {response.annotatedPlanUri && (
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Map className="h-5 w-5"/> Annotated Plan</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                    <img src={response.annotatedPlanUri} alt="Annotated floor plan" className="object-contain w-full h-full" />
                </div>
            </div>
          )}

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
          <Button onClick={() => { setResponse(null); setPageState('form'); }} variant="outline" className="w-full sm:w-auto">Request a New Quotation</Button>
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

  if (pageState === 'capturing') {
    return (
        <Card>
            <CameraCapture title="Scan Area or Floor Plan" onCapture={onImageCaptured} onCancel={() => setPageState('form')} />
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Building Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 md:grid-cols-6 gap-2"
                    >
                      {buildingTypes.map(({ id, label, icon: Icon }) => (
                        <FormItem key={id}>
                          <FormControl>
                            <RadioGroupItem value={id} id={id} className="sr-only" />
                          </FormControl>
                          <Label
                            htmlFor={id}
                            className={cn(
                              'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                              field.value === id && 'border-primary'
                            )}
                          >
                            <Icon className="mb-2 h-6 w-6" />
                            {label}
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purposePreset"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Primary Purpose</FormLabel>
                  <FormDescription>Select a preset to start, then add more details below.</FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selected = purposePresets.find(p => p.id === value);
                        if (selected) {
                          form.setValue('purpose', selected.description);
                        }
                      }}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
                    >
                      {purposePresets.map(({ id, label, description, icon: Icon }) => (
                        <FormItem key={id}>
                          <FormControl>
                            <RadioGroupItem value={id} id={`purpose_${id}`} className="sr-only" />
                          </FormControl>
                          <Label
                            htmlFor={`purpose_${id}`}
                            className={cn(
                              'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer text-center',
                              field.value === id && 'border-primary'
                            )}
                          >
                            <Icon className="mb-2 h-6 w-6" />
                            <span className="text-sm">{label}</span>
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField control={form.control} name="purpose" render={({ field }) => (
                <FormItem>
                    <FormLabel>Purpose Details</FormLabel>
                    <FormControl><Textarea placeholder="e.g., General security, monitoring employees, watching pets, etc." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            
            <div>
              <FormLabel>Building Plan or Photo</FormLabel>
              <div className="mt-2 grid grid-cols-2 gap-4">
                 <Button type="button" onClick={() => setPageState('capturing')} variant="outline">
                    <Camera className="mr-2 h-4 w-4"/> Scan with Camera
                 </Button>
                 <FormField control={form.control} name="floorPlanFile" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          type="file" 
                          accept=".pdf,.png,.jpg,.jpeg" 
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            onFileSelected(e.target.files);
                          }} 
                          className="w-full"
                          />
                      </FormControl>
                      <FormMessage className="absolute"/>
                    </FormItem>
                  )} />
              </div>
               {watchFloorPlanUri && (
                <Alert variant="default" className="text-green-800 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800 mt-4">
                    <ScanLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Image Captured</AlertTitle>
                    <AlertDescription>
                        An image from your camera is ready for analysis.
                    </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="buildingDimensions" render={({ field }) => (
                    <FormItem><FormLabel>Building Dimensions</FormLabel><FormControl><Input placeholder="e.g., 25m x 30m" {...field} /></FormControl><FormDescription>Provide if no image.</FormDescription><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="numberOfFloors" render={({ field }) => (
                    <FormItem><FormLabel>Number of Floors</FormLabel><FormControl><Input type="number" min="1" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="buildingHeight" render={({ field }) => (
                    <FormItem><FormLabel>Building Height (m)</FormLabel><FormControl><Input placeholder="e.g., 12m" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="dvrSwitchTvLocation" render={({ field }) => (
                <FormItem><FormLabel>Proposed DVR/Switch/TV Location</FormLabel><FormControl><Input placeholder="e.g., Under the stairs, IT room" {...field} /></FormControl><FormDescription>Where should the main hub be?</FormDescription><FormMessage /></FormItem>
            )} />

            <FormField
              control={form.control}
              name="surveillanceArea"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Surveillance Area</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-2">
                      {surveillanceAreaTypes.map(({ id, label, description, icon: Icon }) => (
                        <FormItem key={id} className="flex-1">
                          <FormControl>
                            <RadioGroupItem value={id} id={`area_${id}`} className="sr-only" />
                          </FormControl>
                           <Label htmlFor={`area_${id}`} className={cn('flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer text-center', field.value === id && 'border-primary')}>
                            <Icon className="mb-2 h-6 w-6" />
                            {label}
                            <span className="text-xs text-muted-foreground">{description}</span>
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="bg-muted/50 p-6">
                 <CardTitle className="text-lg mb-4">System Specifications</CardTitle>
                 <div className="space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField control={form.control} name="cameraType" render={({ field }) => (
                            <FormItem><FormLabel>Camera Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Any">Any Type</SelectItem><SelectItem value="Dome">Dome</SelectItem><SelectItem value="Bullet">Bullet</SelectItem><SelectItem value="PTZ">PTZ</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="cameraResolution" render={({ field }) => (
                            <FormItem><FormLabel>Resolution</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Standard HD">Standard HD</SelectItem><SelectItem value="4K Ultra HD">4K Ultra HD</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="nightVision" render={({ field }) => (
                            <FormItem className="flex flex-col gap-2 rounded-lg border p-3 pt-2 bg-background"><FormLabel>Night Vision</FormLabel><FormControl><div className="flex items-center space-x-2"><Switch id="night-vision-switch" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="night-vision-switch">{field.value ? "Required" : "Not Required"}</Label></div></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="audioRecording" render={({ field }) => (
                           <FormItem className="flex flex-col gap-2 rounded-lg border p-3 pt-2 bg-background"><FormLabel>Audio Recording</FormLabel><FormControl><div className="flex items-center space-x-2"><Switch id="audio-switch" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="audio-switch">{field.value ? "Required" : "Not Required"}</Label></div></FormControl></FormItem>
                        )} />
                     </div>
                      <FormField control={form.control} name="storageDuration" render={({ field }) => (
                        <FormItem><FormLabel>Recording Storage Duration (Days)</FormLabel><FormControl><Input type="number" min="7" step="1" {...field} /></FormControl><FormDescription>How many days of continuous video recording do you need to store?</FormDescription><FormMessage /></FormItem>
                    )} />
                 </div>
            </Card>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="coverage"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Coverage Extent</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                {coverageTypes.map(({ id, label, description, icon: Icon }) => (
                                    <FormItem key={id} className="flex-1">
                                        <FormControl>
                                            <RadioGroupItem value={id} id={`coverage_${id}`} className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor={`coverage_${id}`} className={cn('flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer', field.value === id && 'border-primary')}>
                                            <Icon className="mb-2 h-6 w-6" />
                                            {label}
                                            <span className="text-xs text-muted-foreground">{description}</span>
                                        </Label>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                         <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="remoteMonitoring"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Remote Monitoring</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={(value: 'Yes' | 'No') => field.onChange(value)} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                {remoteMonitoringTypes.map(({ id, label, description, icon: Icon }) => (
                                    <FormItem key={id} className="flex-1">
                                        <FormControl>
                                            <RadioGroupItem value={id} id={`monitoring_${id}`} className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor={`monitoring_${id}`} className={cn('flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer', field.value === id && 'border-primary')}>
                                            <Icon className="mb-2 h-6 w-6" />
                                            {label}
                                            <span className="text-xs text-muted-foreground">{description}</span>
                                        </Label>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                         <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="existingSystem"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Existing System</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-2">
                                {existingSystemTypes.map(({ id, label, icon: Icon }) => (
                                    <FormItem key={id} className="flex-1">
                                        <FormControl>
                                            <RadioGroupItem value={id} id={`system_${id}`} className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor={`system_${id}`} className={cn('flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer text-center', field.value === id && 'border-primary')}>
                                            <Icon className="mb-2 h-6 w-6" />
                                            {label}
                                        </Label>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                         <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            {watchCoverage === 'Partial' && (
                 <FormField control={form.control} name="coverageDetails" render={({ field }) => (
                    <FormItem><FormLabel>Partial Coverage Details</FormLabel><FormControl><Textarea placeholder="e.g., 'Only cover the main entrance, back door, and the ground floor windows.'" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            )}

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pageState==='analyzing_plan'}>
                <Sparkles className="mr-2 h-4 w-4" /> Get AI Quotation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
