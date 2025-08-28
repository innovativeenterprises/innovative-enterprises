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
import { Loader2, Sparkles, Scale, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSettingsData } from '@/app/admin/settings-table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function LegalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<LegalAgentOutput | null>(null);
  const { toast } = useToast();
  const { settings } = useSettingsData();

  const form = useForm<LegalAgentInput>({
    resolver: zodResolver(LegalAgentInputSchema),
    defaultValues: {
      question: '',
      contractType: 'B2C',
    },
  });

  const watchContractType = form.watch('contractType');

  const onSubmit: SubmitHandler<LegalAgentInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        // In a real app, this would trigger a payment flow before calling the agent.
        // For this prototype, we'll just simulate that by calling the agent directly.
        toast({ title: 'Processing...', description: 'Analyzing your request.' });
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
  
  const getPrice = () => {
    const { legalAgentPricing } = settings;
    switch(watchContractType) {
        case 'B2C': return legalAgentPricing.b2cFee;
        case 'B2B': return legalAgentPricing.b2bFee;
        case 'B2G': return legalAgentPricing.b2gFee;
        default: return 0;
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Legal Assistant</CardTitle>
          <CardDescription>Ask a legal question or describe a situation for analysis. Lexi will provide a preliminary analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Contract/Context Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="B2C" id="b2c" className="sr-only" />
                          </FormControl>
                          <FormLabel htmlFor="b2c" className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground', field.value === 'B2C' && 'border-primary')}>
                            <span className="font-semibold">B2C</span>
                            <span className="text-xs text-muted-foreground">Business-to-Consumer</span>
                            <span className="font-bold text-lg mt-2">OMR {settings.legalAgentPricing.b2cFee.toFixed(2)}</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="B2B" id="b2b" className="sr-only" />
                          </FormControl>
                          <FormLabel htmlFor="b2b" className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground', field.value === 'B2B' && 'border-primary')}>
                             <span className="font-semibold">B2B</span>
                            <span className="text-xs text-muted-foreground">Business-to-Business</span>
                            <span className="font-bold text-lg mt-2">OMR {settings.legalAgentPricing.b2bFee.toFixed(2)}</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="B2G" id="b2g" className="sr-only" />
                          </FormControl>
                           <FormLabel htmlFor="b2g" className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground', field.value === 'B2G' && 'border-primary')}>
                            <span className="font-semibold">B2G</span>
                            <span className="text-xs text-muted-foreground">Business-to-Government</span>
                            <span className="font-bold text-lg mt-2">OMR {settings.legalAgentPricing.b2gFee.toFixed(2)}</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Question / Topic for Analysis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Please review the attached NDA draft for potential risks, or explain the key liabilities in a standard software development contract."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* In a real app, you'd have a separate file upload component here */}

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                   <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed & Analyze (OMR {getPrice().toFixed(2)})
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
                <p className="mt-4 text-muted-foreground">Lexi is analyzing your query...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Legal Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md border">
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
