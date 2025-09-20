
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, Package, Send } from 'lucide-react';
import { WorkOrderInputSchema, type WorkOrderInput, type WorkOrderAnalysisOutput } from '@/ai/flows/work-order-analysis.schema';
import { analyzeWorkOrder } from '@/ai/flows/work-order-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const FormSchema = WorkOrderInputSchema.extend({
  documentFile: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function WorkOrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WorkOrderAnalysisOutput | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      timeline: '',
    },
  });

  const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setIsSubmitted(false);
    try {
      let documentDataUri: string | undefined;
      if (data.documentFile && data.documentFile.length > 0) {
        documentDataUri = await fileToDataURI(data.documentFile[0]);
      }
      
      const result = await analyzeWorkOrder({ ...data, documentDataUri });
      setResponse(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your idea has been analyzed by our AI.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze your submission. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    setIsLoading(true);
    // In a real app, this would save to a database.
    console.log("Finalizing submission:", response);
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: 'Submission Finalized', description: 'Your idea has been sent to our review team.' });
    }, 1000);
  }

  if (isSubmitted) {
      return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Thank You for Your Submission!</CardTitle>
                        <CardDescription>
                            {response?.nextStepMessage}
                        </CardDescription>
                    </div>
                    <Button onClick={() => { setIsSubmitted(false); setResponse(null); form.reset(); }}>Submit Another Idea</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Idea</CardTitle>
          <CardDescription>Provide as much detail as possible. Our AI, Navi, will perform a preliminary analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea / Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI-Powered Coffee Roaster" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the problem you're solving, your proposed solution, and who the target audience is."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., 10,000 OMR" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Timeline (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., 6 months" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="documentFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supporting Document (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>e.g., Business plan, market research, design mockups.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Analyze My Idea</>
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
                <p className="mt-4 text-muted-foreground">Navi is analyzing your idea against market data...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI-Generated Analysis</CardTitle>
             <CardDescription>
                Here is a preliminary analysis of your idea, generated by Navi.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <Alert>
                    <Package className="h-4 w-4" />
                    <AlertTitle>Submission Categorized As: {response.category}</AlertTitle>
                    <AlertDescription>
                        <p>{response.publicSummary}</p>
                    </AlertDescription>
                </Alert>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Potential Scoring</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <Card className="p-4 bg-muted/50">
                            <CardTitle className="text-2xl">{response.scores.noveltyScore}</CardTitle>
                            <CardDescription>Novelty</CardDescription>
                        </Card>
                         <Card className="p-4 bg-muted/50">
                            <CardTitle className="text-2xl">{response.scores.marketPotentialScore}</CardTitle>
                            <CardDescription>Market Potential</CardDescription>
                        </Card>
                         <Card className="p-4 bg-muted/50">
                            <CardTitle className="text-2xl">{response.scores.impactScore}</CardTitle>
                            <CardDescription>Impact</CardDescription>
                        </Card>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Clarifying Questions for Review</h3>
                     <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        {response.clarifyingQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleFinalSubmit} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4"/>Finalize & Submit Idea to Incubator</>}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
