
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
import { Loader2, CheckCircle, Handshake, UploadCloud, FileCheck, Wand2, UserCheck, Building, User } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';

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
    cvDocument: z.any().optional(),
});
type IndividualUploadValues = z.infer<typeof IndividualUploadSchema>;

const ManualEntrySchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().optional(),
  interest: z.string().min(10, "Please tell us why you are interested."),
});
type ManualEntryValues = z.infer<typeof ManualEntrySchema>;

type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'submitted';
type ApplicantType = 'individual' | 'company';

export default function AgentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('individual');
  
  const [crAnalysisResult, setCrAnalysisResult] = useState<CrAnalysisOutput | null>(null);
  const [identityAnalysisResult, setIdentityAnalysisResult] = useState<IdentityAnalysisOutput | null>(null);
  
  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema) });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema) });
  const manualEntryForm = useForm<ManualEntryValues>({ resolver: zodResolver(ManualEntrySchema) });

  const handleCompanyCrAnalysis: SubmitHandler<CompanyUploadValues> = async (data) => {
    setPageState('analyzing');
    try {
        const file = data.crDocument[0];
        const documentDataUri = await fileToDataURI(file);
        const result = await analyzeCrDocument({ documentDataUri });
        setCrAnalysisResult(result);
        manualEntryForm.reset({
            name: result.companyInfo?.companyNameEnglish || result.companyInfo?.companyNameArabic || '',
            email: result.companyInfo?.contactEmail || '',
            phone: result.companyInfo?.contactMobile || '',
            interest: result.summary || 'Interest based on company activities.',
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze document. Please try again or fill manually.', variant: 'destructive' });
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

        const result = await analyzeIdentity({ idDocumentUri, cvDocumentUri });
        setIdentityAnalysisResult(result);
        manualEntryForm.reset({
            name: result.fullName || '',
            email: result.email || '',
            phone: result.phone || '',
            interest: result.professionalSummary || '',
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze documents. Please try again or fill manually.', variant: 'destructive' });
        setPageState('upload');
    }
  }

  const onSubmit: SubmitHandler<ManualEntryValues> = async (data) => {
    setIsLoading(true);
    // Here you would typically send the data to your backend.
    // For this prototype, we'll just simulate a successful submission.
    console.log("Submitting Agent Application:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPageState('submitted');
    toast({ title: 'Application Submitted!', description: "Thank you for your interest. We will review your application and be in touch." });
    setIsLoading(false);
  };

  const startManualEntry = () => {
    manualEntryForm.reset({ name: '', email: '', phone: '', interest: '' });
    setPageState('review');
  }

  const SelectionScreen = () => (
    <>
      <CardHeader>
        <CardTitle className="text-center">Agent Application</CardTitle>
        <CardDescription className="text-center">Are you applying as an individual or on behalf of a company?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <div className="grid grid-cols-2 gap-6 w-full">
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => { setApplicantType('individual'); setPageState('upload'); }}>
                <User className="w-8 h-8"/>
                <span>Individual</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => { setApplicantType('company'); setPageState('upload'); }}>
                <Building className="w-8 h-8"/>
                <span>Company</span>
            </Button>
        </div>
      </CardContent>
    </>
  );

  const UploadScreen = () => (
    <>
        <CardHeader>
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('selection')}>&larr; Back</Button>
            <CardTitle className="text-center pt-8">AI-Powered Application</CardTitle>
            <CardDescription className="text-center">To save time, upload your documents and let our AI auto-fill your application.</CardDescription>
        </CardHeader>
        <CardContent>
            {applicantType === 'company' ? (
                <Form {...companyUploadForm}>
                    <form onSubmit={companyUploadForm.handleSubmit(handleCompanyCrAnalysis)} className="space-y-4">
                        <FormField control={companyUploadForm.control} name="crDocument" render={({ field }) => (
                            <FormItem><FormLabel>Commercial Record (PDF, PNG, or JPG)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent"><Wand2 className="mr-2 h-4 w-4" /> Analyze Document</Button>
                    </form>
                </Form>
            ) : (
                 <Form {...individualUploadForm}>
                    <form onSubmit={individualUploadForm.handleSubmit(handleIndividualAnalysis)} className="space-y-6">
                        <FormField control={individualUploadForm.control} name="idDocument" render={({ field }) => (
                            <FormItem><FormLabel>ID Card or Passport (PDF, PNG, JPG)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="cvDocument" render={({ field }) => (
                            <FormItem><FormLabel>CV / Resume (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent"><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
                    </form>
                </Form>
            )}
             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
            </div>
            <Button variant="secondary" className="w-full" onClick={startManualEntry}>Fill Application Manually</Button>
        </CardContent>
    </>
  );

  const AnalyzingScreen = () => (
    <CardContent className="p-10 text-center">
       <div className="flex flex-col items-center gap-6">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
           <div className="space-y-2">
               <CardTitle className="text-2xl">Analyzing Documents...</CardTitle>
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
           <Form {...manualEntryForm}>
               <form onSubmit={manualEntryForm.handleSubmit(onSubmit)} className="space-y-4">
                   <FormField control={manualEntryForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Name' : 'Full Name'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <div className="grid grid-cols-2 gap-4">
                        <FormField control={manualEntryForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={manualEntryForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </div>
                   <FormField control={manualEntryForm.control} name="interest" render={({ field }) => (<FormItem><FormLabel>Why are you interested in becoming an agent?</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="w-full" onClick={() => setPageState('upload')}>&larr; Back to Upload</Button>
                       <Button type="submit" className="w-full bg-accent" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>) : (<><Handshake className="mr-2 h-4 w-4" /> Apply Now</>)}</Button>
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
               <CardTitle className="text-2xl">Thank You for Your Application!</CardTitle>
               <CardDescription>Your application has been received. Our team will review your information and get in touch shortly to discuss the next steps.</CardDescription>
           </div>
           <Button asChild onClick={() => setPageState('selection')}><Link href="/opportunities">View Opportunities</Link></Button>
       </div>
   </CardContent>
  );


  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Become Our Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Represent Innovative Enterprises and earn commissions by bringing in new business. Join our sales force and help us expand our reach.
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
