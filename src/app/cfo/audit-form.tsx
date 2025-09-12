'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeFinancialDocuments } from '@/ai/flows/financial-document-analysis';
import { type FinancialAnalysisOutput } from '@/ai/flows/financial-document-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, FileText, Percent, CheckCircle, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auditOffices } from '@/lib/audit-offices';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { fileToDataURI } from '@/lib/utils';

const FormSchema = z.object({
  financialDocuments: z.any().refine(files => files?.length > 0, 'At least one financial document is required.'),
  analysisType: z.enum(['Full Audit', 'Compliance Check', 'Internal Review', 'Forensic Analysis']),
  companyName: z.string().min(1, 'Company name is required'),
  fiscalYear: z.string().min(4, 'Fiscal year is required'),
  assignedOffice: z.string().min(1, "Please assign an audit office."),
});
type FormValues = z.infer<typeof FormSchema>;

export default function AuditForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FinancialAnalysisOutput | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      analysisType: 'Internal Review',
      companyName: 'Innovative Enterprises',
      fiscalYear: '',
      assignedOffice: '',
    },
  });

  useEffect(() => {
    // Set year only on client to avoid hydration mismatch
    form.setValue('fiscalYear', new Date().getFullYear().toString());
  }, [form]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setIsSubmitted(false);
    try {
      const documentPromises = Array.from(data.financialDocuments as FileList).map(fileToDataURI);
      const financialDocuments = await Promise.all(documentPromises);
      
      const result = await analyzeFinancialDocuments({ 
        financialDocuments, 
        analysisType: data.analysisType,
        companyName: data.companyName,
        fiscalYear: data.fiscalYear,
      });
      setResponse(result);
      toast({ title: 'Analysis Complete!', description: 'Your documents have been analyzed.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitToOffice = () => {
    setIsLoading(true);
    // Simulate API call to send the report
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: 'Report Submitted', description: `The analysis has been securely sent to ${form.getValues('assignedOffice')}.` });
    }, 1500);
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
                        <CardTitle className="text-2xl">Analysis Sent Successfully!</CardTitle>
                        <CardDescription>
                           Your preliminary financial analysis has been securely transmitted to your selected audit office. They will contact you shortly to begin the formal engagement.
                        </CardDescription>
                    </div>
                    <Button onClick={() => { setIsSubmitted(false); form.reset(); setResponse(null); }}>Start a New Analysis</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Financial Document Analysis</CardTitle>
          <CardDescription>Upload your financial documents (e.g., balance sheets, income statements). Our AI will perform a preliminary analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="financialDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Documents</FormLabel>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fiscalYear" render={({ field }) => (
                    <FormItem><FormLabel>Fiscal Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
              </div>
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
                            <SelectItem value="Internal Review">Internal Review</SelectItem>
                            <SelectItem value="Compliance Check">Compliance Check</SelectItem>
                            <SelectItem value="Full Audit">Full Audit</SelectItem>
                            <SelectItem value="Forensic Analysis">Forensic Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
               <FormField
                control={form.control}
                name="assignedOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Audit Office</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a certified audit office..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {auditOffices.map(office => (
                                <SelectItem key={office} value={office}>{office}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Documents...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Run Preliminary Analysis</>
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your financial documents...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI-Generated Financial Analysis</CardTitle>
             <CardDescription>
                This is a preliminary analysis for {form.getValues('companyName')} for fiscal year {form.getValues('fiscalYear')}.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md border">{response.executiveSummary}</p>
                </div>
                
                <div>
                     <h3 className="font-semibold text-lg mb-2">Key Metrics</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                        {Object.entries(response.keyMetrics).map(([key, value]) => value && (
                            <Card key={key} className="p-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-xl font-bold text-primary">{value}</p>
                            </Card>
                        ))}
                     </div>
                </div>

                {response.potentialRedFlags.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-destructive">Potential Red Flags</h3>
                        <div className="space-y-2">
                        {response.potentialRedFlags.map((flag, index) => (
                             <Alert key={index} variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Alert {index + 1}</AlertTitle>
                                <AlertDescription>{flag}</AlertDescription>
                            </Alert>
                        ))}
                        </div>
                    </div>
                )}
                
                 <div>
                  <h3 className="font-semibold text-lg mb-2">Data Completeness Score</h3>
                  <div className="flex items-center gap-4">
                    <Progress value={response.dataCompletenessScore} className="h-4" />
                    <span className="font-bold text-lg text-primary">{response.dataCompletenessScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This score reflects the suitability of the provided documents for the requested analysis type.</p>
                </div>

          </CardContent>
          <CardFooter>
             <Button className="w-full" size="lg" onClick={handleSubmitToOffice} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4" />}
                Submit Analysis to {form.getValues('assignedOffice')}
             </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
