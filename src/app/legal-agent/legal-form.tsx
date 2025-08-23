'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { askLegalAgent } from '@/ai/flows/legal-agent';
import { LegalAgentInputSchema, type LegalAgentOutput, type LegalAgentInput } from '@/ai/flows/legal-agent.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Scale } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LegalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<LegalAgentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<LegalAgentInput>({
    resolver: zodResolver(LegalAgentInputSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit: SubmitHandler<LegalAgentInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const result = await askLegalAgent(data);
        setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get legal analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Legal Agent</CardTitle>
          <CardDescription>Ask a legal question or describe a situation for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Question / Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What are the key considerations for drafting a non-disclosure agreement (NDA)?"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
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
                    <Scale className="mr-2 h-4 w-4" />
                    Get Analysis
                   </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="mt-8">
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your query...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Legal Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap">
                {response.analysis}
             </div>
            <Alert variant="destructive">
                <Scale className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                    {response.disclaimer}
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
}
