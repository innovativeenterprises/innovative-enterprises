
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeFinancialDocuments } from '@/ai/flows/financial-document-analysis';
import { type FinancialAnalysisOutput } from '@/ai/flows/financial-document-analysis.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Shield, Bot, Send, User, CheckCircle, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettingsData } from '@/app/admin/settings-table';
import { auditOffices } from '@/lib/audit-offices';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  financialDocuments: z.any().refine(files => files?.length > 0, 'At least one document is required.'),
  analysisType: z.enum(['Full Audit', 'Compliance Check', 'Internal Review', 'Forensic Analysis']),
  companyName: z.string().min(1, 'Company name is required.'),
  fiscalYear: z.string().min(4, 'Fiscal year must be at least 4 characters.').max(9, 'Fiscal year is too long.'),
  assignmentMode: z.enum(['direct', 'tender', 'builtin']),
  assignedOffice: z.string().optional(),
  tenderOffices: z.array(z.string()).optional(),
});
type FormValues = z.infer<typeof FormSchema>;

export default function AuditForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FinancialAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      analysisType: 'Full Audit',
      companyName: '',
      fiscalYear: new Date().getFullYear().toString(),
      assignmentMode: 'builtin',
      assignedOffice: '',
      tenderOffices: [],
    },
  });

  const assignmentMode = form.watch('assignmentMode');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.assignmentMode === 'tender' && (!data.tenderOffices || data.tenderOffices.length === 0)) {
        form.setError('tenderOffices', { type: 'manual', message: 'Please select at least one audit office for the tender.' });
        return;
    }
    if (data.assignmentMode === 'direct' && !data.assignedOffice) {
        form.setError('assignedOffice', { type: 'manual', message: 'Please select an audit office to assign the task to.' });
        return;
    }

    setIsLoading(true);
    setResponse(null);
    try {
      const files = Array.from(data.financialDocuments as FileList);
      const financialDocuments = await Promise.all(files.map(file => fileToDataURI(file)));

      // In a real app, you would have different logic here.
      // e.g., if 'direct' or 'tender', you would send the job to a different backend service.
      // For this prototype, we will always run the AI analysis to show a result.
      console.log(`Simulating job submission. Mode: ${data.assignmentMode}. Details:`, data);
      
      const result = await analyzeFinancialDocuments({
          financialDocuments,
          analysisType: data.analysisType,
          companyName: data.companyName,
          fiscalYear: data.fiscalYear,
      });

      setResponse(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your financial documents have been analyzed by Finley.',
      });
      form.reset();

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (response) {
      return (
         <Card>
            <CardHeader className="text-center">
                 <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Preliminary Analysis Complete</CardTitle>
                <CardDescription>Finley has completed the initial review of the financial documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{response.executiveSummary}</p>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Key Metrics</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {Object.entries(response.keyMetrics).map(([key, value]) => (
                                value && <div key={key} className="flex justify-between border-b pb-1">
                                    <span className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span>{String(value)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-base">Potential Red Flags</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                {response.potentialRedFlags.map((flag, index) => <li key={index}>{flag}</li>)}
                                {response.potentialRedFlags.length === 0 && <li>No significant red flags identified.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-4">
                <Button onClick={() => setResponse(null)} className="w-full">Submit Another Audit Request</Button>
            </CardFooter>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit an Audit Request</CardTitle>
        <CardDescription>Upload your financial documents and specify the audit requirements.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Innovative Enterprises LLC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fiscalYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiscal Year / Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2023 or Q3 2024" {...field} />
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
                    <FormLabel>Type of Audit/Review</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Full Audit">Full Audit</SelectItem>
                            <SelectItem value="Compliance Check">Compliance Check</SelectItem>
                            <SelectItem value="Internal Review">Internal Review</SelectItem>
                            <SelectItem value="Forensic Analysis">Forensic Analysis</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="financialDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Documents</FormLabel>
                  <FormControl>
                    <Input type="file" multiple accept=".pdf,.xlsx,.csv,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormDescription>Upload balance sheets, income statements, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="assignmentMode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Engagement Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="builtin"><Bot className="inline-block mr-2 h-4 w-4"/>Use AI for Preliminary Analysis</SelectItem>
                                <SelectItem value="direct"><User className="inline-block mr-2 h-4 w-4"/>Assign Directly to an Audit Office</SelectItem>
                                <SelectItem value="tender"><Send className="inline-block mr-2 h-4 w-4"/>Send Tender to Multiple Offices</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {assignmentMode === 'direct' && (
                <FormField
                    control={form.control}
                    name="assignedOffice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Audit Office</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Choose an office..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {auditOffices.map(office => <SelectItem key={office} value={office}>{office}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {assignmentMode === 'tender' && (
                <FormField
                    control={form.control}
                    name="tenderOffices"
                    render={() => (
                    <FormItem>
                        <FormLabel>Select Offices for Tender</FormLabel>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {auditOffices.map((office) => (
                                <FormField
                                key={office}
                                control={form.control}
                                name="tenderOffices"
                                render={({ field }) => (
                                    <FormItem key={office} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(office)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), office])
                                                : field.onChange(field.value?.filter((value) => value !== office))
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">{office}</FormLabel>
                                    </FormItem>
                                )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Submit for Analysis</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
