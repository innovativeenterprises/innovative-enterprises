
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { handlePartnershipInquiry } from '@/ai/flows/partnership-inquiry';
import { PartnershipInquiryInputSchema } from '@/ai/flows/partnership-inquiry.schema';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { analyzeIdentity, type IdentityAnalysisOutput } from '@/ai/flows/identity-analysis';
import { generateAgreement, type AgreementGenerationOutput } from '@/ai/flows/generate-agreement';
import { Loader2, CheckCircle, Handshake, UploadCloud, Wand2, UserCheck, Building, User, Camera, ScanLine, FileSignature, Download, Briefcase, CreditCard, Ticket } from 'lucide-react';
import Link from 'next/link';
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

const PaymentSchema = z.object({
    cardholderName: z.string().min(3, 'Cardholder name is required.'),
    cardNumber: z.string().length(19, 'Card number must be 16 digits.'), // 16 digits + 3 spaces
    expiryDate: z.string().length(5, 'Expiry date must be MM/YY.'),
    cvc: z.string().length(3, 'CVC must be 3 digits.'),
    coupon: z.string().optional(),
});
type PaymentValues = z.infer<typeof PaymentSchema>;

type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'payment' | 'submitting' | 'generating_agreements' | 'submitted';
type ApplicantType = 'individual' | 'company';

const REGISTRATION_FEE = 10;

