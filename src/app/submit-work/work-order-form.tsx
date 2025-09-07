
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
import { Input } from "@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, FileText, ClipboardList, Milestone, CircleDollarSign, Calendar, Mic } from 'lucide-react';
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
          description: 'Your work order has been successfully analyzed.',
        })
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the work order. Please try again.',
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
          <CardTitle>Submit Your Idea or Challenge</CardTitle>
          <CardDescription>Fill in the details below. Our AI will analyze your submission and suggest the best way to move forward.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'New Mobile App for E-Commerce Store' or 'A Campaign to Reduce Plastic Waste'" {...field} />
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
                      <FormLabel>Reward / Budget (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., '$10,000' or 'Non-monetary recognition'" {...field} />
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
                        <Input placeholder="e.g., '3 months' or 'Q4 2024'" {...field} />
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
                    <FormDescription>Upload a project brief, specifications, or any other relevant file.</FormDescription>
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
                    Analyze Submission
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
                    <CardTitle>Analysis Complete</CardTitle>
                    <CardDescription>Our AI has categorized your request and prepared it for the next steps.</CardDescription>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Recommended Category</p>
                    <Badge variant="default" className="text-lg mt-1">{response.category}</Badge>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Public Summary</h3>
              <p className="text-sm text-muted-foreground mt-2 p-4 bg-muted rounded-md border">
                This is the summary that will be reviewed for our public opportunities board to attract talent.
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
                Talia, our Talent & Competition Agent, will handle the posting of this opportunity once approved by our team.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
