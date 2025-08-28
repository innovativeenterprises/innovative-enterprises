
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeContract } from '@/ai/flows/contract-risk-analysis';
import type { ContractRiskAnalysisOutput } from '@/ai/flows/contract-risk-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, FileText, CheckCircle, Percent } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  documentFile: z.any().refine(files => files?.length > 0, 'A contract document is required.'),
  analysisType: z.enum(['Standard', 'Deep Dive', 'Compliance Focus']),
});
type FormValues = z.infer<typeof FormSchema>;

export default function AnalysisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ContractRiskAnalysisOutput | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      analysisType: 'Standard',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setIsSubmitted(false);
    try {
      const documentDataUri = await fileToDataURI(data.documentFile[0]);
      
      const result = await analyzeContract({ 
        documentDataUri, 
        analysisType: data.analysisType,
      });
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your contract has been analyzed for risks.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the contract. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
      switch(severity) {
          case 'High': return <Badge variant="destructive">High</Badge>;
          case 'Medium': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Medium</Badge>;
          case 'Low': return <Badge variant="default" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Low</Badge>;
          default: return <Badge variant="outline">{severity}</Badge>
      }
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Contract Risk Analysis</CardTitle>
          <CardDescription>Upload your contract document. Lexi, our AI Legal Analyst, will perform a risk assessment and identify potential issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="documentFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Document</FormLabel>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="analysisType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Analysis</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select analysis type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Standard">Standard Analysis</SelectItem>
                            <SelectItem value="Deep Dive">Deep Dive Analysis</SelectItem>
                            <SelectItem value="Compliance Focus">Compliance Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Document...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Run Risk Analysis</>
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
                <p className="mt-4 text-muted-foreground">Lexi is reviewing your contract...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI-Generated Risk Analysis</CardTitle>
             <CardDescription>
                This is a preliminary analysis of the provided contract.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md border">{response.executiveSummary}</p>
                </div>

                 <div>
                  <h3 className="font-semibold text-lg mb-2">Overall Risk Score</h3>
                  <div className="flex items-center gap-4">
                    <Progress value={response.overallRiskScore} className="h-4" />
                    <span className="font-bold text-lg text-primary">{response.overallRiskScore}/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">A higher score indicates a higher potential risk.</p>
                </div>

                {response.identifiedRisks.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Identified Risks & Recommendations</h3>
                        <Accordion type="single" collapsible className="w-full">
                          {response.identifiedRisks.map((risk, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                  <div className="flex justify-between items-center w-full pr-4">
                                      <span>{risk.riskCategory}: <span className="font-mono text-sm text-primary">{risk.clause}</span></span>
                                      {getSeverityBadge(risk.severity)}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                  <p className="text-sm">{risk.description}</p>
                                  <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Recommendation</AlertTitle>
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                      {risk.recommendation}
                                    </AlertDescription>
                                  </Alert>
                                </AccordionContent>
                              </AccordionItem>
                          ))}
                        </Accordion>
                    </div>
                )}
          </CardContent>
          <CardFooter>
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                   This AI-generated analysis is for informational purposes only and does not constitute legal advice. You should consult with a qualified legal professional for advice specific to your situation.
                </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
