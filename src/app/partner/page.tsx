
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { handlePartnershipInquiry } from '@/ai/flows/partnership-inquiry';
import { PartnershipInquiryInputSchema, type PartnershipInquiryInput } from '@/ai/flows/partnership-inquiry.schema';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { Loader2, CheckCircle, Handshake, UploadCloud, FileCheck, Wand2, UserCheck } from 'lucide-react';
import Link from 'next/link';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const UploadSchema = z.object({
  crDocument: z.any().refine(file => file?.length == 1, 'Commercial Record is required.'),
});
type UploadValues = z.infer<typeof UploadSchema>;

type PageState = 'upload' | 'analyzing' | 'review' | 'submitted';

export default function PartnerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>('upload');
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | null>(null);
  const { toast } = useToast();

  const uploadForm = useForm<UploadValues>({
    resolver: zodResolver(UploadSchema),
  });

  const inquiryForm = useForm<PartnershipInquiryInput>({
    resolver: zodResolver(PartnershipInquiryInputSchema),
  });

  const handleCrAnalysis: SubmitHandler<UploadValues> = async (data) => {
    setPageState('analyzing');
    try {
        const file = data.crDocument[0];
        const documentDataUri = await fileToDataURI(file);
        const result = await analyzeCrDocument({ documentDataUri });
        setAnalysisResult(result);
        inquiryForm.reset({
            companyName: result.companyInfo?.companyNameEnglish || result.companyInfo?.companyNameArabic || '',
            contactName: result.authorizedSignatories?.[0]?.name || result.boardMembers?.[0]?.name || '',
            email: result.companyInfo?.contactEmail || '',
            partnershipDetails: result.summary || '',
        });
        setPageState('review');
        toast({
            title: 'Analysis Complete!',
            description: 'Please review and confirm the extracted details.',
        });
    } catch(e) {
        toast({
            title: 'Analysis Failed',
            description: 'We could not analyze the document. Please check the file and try again.',
            variant: 'destructive'
        })
        setPageState('upload');
    }
  }

  const onSubmit: SubmitHandler<PartnershipInquiryInput> = async (data) => {
    setIsLoading(true);
    try {
      const result = await handlePartnershipInquiry(data);
      setPageState('submitted');
      toast({
        title: 'Inquiry Submitted!',
        description: result.confirmationMessage,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Be Our Partner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us in a strategic partnership to drive mutual growth and success. For companies and subcontractors, please start by uploading your Commercial Record (CR).
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
            {pageState === 'upload' && (
                <>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UploadCloud /> Step 1: Upload Your Commercial Record</CardTitle>
                        <CardDescription>Our AI will analyze your CR to auto-fill the partnership form.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Form {...uploadForm}>
                            <form onSubmit={uploadForm.handleSubmit(handleCrAnalysis)} className="space-y-4">
                                <FormField
                                    control={uploadForm.control}
                                    name="crDocument"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Commercial Record (PDF, PNG, or JPG)</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                    <Wand2 className="mr-2 h-4 w-4" /> Analyze Document
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </>
            )}
            
            {pageState === 'analyzing' && (
                 <CardContent className="p-10 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Analyzing Document...</CardTitle>
                            <CardDescription>
                                Our AI is reading your Commercial Record. This may take a moment.
                            </CardDescription>
                        </div>
                    </div>
                </CardContent>
            )}

            {pageState === 'review' && (
                 <>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserCheck /> Step 2: Verify Your Details</CardTitle>
                        <CardDescription>Please check the information extracted by our AI and fill in any missing fields before submitting.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...inquiryForm}>
                            <form onSubmit={inquiryForm.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={inquiryForm.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Company Inc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={inquiryForm.control}
                                    name="contactName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={inquiryForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={inquiryForm.control}
                                    name="partnershipDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Activities / Partnership Details</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your company's mission, strengths, and how you envision a partnership with us." rows={6} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2">
                                     <Button variant="outline" className="w-full" onClick={() => setPageState('upload')}>
                                        Upload New CR
                                    </Button>
                                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            <><Handshake className="mr-2 h-4 w-4" /> Submit Inquiry</>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </>
            )}

            {pageState === 'submitted' && (
                 <CardContent className="p-10 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Thank You for Your Interest!</CardTitle>
                            <CardDescription>
                                Your partnership inquiry has been received. Our partnership agent, Paz, will review your information and get in touch to discuss potential collaboration.
                            </CardDescription>
                        </div>
                        <Button asChild onClick={() => setPageState('upload')}>
                            <Link href="#">Submit Another Inquiry</Link>
                        </Button>
                    </div>
                </CardContent>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
}
