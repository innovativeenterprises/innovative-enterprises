
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, ClipboardList, Wand2, FileCheck2 } from 'lucide-react';
import { generateBoq } from '@/ai/flows/boq-generator';
import type { BoQGeneratorOutput } from '@/ai/flows/boq-generator.schema';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { analyzeFloorPlan, type FloorPlanAnalysisOutput } from '@/ai/flows/floor-plan-analysis';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  projectType: z.enum(['Residential Villa', 'Commercial Building', 'Industrial Warehouse'], {
    required_error: "Please select a project type.",
  }),
  numberOfFloors: z.coerce.number().min(1, "Number of floors must be at least 1."),
  additionalSpecs: z.string().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function CalculatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FloorPlanAnalysisOutput | null>(null);
  const [response, setResponse] = useState<BoQGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        projectType: 'Residential Villa',
        numberOfFloors: 1,
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
    try {
        const uri = await fileToDataURI(floorPlanFile[0]);
        const result = await analyzeFloorPlan({ documentDataUri: uri });
        setAnalysis(result);
        
        let specs = form.getValues('additionalSpecs') || '';
        if (result.dimensions) {
            specs += `\nEstimated building dimensions from plan: ${result.dimensions}.`;
            
            // Try to parse number of floors from dimensions string
            const floorMatch = result.dimensions.match(/(\d+)\s*floors?/i);
            if (floorMatch && floorMatch[1]) {
                form.setValue('numberOfFloors', parseInt(floorMatch[1], 10));
            }
        }
        form.setValue('additionalSpecs', specs.trim());

        toast({ title: 'Floor Plan Analyzed', description: 'AI has added its findings to your project details.' });

    } catch (e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze the floor plan. Please describe your needs manually.', variant: 'destructive' });
    } finally {
        setIsAnalyzing(false);
    }
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const floorPlanUri = await fileToDataURI(data.floorPlanFile[0]);
      const result = await generateBoq({ 
          floorPlanUri,
          projectType: data.projectType,
          numberOfFloors: data.numberOfFloors,
          additionalSpecs: data.additionalSpecs
      });
      setResponse(result);
      toast({ title: 'Calculation Complete!', description: 'Your Bill of Quantities is ready.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the BoQ. Please check the uploaded file and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide your project information and upload the floor plan. Use the AI Analyzer for assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="floorPlanFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Floor Plan Document (PDF or Image)</FormLabel>
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
                 {analysis && (
                    <Alert>
                        <FileCheck2 className="h-4 w-4" />
                        <AlertTitle>AI Analysis Complete</AlertTitle>
                        <AlertDescription>
                            {analysis.dimensions && <p><strong>Dimensions:</strong> {analysis.dimensions}</p>}
                            {analysis.suggestedDvrLocation && <p><strong>Suggested Equipment Room:</strong> {analysis.suggestedDvrLocation}</p>}
                            <p className="text-xs mt-1">This information has been added to the specifications below.</p>
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a project type..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Residential Villa">Residential Villa</SelectItem>
                                    <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                                    <SelectItem value="Industrial Warehouse">Industrial Warehouse</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="numberOfFloors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Floors</FormLabel>
                                <FormControl><Input type="number" min="1" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="additionalSpecs"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Specifications (Optional)</FormLabel>
                            <FormControl><Textarea placeholder="e.g., 'Use high-strength concrete for foundations. Include basic electrical wiring and plumbing fixtures in the BoQ.'" rows={4} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

              <Button type="submit" disabled={isLoading || isAnalyzing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Calculating Quantities...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Generate BoQ</>
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your floor plan and calculating quantities...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-6 w-6"/> Preliminary Bill of Quantities</CardTitle>
            <CardDescription>{response.summary}</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Item Description</TableHead>
                        <TableHead className="text-center">Unit</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {response.boqItems.map((item, index) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