export default function PartnerPage() {
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('company');
  
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | IdentityAnalysisOutput | null>(null);
  const [repAnalysisResult, setRepAnalysisResult] = useState<IdentityAnalysisOutput | null>(null);
  const [agreement, setAgreement] = useState<AgreementGenerationOutput | null>(null);
  const [recordNumber, setRecordNumber] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState(REGISTRATION_FEE);
  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema) });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema) });
  const inquiryForm = useForm<z.infer<typeof PartnershipInquiryInputSchema>>({ resolver: zodResolver(PartnershipInquiryInputSchema) });
  const paymentForm = useForm<PaymentValues>({ resolver: zodResolver(PaymentSchema) });

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
     setPageState('upload');
     toast({ title: 'Front of ID Captured!', description: "You can now optionally scan the back or add other documents."})
  }

  const handleProceedToPayment: SubmitHandler<z.infer<typeof PartnershipInquiryInputSchema>> = async (data) => {
    console.log("Verified Partnership Data:", data);
    setPageState('payment');
  };

  const handleFinalSubmit: SubmitHandler<PaymentValues> = async (paymentData) => {
    setPageState('submitting');
    console.log("Processing payment with details:", paymentData);
    if (finalPrice > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
        toast({ title: 'Payment Successful!', description: "Your payment has been processed."});
    }
    
    setPageState('generating_agreements');
    try {
      // In a real app, you would save the inquiry data to a DB here.
      // We will still call the AI flow to simulate routing it to the Partnerships agent.
      await handlePartnershipInquiry(inquiryForm.getValues());
      
      const agreementData = await generateAgreement({
          applicantType,
          companyData: analysisResult && 'companyInfo' in analysisResult ? analysisResult : undefined,
          individualData: analysisResult && 'personalDetails' in analysisResult && applicantType === 'individual' ? analysisResult : undefined,
          representativeData: repAnalysisResult ? repAnalysisResult : undefined,
      });
      setAgreement(agreementData);
      
      const newRecordNumber = `PARTNER-${Date.now()}`;
      setRecordNumber(newRecordNumber);
      setPageState('submitted');
      toast({ title: 'Inquiry Submitted & Agreements Generated!', description: "Please review the generated agreements below." });

    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit inquiry. Please try again.', variant: 'destructive' });
      setPageState('review');
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
  }

  const handleSaveToBriefcase = () => {
    if (!agreement || !recordNumber) return;
    const briefcaseData = {
        recordNumber,
        applicantName: inquiryForm.getValues('companyName') || inquiryForm.getValues('contactName'),
        agreements: agreement,
        date: new Date().toISOString(),
    };
    try {
        localStorage.setItem('user_briefcase', JSON.stringify(briefcaseData));
        toast({
            title: 'Saved to E-Briefcase!',
            description: (
                <p>You can view your documents anytime from the <Link href="/briefcase" className="font-bold underline">E-Briefcase page</Link>.</p>
            )
        })
    } catch (e) {
        toast({
            title: 'Failed to Save',
            description: 'Could not save documents to your E-Briefcase.',
            variant: 'destructive',
        });
    }
  }

  const handleApplyCoupon = () => {
    const coupon = paymentForm.getValues('coupon')?.toUpperCase();
    if (!coupon) {
      toast({ title: 'Please enter a coupon code.', variant: 'destructive' });
      return;
    }
    // Dummy coupon logic
    if (coupon === 'FREE100') {
      setFinalPrice(0);
      toast({ title: 'Coupon Applied!', description: 'Your registration is now free.' });
    } else if (coupon === 'AGENT50') {
      setFinalPrice(REGISTRATION_FEE / 2);
      toast({ title: 'Coupon Applied!', description: 'You received a 50% discount.' });
    } else {
      toast({ title: 'Invalid Coupon', description: 'The entered coupon code is not valid.', variant: 'destructive' });
    }
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
                                Front of ID card captured.
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
           <Form {...inquiryForm}>
               <form onSubmit={inquiryForm.handleSubmit(handleProceedToPayment)} className="space-y-6">
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
                       <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment</Button>
                   </div>
               </form>
           </Form>
       </CardContent>
   </>
  );

  const PaymentScreen = () => (
    <>
      <CardHeader>
        <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('review')}>&larr; Back to Review</Button>
        <CardTitle className="text-center pt-8">Final Step: Registration Fee</CardTitle>
        <CardDescription className="text-center">Please complete the payment to finalize your registration.</CardDescription>
      </CardHeader>
      <CardContent>
         <Form {...paymentForm}>
          <form onSubmit={paymentForm.handleSubmit(handleFinalSubmit)} className="space-y-4">
            <Card className="bg-muted/50">
                <CardContent className="p-4">
                     <FormField control={paymentForm.control} name="coupon" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coupon Code</FormLabel>
                            <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder="Enter coupon code..." {...field} />
                                </FormControl>
                                <Button type="button" variant="secondary" onClick={handleApplyCoupon}>Apply</Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>
            <div className="mb-6 p-4 rounded-md border bg-muted/50 flex justify-between items-center">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-xl font-bold text-primary">OMR {finalPrice.toFixed(2)}</span>
            </div>
            {finalPrice > 0 && (
                <>
                    <FormField control={paymentForm.control} name="cardholderName" render={({ field }) => (
                        <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input placeholder="Name on Card" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={paymentForm.control} name="expiryDate" render={({ field }) => (
                            <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={paymentForm.control} name="cvc" render={({ field }) => (
                            <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </>
            )}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                {finalPrice > 0 ? `Pay OMR ${finalPrice.toFixed(2)} & Finalize` : `Complete Free Registration`}
            </Button>
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
        <CardTitle className="text-2xl">Partnership Inquiry Submitted!</CardTitle>
        <CardDescription>Thank you! Our Partnership Agent will review your application. Please review and sign the agreements below to finalize the process.</CardDescription>
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
            <Button variant="secondary" onClick={handleSaveToBriefcase}><Briefcase className="mr-2 h-4 w-4"/> Save to E-Briefcase</Button>
            <Button variant="secondary" asChild><Link href="#" onClick={() => setPageState('selection')}>Submit Another Inquiry</Link></Button>
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
        case 'payment': return <PaymentScreen />;
        case 'submitting': return <LoadingScreen title="Finalizing Registration..." description="Processing payment and routing to our partnerships team." />;
        case 'generating_agreements': return <LoadingScreen title="Generating Agreements..." description="Your legal documents are being drafted by our AI." />;
        case 'submitted': return <SubmittedScreen />;
        case 'capture_id_front': return <CameraCapture title="Scan Front of ID Card" onCapture={onIdFrontCaptured} onCancel={() => setPageState('upload')} />;
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
