'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Route, MapPin, ListChecks, FileText, Bot, DollarSign } from 'lucide-react';
import { ProTaskBaseInputSchema, type ProTaskAnalysisOutput } from '@/ai/flows/pro-task-analysis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { OMAN_GOVERNORATES } from '@/lib/oman-locations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { analyzeSanadTask } from '@/ai/flows/sanad-task-analysis';
import type { SanadTaskAnalysisOutput } from '@/ai/flows/sanad-task-analysis.schema';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzeProTask } from '@/ai/flows/pro-task-analysis';


// Dummy map component placeholder
const DummyMap = ({ onLocationSelect }: { onLocationSelect: (loc: { lat: number, lon: number, name: string }) => void }) => (
    <div 
        className="h-64 w-full bg-muted rounded-lg flex items-center justify-center border-dashed border-2 cursor-pointer"
        onClick={() => onLocationSelect({ lat: 23.5518, lon: 58.5024, name: 'Al Amerat Office' })}
    >
        <p className="text-muted-foreground text-center">
            <MapPin className="mx-auto h-8 w-8 mb-2"/>
            Click to select start location on map<br/>(Using Al Amerat as default)
        </p>
    </div>
);

const ProTaskFormSchema = ProTaskBaseInputSchema.extend({
    serviceName: z.string().min(1, "Please select a service."),
});
type ProTaskFormValues = z.infer<typeof ProTaskFormSchema>;


export default function ProForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SanadTaskAnalysisOutput | null>(null);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ProTaskFormValues>({
    resolver: zodResolver(ProTaskFormSchema),
    defaultValues: {
      governorate: 'Muscat',
      serviceName: '',
    },
  });

  const handleServiceChange = async (serviceName: string) => {
    if (!serviceName) {
        setAnalysisResult(null);
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    form.setValue('serviceName', serviceName);
    try {
        const result = await analyzeSanadTask({ serviceName });
        setAnalysisResult(result);
    } catch(e) {
        toast({ title: "Analysis Failed", description: "Could not get details for this service.", variant: "destructive"});
    } finally {
        setIsAnalyzing(false);
    }
  }

  const onSubmit: SubmitHandler<ProTaskFormValues> = async (data) => {
    if (!analysisResult) {
        toast({ title: "Please wait", description: "Service analysis must be complete before estimating costs.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeProTask({ ...data, ...analysisResult });
      setResponse(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your PRO task has been analyzed and costs estimated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: { lat: number, lon: number, name: string }) => {
    form.setValue('startLocationCoords', { lat: location.lat, lon: location.lon });
    form.setValue('startLocationName', location.name);
    toast({ title: 'Location Selected', description: `'${location.name}' set as the starting point.` });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>PRO Task Delegation</CardTitle>
          <CardDescription>Select the service required, and our AI will plan the optimal route, estimate allowances, and list required documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField
                        control={form.control}
                        name="serviceName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Service</FormLabel>
                                <Select onValueChange={(value) => { handleServiceChange(value); }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a government service..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(sanadServiceGroups).map(([group, services]) => (
                                            <SelectGroup key={group}>
                                                <SelectLabel>{group}</SelectLabel>
                                                {services.map(service => (
                                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="governorate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Governorate</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a governorate..." /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {OMAN_GOVERNORATES.map(gov => (
                                            <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div>
                            <FormLabel>Start Location</FormLabel>
                            <DummyMap onLocationSelect={handleLocationSelect} />
                        </div>
                    </div>
                </div>

                 {(isAnalyzing || analysisResult) && (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Bot className="w-6 h-6 text-primary"/>
                            <CardTitle className="text-lg">Agent Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isAnalyzing && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing service requirements...</div>}
                            {analysisResult && (
                                <div className="space-y-4 text-sm">
                                    {analysisResult.serviceFee && (
                                         <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2"><DollarSign /> Est. Government Fee:</h4>
                                            <p className="font-mono text-lg text-primary">OMR {analysisResult.serviceFee.toFixed(3)}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2"><ListChecks /> Required Documents:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {analysisResult.documentList.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                    {analysisResult.notes && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Important Notes:</h4>
                                            <p className="text-muted-foreground italic">{analysisResult.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}


              <Button type="submit" disabled={isLoading || isAnalyzing || !analysisResult} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Analyze Task & Estimate Costs</>
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
                <p className="mt-4 text-muted-foreground">Fahim is planning the route and estimating costs...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Task Analysis & Cost Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Route className="h-5 w-5"/> Trip Plan</h3>
                <p className="text-sm text-muted-foreground">{response.tripDescription}</p>
                 {response.unmappedLocations && response.unmappedLocations.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertTitle>Unmapped Locations</AlertTitle>
                        <AlertDescription>Could not find GPS data for: {response.unmappedLocations.join(', ')}. These locations were not included in the distance calculation.</AlertDescription>
                    </Alert>
                )}
             </div>
             <div>
                <h3 className="font-semibold mb-2">Estimated Allowances</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Allowance</TableHead>
                        <TableHead className="text-right">Amount (OMR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.allowances.map((allowance, index) => (
                        <TableRow key={index}>
                            <TableCell>{allowance.description}</TableCell>
                            <TableCell className="text-right font-medium">{allowance.amount.toFixed(3)}</TableCell>
                        </TableRow>
                        ))}
                         <TableRow className="bg-muted font-bold">
                            <TableCell>Grand Total</TableCell>
                            <TableCell className="text-right text-base text-primary">{response.grandTotal.toFixed(3)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
             </div>
          </CardContent>
           <CardFooter>
                <Button className="w-full" disabled>Assign to PRO Agent</Button>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}
