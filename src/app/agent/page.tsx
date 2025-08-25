
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Handshake, UploadCloud, FileCheck, Wand2, UserCheck, Building, User, Edit, Camera, ScanLine, FileSignature, Download, Briefcase, Mail } from 'lucide-react';
import Link from 'next/link';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { generateAgreement, type AgreementGenerationOutput } from '@/ai/flows/generate-agreement';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraCapture } from '@/components/camera-capture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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

const ManualEntrySchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().optional(),
  interest: z.string().min(10, "Please tell us why you are interested."),
  undertaking: z.boolean().refine(val => val === true, "You must confirm the validity of the information."),
});
type ManualEntryValues = z.infer<typeof ManualEntrySchema>;

type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'submitting' | 'generating_agreements' | 'submitted';
type ApplicantType = 'individual' | 'company';

export default function AgentPage() {
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('individual');
  
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | IdentityAnalysisOutput | null>(null);
  const [repAnalysisResult, setRepAnalysisResult] = useState<IdentityAnalysisOutput | null>(null);
  const [agreement, setAgreement] = useState<AgreementGenerationOutput | null>(null);
  const [recordNumber, setRecordNumber] = useState<string | null>(null);
  
  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema) });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema) });
  const manualEntryForm = useForm<ManualEntryValues>({ resolver: zodResolver(ManualEntrySchema) });

  const startManualEntry = () => {
    manualEntryForm.reset({ name: '', email: '', phone: '', interest: '', undertaking: false });
    setAnalysisResult(null);
    setRepAnalysisResult(null);
    setPageState('review');
  }

  const handleCompanyCrAnalysis: SubmitHandler<CompanyUploadValues> = async (data) => {
    setPageState('analyzing');
    manualEntryForm.reset();
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

        manualEntryForm.reset({
            name: crResult.companyInfo?.companyNameEnglish || crResult.companyInfo?.companyNameArabic || '',
            email:  repResult.personalDetails?.email || crResult.companyInfo?.contactEmail || '',
            phone: crResult.companyInfo?.contactMobile || '',
            interest: crResult.summary || 'Interest based on company activities.',
            undertaking: false,
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review the extracted details.' });
    } catch(e) {
        toast({ title: 'Analysis Failed', description: 'Could not analyze document. Please fill the form manually.', variant: 'destructive' });
        startManualEntry();
    }
  }

  const handleIndividualAnalysis: SubmitHandler<IndividualUploadValues> = async (data) => {
    setPageState('analyzing');
    manualEntryForm.reset();
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
            photoUri 
        });
        setAnalysisResult(result);
        manualEntryForm.reset({
            name: result.personalDetails?.fullName || '',
            email: result.personalDetails?.email || '',
            phone: result.personalDetails?.phone || '',
            interest: result.professionalSummary || '',
            undertaking: false,
        });
        setPageState('review');
        toast({ title: 'Analysis Complete!', description: 'Please review the extracted details.' });
    } catch(e) {
        console.error(e);
        toast({ title: 'Analysis Failed', description: 'Could not analyze documents. Please fill the form manually.', variant: 'destructive' });
        startManualEntry();
    }
  }
  
  const onIdFrontCaptured = (imageUri: string) => {
    individualUploadForm.setValue('idDocumentFrontUri', imageUri);
    // setPageState('capture_id_back');
    // For simplicity, let's assume back is optional and move on
     setPageState('upload');
     toast({ title: 'Front of ID Captured!', description: "You can now optionally scan the back or add other documents."})
  }

  const onSubmit: SubmitHandler<ManualEntryValues> = async (data) => {
    setPageState('submitting');
    // Here you would typically send the data to your backend.
    // For this prototype, we'll just simulate a successful submission.
    console.log("Submitting Agent Application:", data, analysisResult, repAnalysisResult);
    
    // Generate agreements
    setPageState('generating_agreements');
    try {
        const agreementData = await generateAgreement({
            applicantType,
            companyData: analysisResult && 'companyInfo' in analysisResult ? analysisResult : undefined,
            individualData: analysisResult && 'personalDetails' in analysisResult && applicantType === 'individual' ? analysisResult : undefined,
            representativeData: repAnalysisResult ? repAnalysisResult : undefined,
        });
        setAgreement(agreementData);

        const newRecordNumber = `AGENT-${Date.now()}`;
        setRecordNumber(newRecordNumber);
        setPageState('submitted');
        toast({ title: 'Application Submitted & Agreements Generated!', description: "Please review and sign the generated agreements." });

    } catch(e) {
        console.error("Agreement generation failed:", e);
        toast({ title: 'Submission Failed', description: 'Could not generate agreements. Please contact support.', variant: 'destructive' });
        setPageState('review'); // Go back to review page on failure
    }
  };

   const handleDownloadAgreement = (type: 'nda' | 'service') => {
    if (!agreement) return;
    const content = type === 'nda' ? agreement.ndaContent : agreement.serviceAgreementContent;
    const filename = type === 'nda' ? 'NDA.txt' : 'Service-Agreement.txt';
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Downloaded!', description: `Your ${filename} has been downloaded.`});
  };

  const handleESign = () => {
    toast({ title: 'Thank You!', description: "Your agreements have been electronically signed and saved."});
    // Here you would typically integrate with an e-signature service API
  }
  
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
                    <form onSubmit={companyUploadForm.handleSubmit(handleCompanyCrAnalysis)} className="space-y-6">
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
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90"><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
                    </form>
                </Form>
            ) : (
                 <Form {...individualUploadForm}>
                    <form onSubmit={individualUploadForm.handleSubmit(handleIndividualAnalysis)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" onClick={() => setPageState('capture_id_front')}>
                               <Camera className="mr-2 h-4 w-4" /> Scan Front of ID
                            </Button>
                             <Button type="button" variant="outline" onClick={() => alert("Please scan the back of the ID card.")}>
                               <Camera className="mr-2 h-4 w-4" /> Scan Back of ID
                            </Button>
                        </div>

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
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!individualUploadForm.getValues('idDocumentFrontUri')}><Wand2 className="mr-2 h-4 w-4" /> Analyze Documents</Button>
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

  const LoadingScreen = ({title, description}: {title: string, description: string}) => (
     <CardContent className="p-10 text-center">
       <div className="flex flex-col items-center gap-6">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
           <div className="space-y-2">
               <CardTitle className="text-2xl">{title}</CardTitle>
               <CardDescription>{description}</CardDescription>
           </div>
       </div>
   </CardContent>
  )

  const ReviewScreen = () => (
    <>
       <CardHeader>
           <CardTitle className="flex items-center gap-2"><UserCheck /> Verify Your Details</CardTitle>
           <CardDescription>Please check the information extracted by our AI and fill in any missing fields before submitting.</CardDescription>
       </CardHeader>
       <CardContent>
           <Form {...manualEntryForm}>
               <form onSubmit={manualEntryForm.handleSubmit(onSubmit)} className="space-y-6">
                   
                    {analysisResult && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-primary">Extracted Information</h3>
                            <p className="text-sm text-muted-foreground">Review the details below. For any corrections, please edit the form fields.</p>
                            {renderAnalysisResult()}
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-lg text-primary mt-6 mb-4">Confirm Your Details</h3>
                        <div className="space-y-4">
                            <FormField control={manualEntryForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>{applicantType === 'company' ? 'Company Name' : 'Full Name'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={manualEntryForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={manualEntryForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={manualEntryForm.control} name="interest" render={({ field }) => (<FormItem><FormLabel>Why are you interested in becoming an agent?</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>

                    <FormField
                        control={manualEntryForm.control}
                        name="undertaking"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Information Validity Undertaking</FormLabel>
                                <FormDescription>
                                I hereby declare that the information provided is true and correct to the best of my knowledge.
                                </FormDescription>
                                <FormMessage />
                            </div>
                            </FormItem>
                        )}
                    />

                   <div className="flex gap-2 pt-4">
                        <Button variant="outline" type="button" className="w-full" onClick={() => setPageState('upload')}>&larr; Back to Upload</Button>
                       <Button type="submit" className="w-full bg-accent hover:bg-accent/90"><Handshake className="mr-2 h-4 w-4" /> Apply Now</Button>
                   </div>
               </form>
           </Form>
       </CardContent>
   </>
  );

  const SubmittedScreen = () => (
    <>
    <CardHeader className="text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Application Submitted!</CardTitle>
        <CardDescription>Thank you! Your application has been received. Please review and sign the agreements below to finalize the process.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
        {recordNumber && (
            <Alert>
                <AlertTitle>Your Record Number</AlertTitle>
                <AlertDescription className="font-mono text-sm">{recordNumber}</AlertDescription>
            </Alert>
        )}
        <Tabs defaultValue="nda" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nda">Non-Disclosure Agreement</TabsTrigger>
                <TabsTrigger value="service">Service Agreement</TabsTrigger>
            </TabsList>
            <TabsContent value="nda">
                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-80 overflow-y-auto">
                    {agreement?.ndaContent}
                </div>
                <Button onClick={() => handleDownloadAgreement('nda')} variant="outline" className="w-full mt-2">
                    <Download className="mr-2 h-4 w-4" /> Download NDA
                </Button>
            </TabsContent>
            <TabsContent value="service">
                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-80 overflow-y-auto">
                    {agreement?.serviceAgreementContent}
                </div>
                <Button onClick={() => handleDownloadAgreement('service')} variant="outline" className="w-full mt-2">
                    <Download className="mr-2 h-4 w-4" /> Download Service Agreement
                </Button>
            </TabsContent>
        </Tabs>
    </CardContent>
    <CardFooter className="flex-col gap-4">
        <Button onClick={handleESign} className="w-full" size="lg">
            <FileSignature className="mr-2 h-5 w-5" /> E-Sign Both Agreements
        </Button>
        <div className="flex justify-center gap-4 w-full">
             <Button variant="secondary" disabled><Briefcase className="mr-2 h-4 w-4"/> Save to E-Briefcase</Button>
             <Button variant="secondary" asChild><Link href="/opportunities">View Opportunities</Link></Button>
        </div>
    </CardFooter>
    </>
  );

  const renderContent = () => {
    switch (pageState) {
        case 'selection': return <SelectionScreen />;
        case 'upload': return <UploadScreen />;
        case 'analyzing': return <LoadingScreen title="Analyzing Documents..." description="Our AI is reading your documents. This may take a moment." />;
        case 'review': return <ReviewScreen />;
        case 'submitting': return <LoadingScreen title="Submitting Application..." description="Please wait while we process your application." />;
        case 'generating_agreements': return <LoadingScreen title="Generating Agreements..." description="Your legal documents are being drafted by our AI." />;
        case 'submitted': return <SubmittedScreen />;
        case 'capture_id_front': return <CameraCapture title="Scan Front of ID Card" onCapture={onIdFrontCaptured} onCancel={() => setPageState('upload')} />;
        // case 'capture_id_back': return <CameraCapture title="Scan Back of ID Card" onCapture={onIdBackCaptured} onCancel={() => setPageState('upload')} />;
        default: return <SelectionScreen />;
    }
  };


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
                {renderContent()}
            </Card>
        </div>
      </div>
    </div>
  );
}
