
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { analyzeWorkOrder } from '@/ai/flows/work-order-analysis';
import { type WorkOrderAnalysisOutput, WorkOrderInputSchema } from '@/ai/flows/work-order-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Bot, FileText, BadgePercent, TrendingUp, Impact, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { fileToDataURI } from '@/lib/utils';
import { useOpportunitiesData } from '@/hooks/use-global-store-data';
import type { Opportunity } from '@/lib/opportunities';
import { opportunityIconMap } from '@/lib/opportunities';

const FormSchema = WorkOrderInputSchema.extend({
  documentFile: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function WorkOrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WorkOrderAnalysisOutput | null>(null);
  const { toast } = useToast();
  const { setOpportunities } = useOpportunitiesData();


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: '',
        description: '',
        budget: '',
        timeline: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      let documentDataUri: string | undefined;
      if (data.documentFile && data.documentFile.length > 0) {
        documentDataUri = await fileToDataURI(data.documentFile[0]);
      }
      
      const result = await analyzeWorkOrder({ 
          ...data,
          documentDataUri,
      });
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your idea has been analyzed by our AI.' });

      // Automatically add the new opportunity to the global state
      const iconName = Object.keys(opportunityIconMap).find(key => key.toLowerCase().includes(result.category.split(" ")[0].toLowerCase())) as keyof typeof opportunityIconMap || 'Trophy';

      const newOpportunity: Opportunity = {
          id: `opp_${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          title: data.title,
          type: result.category,
          prize: data.budget || 'Negotiable',
          deadline: data.timeline || 'To be determined',
          description: result.summary,
          iconName,
          badgeVariant: 'outline',
          status: 'Open',
          questions: result.generatedQuestions,
      };
      setOpportunities(prev => [newOpportunity, ...prev]);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the submission. Please try again.',
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
          <CardTitle>Submit Your Idea</CardTitle>
          <CardDescription>Provide details about your project, task, or startup idea. Our AI will analyze it for categorization and potential.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Project Name</FormLabel>
                    <FormControl><Input placeholder="e.g., AI-powered personal finance app" {...field} /></FormControl>
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
                      <Textarea placeholder="Describe the problem, your proposed solution, and the target audience." rows={8} {...field} />
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
                        <FormLabel>Expected Timeline (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., 3-6 months" {...field} /></FormControl>
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
                    <FormLabel>Attach Supporting Document (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                     <FormDescription>e.g., a brief, business plan, or technical specs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Submission...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Analyze Idea with AI</>
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
                <p className="mt-4 text-muted-foreground">Our AI agents are analyzing your submission...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6"/> AI Analysis Report</CardTitle>
             <CardDescription>
                Your submission has been categorized as a <span className="font-semibold text-primary">{response.category}</span>.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">Opportunity Summary</h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md border">{response.summary}</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-lg mb-2">Potential Scores</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="text-center p-3">
                        <BadgePercent className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-2xl font-bold">{response.noveltyScore}</p>
                        <p className="text-xs text-muted-foreground">Novelty</p>
                    </Card>
                    <Card className="text-center p-3">
                        <TrendingUp className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-2xl font-bold">{response.marketPotentialScore}</p>
                        <p className="text-xs text-muted-foreground">Market Potential</p>
                    </Card>
                    <Card className="text-center p-3">
                        <Lightbulb className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-2xl font-bold">{response.impactScore}</p>
                        <p className="text-xs text-muted-foreground">Impact</p>
                    </Card>
                </div>
            </div>
             
             <div>
                <h3 className="font-semibold text-lg mb-2">Clarifying Questions for Providers</h3>
                <ul className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                    {response.generatedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
            </div>
            
            <Alert>
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>{response.recommendedNextSteps}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
