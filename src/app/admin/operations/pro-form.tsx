
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, MapPin, Route } from 'lucide-react';
import { ProTaskAnalysisInputSchema, type ProTaskAnalysisOutput, type ProTaskAnalysisInput } from '@/ai/flows/pro-task-analysis.schema';
import { analyzeProTask } from '@/ai/flows/pro-task-analysis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OMAN_GOVERNORATES, OMAN_MINISTRIES } from '@/lib/oman-locations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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


export default function ProForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProTaskAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ProTaskAnalysisInput>({
    resolver: zodResolver(ProTaskAnalysisInputSchema),
    defaultValues: {
      institutionNames: [],
    },
  });

  const onSubmit: SubmitHandler<ProTaskAnalysisInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await analyzeProTask(data);
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
    toast({ title: 'Location Selected', description: `${location.name} set as the starting point.` });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>PRO Task Delegation</CardTitle>
          <CardDescription>Select the ministries to visit and the starting point. Our AI will plan the optimal route and estimate allowances.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="institutionNames"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ministries / Institutions to Visit</FormLabel>
                                <Select onValueChange={(value) => field.onChange([...(field.value || []), value])}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add an institution to the list..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {OMAN_MINISTRIES.map(name => (
                                        <SelectItem key={name} value={name} disabled={field.value?.includes(name)}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <div className="space-y-2 mt-2">
                                {field.value?.map((name: string) => (
                                    <div key={name} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                        <span className="text-sm">{name}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => field.onChange(field.value?.filter((v: string) => v !== name))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
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


              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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

