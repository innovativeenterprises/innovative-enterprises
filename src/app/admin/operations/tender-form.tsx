
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { GenerateTenderResponseInputSchema, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant.schema';
import { fileToDataURI } from '@/lib/utils';

const TenderFormSchema = GenerateTenderResponseInputSchema.extend({
    tenderFiles: z.any().refine(files => files?.length > 0, 'At least one tender document is required.'),
});
type TenderFormValues = z.infer<typeof TenderFormSchema>;

export default function TenderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTenderResponseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<TenderFormValues>({
    resolver: zodResolver(TenderFormSchema),
  });

  const onSubmit: SubmitHandler<TenderFormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const documentPromises = Array.from(data.tenderFiles as FileList).map(fileToDataURI);
      const tenderDocuments = await Promise.all(documentPromises);
      
      const result = await generateTenderResponse({ ...data, tenderDocuments });
      setResponse(result);
      toast({ title: 'Draft Generated!', description: 'Your tender response draft is ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate tender response.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tender Response Assistant</CardTitle>
          <CardDescription>Upload tender documents and provide your company details. The AI will generate a comprehensive draft response.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="tenderFiles" render={({ field }) => (
                <FormItem><FormLabel>Tender Documents</FormLabel><FormControl><Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="projectRequirements" render={({ field }) => (
                <FormItem><FormLabel>Project Requirements Summary</FormLabel><FormControl><Textarea placeholder="Briefly summarize the key project requirements mentioned in the tender..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="projectName" render={({ field }) => (
                      <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="tenderingAuthority" render={({ field }) => (
                      <FormItem><FormLabel>Tendering Authority</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
              </div>
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Your Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
                <FormField control={form.control} name="companyOverview" render={({ field }) => (
                <FormItem><FormLabel>Company Overview</FormLabel><FormControl><Textarea placeholder="A brief overview of your company..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="estimatedCost" render={({ field }) => (
                    <FormItem><FormLabel>Estimated Cost (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="priceValidityDays" render={({ field }) => (
                    <FormItem><FormLabel>Price Validity (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : 'Generate Draft Response'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {response && (
        <Card>
          <CardHeader><CardTitle>Generated Tender Response</CardTitle></CardHeader>
          <CardContent className="prose prose-sm max-w-full dark:prose-invert whitespace-pre-wrap">{response.draftResponse}</CardContent>
        </Card>
      )}
    </div>
  );
}
