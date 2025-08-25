
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
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { Loader2, CheckCircle, Handshake, UploadCloud, Wand2, UserCheck, Building, User } from 'lucide-react';
import Link from 'next/link';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const CompanyUploadSchema = z.object({
  crDocument: z.any().refine(file => file?.length == 1, 'Commercial Record is required.'),
});
type CompanyUploadValues = z.infer<typeof CompanyUploadSchema>;

const IndividualUploadSchema = z.object({
    idDocument: z.any().refine(file => file?.length == 1, 'ID Document is required.'),
    passportDocument: z.any().optional(),
    personalPhoto: z.any().optional(),
    cvDocument: z.any().optional(),
});
type IndividualUploadValues = z.infer<typeof IndividualUploadSchema>;


type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'submitted';
type ApplicantType = 'individual' | 'company';

export default function PartnerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('company');
  
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | IdentityAnalysisOutput | null>(null);
  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema) });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema) });
  const inquiryForm = useForm<PartnershipInquiryInput>({ resolver: zodResolver(PartnershipInquiryInputSchema) });

  const handleCrAnalysis: SubmitHandler<CompanyUploadValues> = async (data) => {
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
        toast({ title: 'Analysis Complete!', description: 'Please review and confirm the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'We could not analyze the document. Please check the file and try again.', variant: 'destructive' })
        setPageState('upload');
    }
  }

  const handleIndividualAnalysis: SubmitHandler<IndividualUploadValues> = async (data) => {
    setPageState('analyzing');
    try {
        const idFile = data.idDocument[0];
        const idDocumentUri = await fileToDataURI(idFile);
        
        let cvDocumentUri: string | undefined;
        if (data.cvDocument && data.cvDocument.length > 0) {
            cvDocumentUri = await fileToDataURI(data.cvDocument[0]);
        }

        let passportDocumentUri: string | undefined;
        if (data.passportDocument && data.passportDocument.length > 0) {
            passportDocumentUri = await fileToDataURI(data.passportDocument[0]);
        }

        let photoUri: string | undefined;
        if (data.personalPhoto && data.personalPhoto.length > 0) {
            photoUri = await fileToDataURI(data.personalPhoto[0]);
        }

        const result = await analyzeIdentity({ idDocumentUri, cvDocumentUri, passportDocumentUri, photoUri });
        setAnalysisResult(result);
        inquiryForm.reset({
            companyName: result.personalDetails?.fullName || '', // Use fullName for companyName field for individuals
            contactName: result.personalDetails?.fullName || '',
            email: result.personalDetails?.email || '',
            partnershipDetails: result.professionalSummary || '',
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review and confirm the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze documents. Please try again.', variant: 'destructive' });
        setPageState('upload');
    }
  }

  const onSubmit: SubmitHandler<PartnershipInquiryInput> = async (data) => {
    setIsLoading(true);
    try {
      const result = await handlePartnershipInquiry(data);
      setPageState('submitted');
      toast({ title: 'Inquiry Submitted!', description: result.confirmationMessage });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit inquiry. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const SelectionScreen = () => (
     <>
      <CardHeader>
        <CardTitle className="text-center">Partnership Application</CardTitle>
        <CardDescription className="text-center">Are you applying as an individual or on behalf of a company?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <div className="grid grid-cols-2 gap-6 w-full">
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => { setApplicantType('individual'); setPageState('upload'); }}>
                <User className="w-8 h-8"/>
                <span>Individual / Freelancer</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => { setApplicantType('company'); setPageState('upload'); }}>
                <Building className="w-8 h-8"/>
                <span>Company / Subcontractor</span>
            </Button>
        </div>
      </CardContent>
    </>
  );

  const UploadScreen = () => (
    <>
        <CardHeader>
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('selection')}>&larr; Back</Button>
            <CardTitle className="flex items-center gap-2 justify-center pt-8"><UploadCloud /> Upload Your Documents</CardTitle>
            <CardDescription className="text-center">Our AI will analyze your documents to auto-fill the partnership form.</CardDescription>
        </CardHeader>
        <CardContent>
             {applicantType === 'company' ? (
                <Form {...companyUploadForm}>
                    <form onSubmit={companyUploadForm.handleSubmit(handleCrAnalysis)} className="space-y-4">
                        <FormField control={companyUploadForm.control} name="crDocument" render={({ field }) => (
                            <FormItem><FormLabel>Commercial Record (PDF, PNG, or JPG)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><Wand2 className="mr-2 h-4 w-4" /> Analyze Document</Button>
                    </form>
                </Form>
            ) : (
                <Form {...individualUploadForm}>
                    <form onSubmit={individualUploadForm.handleSubmit(handleIndividualAnalysis)} className="space-y-6">
                        <FormField control={individualUploadForm.control} name="idDocument" render={({ field }) => (
                            <FormItem><FormLabel>ID Card (Required)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="passportDocument" render={({ field }) => (
                            <FormItem><FormLabel>Passport (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="personalPhoto" render={({ field }) => (
                            <FormItem><FormLabel>Personal Photo (Optional)</FormLabel><FormControl><Input type="file" accept=".png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="cvDocument" render={({ field }) => (
                            <FormItem><FormLabel>CV / Resume (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
                    </form>
                </Form>
            )}
        </CardContent>
    </>
  );

  const AnalyzingScreen = () => (
    <CardContent className="p-10 text-center">
       <div className="flex flex-col items-center gap-6">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
           <div className="space-y-2">
               <CardTitle className="text-2xl">Analyzing Document...</CardTitle>
               <CardDescription>Our AI is reading your documents. This may take a moment.</CardDescription>
           </div>
       </div>
   </CardContent>
  );

  const ReviewScreen = () => (
    <>
       <CardHeader>
           <CardTitle className="flex items-center gap-2"><UserCheck /> Verify Your Details</CardTitle>
           <CardDescription>Please check the information extracted by our AI and fill in any missing fields before submitting.</CardDescription>
       </CardHeader>
       <CardContent>
           <Form {...inquiryForm}>
               <form onSubmit={inquiryForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={inquiryForm.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Name' : 'Full Name'}</FormLabel><FormControl><Input placeholder="Your Company Inc. / John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={inquiryForm.control} name="contactName" render={({ field }) => (<FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={inquiryForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={inquiryForm.control} name="partnershipDetails" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Activities' : 'Professional Summary'} / Partnership Details</FormLabel><FormControl><Textarea placeholder="Describe your company's mission, or your own skills, and how you envision a partnership with us." rows={6} {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <div className="flex gap-2">
                        <Button variant="outline" className="w-full" onClick={() => setPageState('upload')}>Upload New Document</Button>
                       <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>) : (<><Handshake className="mr-2 h-4 w-4" /> Submit Inquiry</>)}</Button>
                   </div>
               </form>
           </Form>
       </CardContent>
   </>
  );

  const SubmittedScreen = () => (
    <CardContent className="p-10 text-center">
       <div className="flex flex-col items-center gap-6">
           <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
               <CheckCircle className="h-12 w-12 text-green-500" />
           </div>
           <div className="space-y-2">
               <CardTitle className="text-2xl">Thank You for Your Interest!</CardTitle>
               <CardDescription>Your partnership inquiry has been received. Our partnership agent, Paz, will review your information and get in touch to discuss potential collaboration.</CardDescription>
           </div>
           <Button asChild onClick={() => setPageState('selection')}><Link href="#">Submit Another Inquiry</Link></Button>
       </div>
   </CardContent>
  );

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Be Our Partner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us in a strategic partnership to drive mutual growth and success. Upload your documents to get started quickly.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                {pageState === 'selection' && <SelectionScreen />}
                {pageState === 'upload' && <UploadScreen />}
                {pageState === 'analyzing' && <AnalyzingScreen />}
                {pageState === 'review' && <ReviewScreen />}
                {pageState === 'submitted' && <SubmittedScreen />}
            </Card>
        </div>
      </div>
    </div>
  );
}
