
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeWorkOrder } from '@/ai/flows/work-order-analysis';
import { type WorkOrderInput, WorkOrderInputSchema, type WorkOrderAnalysisOutput } from '@/ai/flows/work-order-analysis.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, ClipboardList, Milestone, CircleDollarSign, Calendar, Mic, Lightbulb, TrendingUp, Target, Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = WorkOrderInputSchema.extend({
  document: z.any().optional(),
});

export default function WorkOrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WorkOrderAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      timeline: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        let documentDataUri: string | undefined;
        if (data.document && data.document.length > 0) {
            const file = data.document[0];
            documentDataUri = await fileToDataURI(file);
        }
      
        const result = await analyzeWorkOrder({
            ...data,
            documentDataUri,
        });

        setResponse(result);
        toast({
          title: 'Analysis Complete!',
          description: 'Your idea has been successfully analyzed.',
        })
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
          <CardDescription>Fill in the details below. Our AI will perform an initial analysis to gauge its potential.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'A mobile app for E-Commerce Store' or 'A campaign to reduce plastic waste'" {...field} />
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
                      <VoiceEnabledTextarea
                        placeholder="Describe the project scope, objectives, key features, target audience, and any other relevant details."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'OMR 10,000' or 'Seeking seed funding'" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="e.g., '3-6 months for MVP'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supporting Document (Optional)</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>Upload a business plan, pitch deck, or any other relevant file.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze My Idea
                   </>
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your submission... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>AI Innovation Analysis</CardTitle>
                    <CardDescription>Our AI has categorized your idea and provided a preliminary analysis.</CardDescription>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Recommended Category</p>
                    <Badge variant="default" className="text-lg mt-1">{response.category}</Badge>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-primary"><Lightbulb className="h-4 w-4" /> Novelty Score</h4>
                      <p className="text-2xl font-bold">{response.noveltyScore}/100</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-primary"><TrendingUp className="h-4 w-4" /> Market Potential</h4>
                      <p className="text-2xl font-bold">{response.marketPotentialScore}/100</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-primary"><Target className="h-4 w-4" /> Impact Score</h4>
                      <p className="text-2xl font-bold">{response.impactScore}/100</p>
                  </div>
              </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Public Summary</h3>
              <p className="text-sm text-muted-foreground mt-2 p-4 bg-muted rounded-md border">
                This is the summary that will be reviewed by our team for potential sponsorship or awards.
              </p>
              <div className="mt-2 prose prose-sm max-w-full rounded-md border bg-background p-4 whitespace-pre-wrap">
                  {response.summary}
              </div>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2"><Milestone className="h-5 w-5" /> Next Steps</h3>
              <div className="mt-2 flex items-center gap-3 text-sm p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-blue-800 dark:text-blue-200">{response.recommendedNextSteps}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
                Talia, our Talent & Competition Agent, may contact you if your idea is shortlisted for an award or our e-incubation program.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
