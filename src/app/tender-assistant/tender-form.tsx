

'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTenderResponse } from '@/ai/flows/tender-response-assistant';
import { type GenerateTenderResponseOutput } from '@/ai/flows/tender-response-assistant';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, Download, Copy, Mic } from 'lucide-react';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  tenderDocuments: z.any().refine(files => files?.length > 0, 'At least one tender document is required.'),
  projectRequirements: z.string().min(20, 'Please provide a detailed description of the project requirements.'),
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
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const documentPromises = Array.from(data.tenderDocuments as FileList).map(fileToDataURI);
      const tenderDocuments = await Promise.all(documentPromises);
      
      const result = await generateTenderResponse({ 
          tenderDocuments, 
          projectRequirements: data.projectRequirements 
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

  const handleDownload = () => {
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
                name="tenderDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Documents</FormLabel>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
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
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
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
