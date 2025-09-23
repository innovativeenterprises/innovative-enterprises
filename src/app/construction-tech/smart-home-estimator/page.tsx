
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
import { Loader2, Sparkles, Cpu, Lightbulb, Thermometer, Lock, Clapperboard, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fileToDataURI } from '@/lib/utils';
import { estimateSmartHome } from '@/ai/flows/smart-home-estimator';
import type { SmartHomeEstimatorOutput } from '@/ai/flows/smart-home-estimator.schema';
import Image from 'next/image';

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan file is required.'),
  automationLevel: z.enum(['Essential', 'Advanced', 'Luxury']),
});

type FormValues = z.infer<typeof FormSchema>;
type PageState = 'form' | 'loading' | 'result';

export default function SmartHomeEstimatorPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<SmartHomeEstimatorOutput | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      automationLevel: 'Advanced',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setPageState('loading');
    setResponse(null);
    setBaseImageUrl(null);

    try {
      const floorPlanUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImageUrl(floorPlanUri);

      const estimationResult = await estimateSmartHome({ ...data, floorPlanUri });
      setResponse(estimationResult);

      setPageState('result');
      toast({
        title: 'Estimate Generated!',
        description: 'Your smart home system proposal is ready.',
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

  const resetForm = () => {
    setPageState('form');
    setResponse(null);
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
                        <CardTitle className="text-2xl">Designing Your Smart Home...</CardTitle>
                        <CardDescription>Our AI is analyzing your floor plan and selecting the best devices.</CardDescription>
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
                        <CardTitle>AI Smart Home - Preliminary Proposal</CardTitle>
                        <CardDescription>This is an AI-generated estimate based on your floor plan and desired automation level.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {baseImageUrl && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Analyzed Floor Plan</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
                                    <Image src={baseImageUrl} alt="Original Floor Plan" layout="fill" objectFit="contain" />
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Estimated Bill of Materials</h3>
                            <Table>
                                <TableHeader><TableRow><TableHead>System</TableHead><TableHead>Device</TableHead><TableHead className="text-center">Qty</TableHead><TableHead className="text-right">Unit Cost</TableHead><TableHead className="text-right">Total Cost</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {response.equipmentList.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Badge variant='secondary'>{item.type}</Badge></TableCell>
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
                                    <div className="flex justify-between"><span>Total Device Cost:</span><span className="font-mono">OMR {response.totalMaterialCost.toFixed(2)}</span></div>
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
                        <CardTitle>Smart Home Estimate</CardTitle>
                        <CardDescription>Upload a floor plan and choose your desired level of automation.</CardDescription>
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
                                        <FormControl>
                                            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="automationLevel"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>2. Desired Automation Level</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Essential">Essential (Lighting & Hub)</SelectItem>
                                            <SelectItem value="Advanced">Advanced (Lighting, Climate, Security)</SelectItem>
                                            <SelectItem value="Luxury">Luxury (Full Automation & Entertainment)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
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
              <Cpu className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Smart Home Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thinking about a smart home? Upload your floor plan, choose your desired level of automation, and our AI will generate a preliminary equipment list and cost estimate for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
