
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, UploadCloud, FileCheck2, Building } from 'lucide-react';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  crDocument: z.any().refine(file => file?.length == 1, 'Commercial Record is required.'),
  companyName: z.string().min(1, 'Company Name is required'),
  contactName: z.string().min(2, 'Contact Name is required'),
  email: z.string().email('Please enter a valid email address'),
  challenges: z.string().min(20, 'Please describe your challenges in at least 20 characters'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CtoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      challenges: ''
    }
  });

  const handleCrAnalysis = async () => {
    const crFile = form.getValues('crDocument');
    if (!crFile || crFile.length === 0) {
      toast({ title: 'Please select a CR document first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const uri = await fileToDataURI(crFile[0]);
      const result = await analyzeCrDocument({ documentDataUri: uri });
      setAnalysisResult(result);
      if (result.companyInfo) {
        form.setValue('companyName', result.companyInfo.companyNameEnglish || result.companyInfo.companyNameArabic || '');
        form.setValue('email', result.companyInfo.contactEmail || '');
      }
       toast({ title: 'Analysis Complete!', description: 'Company details have been extracted.' });
    } catch(e) {
      toast({ title: 'Analysis Failed', description: 'Could not analyze document.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    console.log("Submitting CTO Inquiry:", data, analysisResult);
    await new Promise(res => setTimeout(res, 1500)); // Simulate API call
    toast({
        title: "Inquiry Sent!",
        description: "Thank you for your interest. Our CTO will review your submission and be in touch shortly."
    });
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
      return (
        <Card className="max-w-3xl mx-auto mt-12">
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <Send className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Inquiry Sent Successfully!</CardTitle>
                        <CardDescription>
                            Our team has received your details. We're excited about the possibility of working with you and will reach out soon to schedule an initial consultation.
                        </CardDescription>
                    </div>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Let's Become Your CTO</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Leverage our expertise to lead your technology strategy and execution. Get a fractional CTO to guide your startup or project to success.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Company Information</CardTitle>
                            <CardDescription>Upload your Commercial Record (CR) and let our AI assist you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="crDocument"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Commercial Record (CR) Document</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                            </FormControl>
                                            <Button type="button" variant="secondary" onClick={handleCrAnalysis} disabled={isLoading}>
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                                Analyze
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             {analysisResult && analysisResult.companyInfo && (
                                <Alert className="mt-4">
                                    <FileCheck2 className="h-4 w-4" />
                                    <AlertTitle>Analysis Complete</AlertTitle>
                                    <AlertDescription>
                                        <p>Successfully extracted data for: <strong>{analysisResult.companyInfo.companyNameEnglish || analysisResult.companyInfo.companyNameArabic}</strong></p>
                                        <p>CR Number: {analysisResult.companyInfo.registrationNumber}</p>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Tell Us More</CardTitle>
                            <CardDescription>Let's discuss how we can help your business.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="companyName" render={({ field }) => (
                                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Auto-filled from CR..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="contactName" render={({ field }) => (
                                    <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Your Email Address</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="challenges" render={({ field }) => (
                                <FormItem><FormLabel>Technology Challenges</FormLabel><FormControl><Textarea placeholder="Tell us about your current technology stack, business goals, and the challenges you're facing." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : "Request a Consultation"}
                           </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
      </div>
    </div>
  );
}
