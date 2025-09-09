

'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, ListChecks } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { analyzeSanadTask } from '@/ai/flows/sanad-task-analysis';
import type { SanadTaskAnalysisOutput } from '@/ai/flows/sanad-task-analysis.schema';

const FormSchema = z.object({
  serviceName: z.string().min(1, "Please select a service."),
  notes: z.string().optional(),
  contactPhone: z.string().min(8, "A valid phone number is required."),
  document: z.any().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SanadTaskAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceName: '',
      notes: '',
      contactPhone: '',
    },
  });

  const handleServiceChange = async (serviceName: string) => {
    if (!serviceName) {
        setAnalysisResult(null);
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeSanadTask({ serviceName });
        setAnalysisResult(result);
    } catch(e) {
        toast({ title: "Analysis Failed", description: "Could not get details for this service.", variant: "destructive"});
    } finally {
        setIsAnalyzing(false);
    }
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    // In a real app, this would submit the task to a backend,
    // which would then route it to the Sanad office network.
    await new Promise(res => setTimeout(res, 2000));

    console.log("Submitting Sanad Task:", data);
    
    toast({
      title: "Task Submitted!",
      description: "Your task has been sent to our network of Sanad offices. You will receive quotes shortly.",
    });
    setIsSubmitted(true);
    setIsLoading(false);
  };
  
  if (isSubmitted) {
      return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Task Submitted Successfully!</CardTitle>
                        <CardDescription>
                            Your request has been broadcast to our network. You will receive notifications with quotes from Sanad offices soon.
                        </CardDescription>
                    </div>
                    <Button onClick={() => { setIsSubmitted(false); form.reset(); setAnalysisResult(null); }}>Submit Another Task</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Submit a New Task</CardTitle>
          <CardDescription>Select a service and provide the necessary details. Your request will be sent out for tender to our network of Sanad offices.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="serviceName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Service</FormLabel>
                                <Select onValueChange={(value) => { field.onChange(value); handleServiceChange(value); }} defaultValue={field.value}>
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
                    
                    {(isAnalyzing || analysisResult) && (
                        <Card className="bg-muted/50">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <ListChecks className="w-6 h-6 text-primary"/>
                                <CardTitle className="text-lg">Requirements Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isAnalyzing && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing requirements...</div>}
                                {analysisResult && (
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <h4 className="font-semibold mb-2">Required Documents:</h4>
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

                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Additional Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Provide any extra details or specific instructions related to your request." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem><FormLabel>Contact Phone Number</FormLabel><FormControl><Input placeholder="+968 XXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="document" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attach Supporting Document (Optional)</FormLabel>
                            <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" disabled={isLoading || isAnalyzing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Task...</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Submit Task to Network</>
                    )}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
