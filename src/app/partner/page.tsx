
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { handlePartnershipInquiry } from '@/ai/flows/partnership-inquiry';
import { PartnershipInquiryInputSchema } from '@/ai/flows/partnership-inquiry.schema';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { Loader2, CheckCircle, Handshake, UploadCloud, Wand2, UserCheck, Building, User, Camera, ScanLine } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraCapture } from '@/components/camera-capture';

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
  repIdDocument: z.any().refine(file => file?.length == 1, 'Representative ID is required.'),
});
type CompanyUploadValues = z.infer<typeof CompanyUploadSchema>;

const IndividualUploadSchema = z.object({
    idDocumentFrontUri: z.string().min(1, 'Front of ID is required.'),
    idDocumentBackUri: z.string().optional(),
    passportDocument: z.any().optional(),
    personalPhoto: z.any().optional(),
    cvDocument: z.any().optional(),
});
type IndividualUploadValues = z.infer<typeof IndividualUploadSchema>;

type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'submitted' | 'capture_id_front' | 'capture_id_back';
type ApplicantType = 'individual' | 'company';

export default function PartnerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('company');
  
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | IdentityAnalysisOutput | null>(null);
  const [repAnalysisResult, setRepAnalysisResult] = useState<IdentityAnalysisOutput | null>(null);
  const [recordNumber, setRecordNumber] = useState<string | null>(null);
  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema) });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema) });
  const inquiryForm = useForm<z.infer<typeof PartnershipInquiryInputSchema>>({ resolver: zodResolver(PartnershipInquiryInputSchema) });

  const startManualEntry = () => {
    inquiryForm.reset({ companyName: '', contactName: '', email: '', partnershipDetails: '', undertaking: false });
    setAnalysisResult(null);
    setRepAnalysisResult(null);
    setPageState('review');
  }

  const handleCrAnalysis: SubmitHandler<CompanyUploadValues> = async (data) => {
    setPageState('analyzing');
    inquiryForm.reset();
    setAnalysisResult(null);
    setRepAnalysisResult(null);
    try {
        const crFile = data.crDocument[0];
        const repIdFile = data.repIdDocument[0];

        const crPromise = fileToDataURI(crFile).then(uri => analyzeCrDocument({ documentDataUri: uri }));
        const repIdPromise = fileToDataURI(repIdFile).then(uri => analyzeIdentity({ idDocumentFrontUri: uri }));

        const [crResult, repResult] = await Promise.all([crPromise, repIdPromise]);
        
        setAnalysisResult(crResult);
        setRepAnalysisResult(repResult);
        
        inquiryForm.reset({
            companyName: crResult.companyInfo?.companyNameEnglish || crResult.companyInfo?.companyNameArabic || '',
            contactName: repResult.personalDetails?.fullName || crResult.authorizedSignatories?.[0]?.name || '',
            email: repResult.personalDetails?.email || crResult.companyInfo?.contactEmail || '',
            partnershipDetails: crResult.summary || '',
            undertaking: false,
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review and confirm the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze documents. Please fill the form manually.', variant: 'destructive' })
        startManualEntry();
    }
  }

  const handleIndividualAnalysis: SubmitHandler<IndividualUploadValues> = async (data) => {
    setPageState('analyzing');
    inquiryForm.reset();
    setAnalysisResult(null);
    setRepAnalysisResult(null);
    try {
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

        const result = await analyzeIdentity({ 
            idDocumentFrontUri: data.idDocumentFrontUri,
            idDocumentBackUri: data.idDocumentBackUri,
            cvDocumentUri,
            passportDocumentUri,
            photoUri,
        });
        setAnalysisResult(result);
        inquiryForm.reset({
            companyName: result.personalDetails?.fullName || '', // Use fullName for companyName field for individuals
            contactName: result.personalDetails?.fullName || '',
            email: result.personalDetails?.email || '',
            partnershipDetails: result.professionalSummary || '',
            undertaking: false,
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review and confirm the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze documents. Please fill the form manually.', variant: 'destructive' });
        startManualEntry();
    }
  }
  
  const onIdFrontCaptured = (imageUri: string) => {
    individualUploadForm.setValue('idDocumentFrontUri', imageUri);
    setPageState('capture_id_back');
  }

  const onIdBackCaptured = (imageUri: string) => {
    individualUploadForm.setValue('idDocumentBackUri', imageUri);
    setPageState('upload');
  }

  const onSubmit: SubmitHandler<z.infer<typeof PartnershipInquiryInputSchema>> = async (data) => {
    setIsLoading(true);
    try {
      const result = await handlePartnershipInquiry(data);
      const newRecordNumber = `PARTNER-${Date.now()}`;
      setRecordNumber(newRecordNumber);
      setPageState('submitted');
      toast({ title: 'Inquiry Submitted!', description: result.confirmationMessage });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit inquiry. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const renderObject = (obj: any, title: string) => {
        if (!obj || Object.keys(obj).length === 0) return null;
        return (
            <Card className="bg-muted/50">
                <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(obj).map(([key, value]) => (
                         <div key={key} className="flex justify-between border-b pb-1">
                            <span className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-right">{String(value) || "-"}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    };
    
    if (applicantType === 'individual' && 'personalDetails' in analysisResult) {
        const data = analysisResult as IdentityAnalysisOutput;
        return (
            <div className="space-y-4">
                {renderObject(data.personalDetails, "Personal Details")}
                {renderObject(data.passportDetails, "Passport Details")}
                {renderObject(data.idCardDetails, "ID Card Details")}
            </div>
        )
    }

    if (applicantType === 'company' && 'companyInfo' in analysisResult) {
        const companyData = analysisResult as CrAnalysisOutput;
        const repData = repAnalysisResult;
        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary">Company Information</h3>
                    {renderObject(companyData.companyInfo, "Company Details")}
                    {companyData.authorizedSignatories && companyData.authorizedSignatories.length > 0 && (
                        <Card className="bg-muted/50">
                            <CardHeader><CardTitle className="text-base">Authorized Signatories</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {companyData.authorizedSignatories.map((sig, i) => <p key={i} className="text-sm">{sig.name} ({sig.designation})</p>)}
                            </CardContent>
                        </Card>
                    )}
                </div>
                {repData && (
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary">Representative Information</h3>
                        {renderObject(repData.personalDetails, "Personal Details")}
                        {renderObject(repData.idCardDetails, "ID Card Details")}
                    </div>
                )}
            </div>
        )
    }
    return null;
  }

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
                    <form onSubmit={companyUploadForm.handleSubmit(handleCrAnalysis)} className="space-y-6">
                        <FormField control={companyUploadForm.control} name="crDocument" render={({ field }) => (
                            <FormItem>
                                <FormLabel>1. Company Commercial Record (CR)</FormLabel>
                                <FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={companyUploadForm.control} name="repIdDocument" render={({ field }) => (
                            <FormItem>
                                <FormLabel>2. Representative's ID Card</FormLabel>
                                <FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
                    </form>
                </Form>
            ) : (
                <Form {...individualUploadForm}>
                    <form onSubmit={individualUploadForm.handleSubmit(handleIndividualAnalysis)} className="space-y-6">
                         <Button type="button" className="w-full" onClick={() => setPageState('capture_id_front')}>
                           <Camera className="mr-2 h-4 w-4" /> Scan ID Card
                        </Button>

                         {individualUploadForm.getValues('idDocumentFrontUri') && (
                            <Alert variant="default" className="text-green-800 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800">
                               <ScanLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                               <AlertTitle>ID Scanned Successfully</AlertTitle>
                               <AlertDescription>
                                Front and back of ID card captured.
                               </AlertDescription>
                           </Alert>
                         )}

                         <FormField control={individualUploadForm.control} name="passportDocument" render={({ field }) => (
                            <FormItem><FormLabel>Passport (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="personalPhoto" render={({ field }) => (
                            <FormItem><FormLabel>Personal Photo (Optional)</FormLabel><FormControl><Input type="file" accept=".png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={individualUploadForm.control} name="cvDocument" render={({ field }) => (
                            <FormItem><FormLabel>CV / Resume (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!individualUploadForm.getValues('idDocumentFrontUri')}><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
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
           <Form {...inquiryForm}>
               <form onSubmit={inquiryForm.handleSubmit(onSubmit)} className="space-y-6">
                    {analysisResult && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-primary">Extracted Information</h3>
                            <p className="text-sm text-muted-foreground">Review the details below. You can edit any field in the form below if there's a mistake.</p>
                            {renderAnalysisResult()}
                        </div>
                    )}

                     <div>
                        <h3 className="font-semibold text-lg text-primary mt-6 mb-4">Confirm Your Details</h3>
                        <div className="space-y-4">
                            <FormField control={inquiryForm.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Name' : 'Full Name'}</FormLabel><FormControl><Input placeholder="Your Company Inc. / John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={inquiryForm.control} name="contactName" render={({ field }) => (<FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={inquiryForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={inquiryForm.control} name="partnershipDetails" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Activities' : 'Professional Summary'} / Partnership Details</FormLabel><FormControl><Textarea placeholder="Describe your company's mission, or your own skills, and how you envision a partnership with us." rows={6} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>

                     <FormField
                        control={inquiryForm.control}
                        name="undertaking"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Information Validity Undertaking</FormLabel>
                                <FormDescription>
                                    I hereby declare that all the information provided is true and correct to the best of my knowledge.
                                </FormDescription>
                                <FormMessage />
                            </div>
                            </FormItem>
                        )}
                    />

                   <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="w-full" type="button" onClick={() => setPageState('upload')}>Upload New Document</Button>
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
               <CardDescription>Your partnership inquiry has been received. A confirmation has been sent to your email. Our partnership agent, Paz, will review your information and get in touch to discuss potential collaboration.</CardDescription>
                {recordNumber && (
                    <Alert>
                        <AlertTitle>Your Record Number</AlertTitle>
                        <AlertDescription className="font-mono text-sm">{recordNumber}</AlertDescription>
                    </Alert>
                )}
           </div>
           <Button asChild onClick={() => setPageState('selection')}><Link href="#">Submit Another Inquiry</Link></Button>
       </div>
   </CardContent>
  );
  
  const renderContent = () => {
    switch (pageState) {
        case 'selection': return <SelectionScreen />;
        case 'upload': return <UploadScreen />;
        case 'analyzing': return <AnalyzingScreen />;
        case 'review': return <ReviewScreen />;
        case 'submitted': return <SubmittedScreen />;
        case 'capture_id_front': return <CameraCapture title="Scan Front of ID Card" onCapture={onIdFrontCaptured} onCancel={() => setPageState('upload')} />;
        case 'capture_id_back': return <CameraCapture title="Scan Back of ID Card" onCapture={onIdBackCaptured} onCancel={() => setPageState('upload')} />;
        default: return <SelectionScreen />;
    }
  };

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
                {renderContent()}
            </Card>
        </div>
      </div>
    </div>
  );
}
