
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { GenerateTenderResponseInputSchema, type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, Download, Copy, Mic, Briefcase } from 'lucide-react';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import jsPDF from 'jspdf';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = GenerateTenderResponseInputSchema.extend({
  // Adding a separate field for file input that won't be sent to the AI flow directly
  documentFiles: z.any().refine(files => files?.length > 0, 'At least one tender document is required.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function TenderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTenderResponseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectRequirements: '',
      companyName: 'Innovative Enterprises', // Default to our company
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const documentPromises = Array.from(data.documentFiles as FileList).map(fileToDataURI);
      const tenderDocuments = await Promise.all(documentPromises);
      
      const result = await generateTenderResponse({ 
          tenderDocuments, 
          projectRequirements: data.projectRequirements,
          companyName: data.companyName,
          projectName: data.projectName,
          tenderingAuthority: data.tenderingAuthority,
          companyOverview: data.companyOverview,
          relevantExperience: data.relevantExperience,
          projectTeam: data.projectTeam,
          estimatedCost: data.estimatedCost,
          priceValidityDays: data.priceValidityDays,
          estimatedSchedule: data.estimatedSchedule,
          contactInfo: data.contactInfo,
      });
      setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate tender response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response.draftResponse);
      toast({ title: "Copied!", description: "The draft response has been copied to your clipboard." });
    }
  };

  const handleDownloadTxt = () => {
    if (response) {
      const element = document.createElement("a");
      const file = new Blob([response.draftResponse], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "tender_draft_response.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleDownloadPdf = () => {
    if (response) {
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const splitText = doc.splitTextToSize(response.draftResponse, 180);
        
        let yPos = margin;
        for (let i = 0; i < splitText.length; i++) {
            if (yPos > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
            doc.text(splitText[i], margin, yPos);
            yPos += 7; // Line height
        }
        
        doc.save("tender_draft_response.pdf");
        toast({ title: "PDF Downloaded!" });
    }
  };

  const handleSaveToBriefcase = () => {
    toast({ title: "Coming Soon!", description: "Saving to E-Briefcase will be implemented in a future update." });
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tender Response Assistant</CardTitle>
          <CardDescription>Upload the tender documents and specify the project requirements. Our AI will generate a tailored draft response.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="documentFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Documents</FormLabel>
                    <FormControl>
                      <Input type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Requirements Summary</FormLabel>
                    <FormControl>
                      <VoiceEnabledTextarea
                        placeholder="Summarize the key requirements, scope, and deliverables mentioned in the tender documents."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Accordion type="single" collapsible>
                  <AccordionItem value="optional-info">
                      <AccordionTrigger>
                        <h3 className="text-lg font-semibold">Optional: Add More Details for a Better Response</h3>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                            <FormField control={form.control} name="companyName" render={({ field }) => (
                                <FormItem><FormLabel>Your Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="projectName" render={({ field }) => (
                                    <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="tenderingAuthority" render={({ field }) => (
                                    <FormItem><FormLabel>Tendering Authority</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="companyOverview" render={({ field }) => (
                                <FormItem><FormLabel>Company Overview</FormLabel><FormControl><Textarea rows={3} placeholder="e.g., A reputable construction company with X years of experience..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="relevantExperience" render={({ field }) => (
                                <FormItem><FormLabel>Relevant Experience / Past Projects</FormLabel><FormControl><Textarea rows={3} placeholder="e.g., Successfully completed the Al-Ameen Mosque project..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="projectTeam" render={({ field }) => (
                                <FormItem><FormLabel>Key Project Team</FormLabel><FormControl><Textarea rows={2} placeholder="e.g., John Doe (Project Manager), Jane Smith (Lead Engineer)" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="estimatedCost" render={({ field }) => (
                                    <FormItem><FormLabel>Estimated Cost (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="priceValidityDays" render={({ field }) => (
                                    <FormItem><FormLabel>Price Validity (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="estimatedSchedule" render={({ field }) => (
                                    <FormItem><FormLabel>Estimated Schedule</FormLabel><FormControl><Input placeholder="e.g., 6 months" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                             <FormField control={form.control} name="contactInfo" render={({ field }) => (
                                <FormItem><FormLabel>Your Contact Information</FormLabel><FormControl><Input placeholder="e.g., John Doe, CEO, +968 1234 5678" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Response...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Draft
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
                <p className="mt-4 text-muted-foreground">Our AI is analyzing the tender and drafting your response...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI-Generated Draft Response</CardTitle>
             <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveToBriefcase}><Briefcase className="mr-2 h-4 w-4"/> Save</Button>
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4"/> PDF</Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTxt}><Download className="mr-2 h-4 w-4"/> TXT</Button>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap p-4 bg-muted rounded-md border">
            {response.draftResponse}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
