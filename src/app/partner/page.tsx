'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { generateAgreement, type AgreementGenerationOutput } from '@/ai/flows/generate-agreement';
import { Loader2, CheckCircle, Handshake, UploadCloud, Wand2, UserCheck, Building, User, Camera, ScanLine, FileSignature, Download, Briefcase, CreditCard, Ticket, BadgePercent, Phone, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraCapture } from '@/components/camera-capture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsData } from '@/hooks/use-data-hooks';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fileToDataURI } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Become a Partner | Innovative Enterprises",
  description: "Join our network of trusted freelancers, subcontractors, and service providers. Upload your documents to get started quickly with our AI-assisted onboarding.",
};


const businessCategories = [
    "Tech & IT Services",
    "Creative & Design",
    "Consulting & Professional Services",
    "Legal Services",
    "Financial & Banking",
    "Automotive Services",
    "Health & Wellness",
    "Printing & Publishing",
    "Events & Entertainment",
    "Other",
];

const pricingTemplates: Record<string, string[][]> = {
    "Tech & IT Services": [
        ["ServiceName", "ServiceDescription", "Unit", "Price (OMR)"],
        ["Custom Website Development", "Full website design and build (up to 10 pages)", "per project", ""],
        ["E-commerce Store Setup", "Setup of a Shopify or WooCommerce store", "per project", ""],
        ["Mobile App Development (iOS)", "Native iOS application development", "per project", ""],
        ["Mobile App Development (Android)", "Native Android application development", "per project", ""],
        ["API Integration", "Connecting two software systems via API", "per integration", ""],
        ["Monthly IT Support (Basic)", "Up to 10 hours of remote IT support", "per month", ""],
        ["Monthly IT Support (Premium)", "Up to 30 hours of remote and on-site support", "per month", ""],
        ["Cloud Server Setup", "Configuration of a new cloud server (AWS, Azure, GCP)", "per server", ""],
        ["Cybersecurity Audit", "Basic security vulnerability assessment", "per audit", ""],
    ],
    "Creative & Design": [
        ["ServiceName", "ServiceDescription", "Unit", "Price (OMR)"],
        ["Logo Design & Branding Package", "Full brand identity kit (logo, color palette, fonts)", "per package", ""],
        ["Social Media Graphics (Monthly)", "Set of 20 custom graphics for social media", "per month", ""],
        ["Promotional Video (1-min)", "1-minute animated or live-action marketing video", "per video", ""],
        ["UI/UX Design for Mobile App", "Complete UI/UX design for up to 15 screens", "per project", ""],
        ["Website Mockup Design", "Visual mockup for a new website (up to 5 pages)", "per project", ""],
        ["Company Profile Brochure", "Design of a 12-page A4 company profile", "per brochure", ""],
    ],
    "Consulting & Professional Services": [
        ["ServiceName", "ServiceDescription", "Unit", "Price (OMR)"],
        ["Business Strategy Workshop", "Full-day strategic planning session with key stakeholders", "per workshop", ""],
        ["Market Research Report", "In-depth analysis of a target market segment", "per report", ""],
        ["Hourly Consultation", "Expert advice on a specific topic (e.g., finance, marketing, HR)", "per hour", ""],
        ["Financial Modeling", "Creation of a 5-year financial forecast for your business", "per project", ""],
        ["HR Policy Manual Creation", "Development of a comprehensive HR policy document", "per project", ""],
    ],
    "Printing & Publishing": [
        ["ServiceName", "ServiceDescription", "Unit", "Price (OMR)"],
        ["Business Cards (x500)", "Double-sided, premium cardstock", "per 500 cards", ""],
        ["A4 Flyers (x1000)", "Full color, double-sided printing", "per 1000 flyers", ""],
        ["Roll-up Banner", "Standard size roll-up banner with stand", "per banner", ""],
        ["Book Printing (100 pages)", "Paperback book printing, A5 size", "per copy", ""],
    ],
     "Events & Entertainment": [
        ["ServiceName", "ServiceDescription", "Unit", "Price (OMR)"],
        ["Corporate Event Planning", "Full planning for an event up to 100 guests", "per event", ""],
        ["Photography Services", "4 hours of event photography coverage", "per event", ""],
        ["Videography Services", "4 hours of event videography coverage + edited video", "per event", ""],
        ["Live Band / DJ", "3-hour performance set", "per event", ""],
    ],
    "default": [
        ["ServiceName", "ServiceDescription", "Unit (e.g., per hour, per project)", "Price (OMR)"],
        ["", "", "", ""],
    ]
};

const CompanyUploadSchema = z.object({
  crDocument: z.any().optional(),
  crDocumentUri: z.string().optional(),
  logoFile: z.any().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  repIdDocumentFrontUri: z.string().optional(),
  repIdDocumentBackUri: z.string().optional(),
  primaryBusinessCategory: z.string().min(1, "Please select your primary business category."),
  additionalBusinessCategories: z.array(z.string()).optional(),
  serviceChargesFile: z.any().optional(),
}).refine(data => data.crDocumentUri || (data.crDocument && data.crDocument.length > 0), {
    message: "A Commercial Record is required.",
    path: ["crDocument"],
});
type CompanyUploadValues = z.infer<typeof CompanyUploadSchema>;

const IndividualUploadSchema = z.object({
    idDocumentFrontUri: z.string().min(1, 'Front of ID is required.'),
    idDocumentBackUri: z.string().optional(),
    passportDocument: z.any().optional(),
    personalPhoto: z.any().optional(),
    cvDocument: z.any().optional(),
    primaryBusinessCategory: z.string().min(1, "Please select your primary skill or category."),
    additionalBusinessCategories: z.array(z.string()).optional(),
    serviceChargesFile: z.any().optional(),
});
type IndividualUploadValues = z.infer<typeof IndividualUploadSchema>;

const PaymentSchema = z.object({
    cardholderName: z.string().min(3, 'Cardholder name is required.'),
    cardNumber: z.string().length(19, 'Card number must be 16 digits.'), // 16 digits + 3 spaces
    expiryDate: z.string().length(5, 'Expiry date must be in MM/YY.'),
    cvc: z.string().length(3, 'CVC must be 3 digits.'),
    coupon: z.string().optional(),
    subscriptionTier: z.enum(['monthly', 'yearly', 'lifetime']),
});
type PaymentValues = z.infer<typeof PaymentSchema>;

type PageState = 'selection' | 'upload' | 'analyzing' | 'review' | 'payment' | 'submitting' | 'generating_agreements' | 'submitted' | 'capture_id_front' | 'capture_id_back' | 'capture_rep_id_front' | 'capture_rep_id_back' | 'capture_cr';
type ApplicantType = 'individual' | 'company';

const EXTRA_SERVICE_FEE = 1.5;

const PartnershipCard = ({ cardRef, partnerName, crNumber, joiningDate, expiryDate, classification, services, partnerType, logoUrl }: {
    cardRef: React.RefObject<HTMLDivElement>,
    partnerName: string,
    crNumber?: string,
    joiningDate: string,
    expiryDate: string,
    classification: string,
    services: string,
    partnerType: string,
    logoUrl?: string,
}) => {
    
    const getTierColor = () => {
        switch(classification.toLowerCase()) {
            case 'diamond': return 'from-blue-400 to-indigo-500';
            case 'gold': return 'from-yellow-400 to-amber-500';
            case 'silver': return 'from-gray-400 to-slate-500';
            case 'bronze': return 'from-orange-400 to-amber-600';
            default: return 'from-gray-200 to-gray-300';
        }
    }

    const getTierTextColor = () => {
         switch(classification.toLowerCase()) {
            case 'diamond':
            case 'gold':
            case 'silver':
            case 'bronze': return 'text-white';
            default: return 'text-gray-800';
        }
    }

    return (
        <div ref={cardRef} className={`w-full max-w-lg mx-auto rounded-xl bg-gradient-to-br ${getTierColor()} p-1 shadow-2xl`}>
            <div className="bg-gray-800 rounded-lg p-6 relative h-full text-white">
                 <div className="absolute top-4 right-4">
                    <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="IE Logo" width={40} height={40} className="opacity-80" />
                </div>
                 <div className="absolute bottom-0 right-0 w-32 h-32">
                    <img src="https://www.svgrepo.com/show/493547/qr-code.svg" alt="QR Code" className="w-full h-full opacity-10" />
                </div>
                
                <div className="flex items-start gap-4">
                    {logoUrl && (
                        <div className="w-20 h-20 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1">
                            <Image src={logoUrl} alt="Partner Logo" width={72} height={72} className="object-contain" />
                        </div>
                    )}
                    <div className="flex-grow">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{partnerType}</p>
                        <h3 className="text-2xl font-bold">{partnerName}</h3>
                        {crNumber && <p className="font-mono text-sm opacity-80">CRN: {crNumber}</p>}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="text-sm">
                        <p className="font-semibold opacity-70">Services:</p>
                        <p className="opacity-90 truncate">{services}</p>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                        <div>
                            <p className="opacity-70">Joined:</p>
                            <p className="font-semibold opacity-90">{joiningDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="opacity-70">Expires:</p>
                            <p className="font-semibold opacity-90">{expiryDate}</p>
                        </div>
                    </div>
                </div>

                 <div className="absolute bottom-4 left-4">
                    <p className={`font-bold text-lg tracking-wider uppercase ${getTierTextColor()} flex items-center gap-2`}>
                        <Star className="w-5 h-5 fill-current" /> {classification} Partner
                    </p>
                </div>
            </div>
        </div>
    )
}


export default function PartnerPage() {
  const { settings } = useSettingsData();
  const { sanadOffice: sanadSettings } = settings || {};
  
  const [pageState, setPageState] = useState<PageState>('selection');
  const [applicantType, setApplicantType] = useState<ApplicantType>('company');
  
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | IdentityAnalysisOutput | null>(null);
  const [repAnalysisResult, setRepAnalysisResult] = useState<IdentityAnalysisOutput | null>(null);
  const [agreement, setAgreement] = useState<AgreementGenerationOutput | null>(null);
  const [recordNumber, setRecordNumber] = useState<string | null>(null);
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipping, setIsFlipping] = useState(false);


  const { toast } = useToast();

  const companyUploadForm = useForm<CompanyUploadValues>({ resolver: zodResolver(CompanyUploadSchema), defaultValues: { primaryBusinessCategory: "", additionalBusinessCategories: [] } });
  const individualUploadForm = useForm<IndividualUploadValues>({ resolver: zodResolver(IndividualUploadSchema), defaultValues: { primaryBusinessCategory: "", additionalBusinessCategories: [] } });
  const inquiryForm = useForm<z.infer<typeof PartnershipInquiryInputSchema>>({ resolver: zodResolver(PartnershipInquiryInputSchema) });
  const paymentForm = useForm<PaymentValues>({ resolver: zodResolver(PaymentSchema), defaultValues: { subscriptionTier: 'monthly' }});

  const watchSubscriptionTier = paymentForm.watch('subscriptionTier');
  const watchCouponCode = paymentForm.watch('coupon');

  const { subtotal, discount, totalPrice } = useMemo(() => {
    if (!sanadSettings) return { subtotal: 0, discount: 0, totalPrice: 0 };
    let currentSubtotal = 0;
    if (watchSubscriptionTier === 'lifetime') {
        currentSubtotal = sanadSettings.lifetimeFee;
    } else {
        const subscriptionFee = watchSubscriptionTier === 'yearly' ? sanadSettings.yearlyFee : sanadSettings.monthlyFee;
        const currentDiscount = subscriptionFee * sanadSettings.firstTimeDiscountPercentage;
        currentSubtotal = sanadSettings.registrationFee + subscriptionFee - currentDiscount;
    }
    
    let finalDiscount = 0;
    if (watchCouponCode?.toUpperCase() === 'AGENT50') {
      finalDiscount = currentSubtotal * 0.5;
    } else if (watchCouponCode?.toUpperCase() === 'FREE100') {
      finalDiscount = currentSubtotal;
    }

    return {
      subtotal: currentSubtotal,
      discount: finalDiscount,
      totalPrice: currentSubtotal - finalDiscount,
    };
  }, [watchSubscriptionTier, sanadSettings, watchCouponCode]);
  
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
        let crUri = data.crDocumentUri;
        if (!crUri && data.crDocument && data.crDocument.length > 0) {
            crUri = await fileToDataURI(data.crDocument[0]);
        }
        if (!crUri) throw new Error("Commercial Record data is missing.");

        const crPromise = analyzeCrDocument({ documentDataUri: crUri });
        
        let repIdPromise: Promise<IdentityAnalysisOutput | null> = Promise.resolve(null);
        if (data.repIdDocumentFrontUri) {
            repIdPromise = analyzeIdentity({ 
                idDocumentFrontUri: data.repIdDocumentFrontUri,
                idDocumentBackUri: data.repIdDocumentBackUri,
            });
        }

        const [crResult, repResult] = await Promise.all([crPromise, repIdPromise]);
        
        if (data.logoFile && data.logoFile.length > 0) {
            setLogoDataUri(await fileToDataURI(data.logoFile[0]));
        }
        
        setAnalysisResult(crResult);
        if (repResult) setRepAnalysisResult(repResult);
        
        inquiryForm.reset({
            companyName: crResult.companyInfo?.companyNameEnglish || crResult.companyInfo?.companyNameArabic || '',
            contactName: repResult?.personalDetails?.fullName || crResult.authorizedSignatories?.[0]?.name || '',
            email: repResult?.personalDetails?.email || crResult.companyInfo?.contactEmail || '',
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
            setLogoDataUri(photoUri);
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
     setIsFlipping(true);
     setTimeout(() => {
        setPageState('capture_id_back');
        setIsFlipping(false);
     }, 500);
     toast({ title: 'Front of ID Captured!', description: "Please scan the back of the ID card now."})
  }

  const onIdBackCaptured = (imageUri: string) => {
    individualUploadForm.setValue('idDocumentBackUri', imageUri);
    setPageState('upload');
    toast({ title: 'Back of ID Captured!', description: "You can now proceed with the analysis."});
  }

  const onRepIdFrontCaptured = (imageUri: string) => {
    companyUploadForm.setValue('repIdDocumentFrontUri', imageUri);
    setIsFlipping(true);
    setTimeout(() => {
        setPageState('capture_rep_id_back');
        setIsFlipping(false);
    }, 500);
    toast({ title: "Representative's ID Front Captured!", description: "Please scan the back of the ID card now."})
  }
  
  const onRepIdBackCaptured = (imageUri: string) => {
    companyUploadForm.setValue('repIdDocumentBackUri', imageUri);
    setPageState('upload');
    toast({ title: "Representative's ID Back Captured!", description: "You can now proceed with the analysis."});
  }

  const onCrCaptured = (imageUri: string) => {
    companyUploadForm.setValue('crDocumentUri', imageUri);
    setPageState('upload');
    toast({ title: 'Commercial Record Captured!', description: 'You can now proceed with the analysis.' });
  };


  const handleProceedToPayment: SubmitHandler<z.infer<typeof PartnershipInquiryInputSchema>> = async (data) => {
    console.log("Verified Partnership Data:", data);
    setPageState('payment');
  };

  const onPaymentSubmit: SubmitHandler<PaymentValues> = async (paymentData) => {
    setPageState('submitting');
    console.log("Processing payment with details:", paymentData);
    if (totalPrice > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
        toast({ title: 'Payment Successful!', description: "Your payment has been processed."});
    }
    
    setPageState('generating_agreements');
    try {
      await handlePartnershipInquiry(inquiryForm.getValues());
      
      const agreementData = await generateAgreement({
          applicantType,
          companyData: analysisResult && 'companyInfo' in analysisResult ? analysisResult : undefined,
          individualData: analysisResult && 'personalDetails' in analysisResult && applicantType === 'individual' ? analysisResult : undefined,
          representativeData: repAnalysisResult ? repAnalysisResult : undefined,
      });
      setAgreement(agreementData);
      
      const newRecordNumber = `PARTNER_${inquiryForm.getValues('companyName').substring(0, 5).toUpperCase()}${String(new Date().getTime()).slice(-4)}`;
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

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    toast({ title: 'Generating Card...', description: 'Please wait.' });
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'innovative-enterprises-partner-card.png';
      link.href = dataUrl;
      link.click();
    } catch(e) {
        toast({ title: 'Error', description: 'Could not generate card image.', variant: 'destructive' });
    }
  };

  const handleESign = () => {
    toast({ title: 'Thank You!', description: "Your agreements have been electronically signed and saved."});
  }

  const handleSaveToBriefcase = async () => {
    if (!agreement || !recordNumber) return;

    const formToUse = applicantType === 'company' ? companyUploadForm : individualUploadForm;
    const primaryCategory = formToUse.getValues('primaryBusinessCategory');
    const additionalCategories = formToUse.getValues('additionalBusinessCategories') || [];
    const allCategories = [primaryCategory, ...additionalCategories].filter(Boolean).join(', ');
    
    const serviceChargesFile = formToUse.getValues('serviceChargesFile');

    let registrations = [];
    if (allCategories) {
        let priceListUrl: string | undefined;
        let priceListFilename: string | undefined;
        if(serviceChargesFile && serviceChargesFile.length > 0) {
            priceListUrl = await fileToDataURI(serviceChargesFile[0]);
            priceListFilename = serviceChargesFile[0].name;
        }
        registrations.push({ category: allCategories, priceListUrl, priceListFilename });
    }

    const briefcaseData = {
        recordNumber,
        applicantName: inquiryForm.getValues('companyName') || inquiryForm.getValues('contactName'),
        agreements: agreement,
        date: new Date().toISOString(),
        registrations,
        userDocuments: [],
        savedBoqs: [],
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
    paymentForm.trigger('coupon');
    // The useMemo hook will automatically recalculate the price.
  };

  const handleDownloadPricingTemplate = () => {
    const templateData = pricingTemplates.default;
    
    let csvContent = templateData.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'pricing_template_generic.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const additionalCategoriesCount = (applicantType === 'company' ? companyUploadForm.watch('additionalBusinessCategories') : individualUploadForm.watch('additionalBusinessCategories'))?.length || 0;
  
  const allSelectedServices = () => {
    const formToUse = applicantType === 'company' ? companyUploadForm : individualUploadForm;
    const primary = formToUse.getValues('primaryBusinessCategory');
    const additional = formToUse.getValues('additionalBusinessCategories') || [];
    return [primary, ...additional].filter(Boolean);
  }

  const getClassification = (serviceCount: number): string => {
        if (serviceCount >= 6) return 'Diamond';
        if (serviceCount >= 4) return 'Gold';
        if (serviceCount >= 2) return 'Silver';
        return 'Bronze';
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
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('selection')}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
            <CardTitle className="flex items-center gap-2 justify-center pt-8"><UploadCloud /> Upload Your Documents</CardTitle>
            <CardDescription className="text-center">Our AI will analyze your documents to auto-fill the partnership form.</CardDescription>
        </CardHeader>
        <CardContent>
             {applicantType === 'company' ? (
                <Form {...companyUploadForm}>
                    <form onSubmit={companyUploadForm.handleSubmit(handleCrAnalysis)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={companyUploadForm.control} name="crDocument" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1. Company CR (File)</FormLabel>
                                    <FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="flex flex-col">
                                <FormLabel>Or Scan Live</FormLabel>
                                <Button type="button" onClick={() => setPageState('capture_cr')} className="w-full mt-2">
                                <Camera className="mr-2 h-4 w-4" /> Scan CR Document
                                </Button>
                                 {(companyUploadForm.getValues('crDocumentUri')) && (
                                <Alert variant="default" className="text-green-800 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800 mt-2 text-xs">
                                    <ScanLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="font-semibold">CR Scanned</AlertTitle>
                                </Alert>
                                )}
                            </div>
                        </div>

                        <FormField control={companyUploadForm.control} name="logoFile" render={({ field }) => (
                           <FormItem><FormLabel>2. Company Logo (Optional)</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)}/></FormControl><FormMessage/></FormItem>
                        )}/>
                         <FormField control={companyUploadForm.control} name="address" render={({ field }) => (
                           <FormItem><FormLabel>3. Physical Address (if different from CR)</FormLabel><FormControl><Input placeholder="e.g., Al-Khuwair, Muscat" {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                         <div>
                          <FormLabel>4. Representative's ID Card (Optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                              <Button type="button" onClick={() => setPageState('capture_rep_id_front')}>
                                <Camera className="mr-2 h-4 w-4" /> Scan Front of ID
                              </Button>
                          </div>
                          {(companyUploadForm.getValues('repIdDocumentFrontUri') || companyUploadForm.getValues('repIdDocumentBackUri')) && (
                            <Alert variant="default" className="text-green-800 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800 mt-2">
                               <ScanLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                               <AlertTitle>ID Scanned</AlertTitle>
                               <AlertDescription>
                                {companyUploadForm.getValues('repIdDocumentFrontUri') && "Front captured. "}
                                {companyUploadForm.getValues('repIdDocumentBackUri') && "Back captured."}
                               </AlertDescription>
                           </Alert>
                          )}
                        </div>
                        
                         <FormField
                            control={companyUploadForm.control}
                            name="primaryBusinessCategory"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>5. Primary Business Category (Free)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select your main service..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {businessCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                         <FormField
                            control={companyUploadForm.control}
                            name="additionalBusinessCategories"
                            render={() => (
                            <FormItem>
                                <div className="mb-4">
                                     <FormLabel>6. Additional Categories (OMR {EXTRA_SERVICE_FEE.toFixed(2)} each)</FormLabel>
                                     <FormDescription>Select any other services you provide.</FormDescription>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                {businessCategories.map((item) => (
                                    <FormField key={item} control={companyUploadForm.control} name="additionalBusinessCategories"
                                    render={({ field }) => (
                                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                disabled={item === companyUploadForm.watch('primaryBusinessCategory')}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), item])
                                                    : field.onChange(field.value?.filter((value) => value !== item))
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                    )}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField control={companyUploadForm.control} name="serviceChargesFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>7. Services & Pricing List (Optional)</FormLabel>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="secondary" onClick={handleDownloadPricingTemplate} className="w-full sm:w-auto">
                                        <Download className="mr-2 h-4 w-4" /> Download Template
                                    </Button>
                                    <FormControl className="flex-1">
                                        <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                </div>
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
                            <Button type="button" onClick={() => setPageState('capture_id_front')} disabled={!!individualUploadForm.getValues('idDocumentFrontUri')}>
                               <Camera className="mr-2 h-4 w-4" /> Scan Front of ID
                            </Button>
                             <Button type="button" variant="outline" onClick={() => setPageState('capture_id_back')} disabled={!individualUploadForm.getValues('idDocumentFrontUri') || !!individualUploadForm.getValues('idDocumentBackUri')}>
                               <Camera className="mr-2 h-4 w-4" /> Scan Back of ID
                            </Button>
                        </div>

                         {(individualUploadForm.getValues('idDocumentFrontUri') || individualUploadForm.getValues('idDocumentBackUri')) && (
                            <Alert variant="default" className="text-green-800 bg-green-50 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800">
                               <ScanLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                               <AlertTitle>ID Scanned Successfully</AlertTitle>
                               <AlertDescription>
                                {individualUploadForm.getValues('idDocumentFrontUri') && "Front of ID captured. "}
                                {individualUploadForm.getValues('idDocumentBackUri') && "Back of ID captured."}
                               </AlertDescription>
                           </Alert>
                         )}
                         <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={individualUploadForm.control} name="passportDocument" render={({ field }) => (
                                <FormItem><FormLabel>Passport (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={individualUploadForm.control} name="personalPhoto" render={({ field }) => (
                                <FormItem><FormLabel>Personal Photo (Optional)</FormLabel><FormControl><Input type="file" accept=".png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <FormField control={individualUploadForm.control} name="cvDocument" render={({ field }) => (
                            <FormItem><FormLabel>CV / Resume (Optional)</FormLabel><FormControl><Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                         <FormField
                            control={individualUploadForm.control}
                            name="primaryBusinessCategory"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Skill / Category (Free)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select your main skill..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {businessCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={individualUploadForm.control}
                            name="additionalBusinessCategories"
                            render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel>Additional Skills (OMR {EXTRA_SERVICE_FEE.toFixed(2)} each)</FormLabel>
                                    <FormDescription>Select any other services you provide.</FormDescription>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                {businessCategories.map((item) => (
                                    <FormField
                                    key={item}
                                    control={individualUploadForm.control}
                                    name="additionalBusinessCategories"
                                    render={({ field }) => (
                                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                disabled={item === individualUploadForm.watch('primaryBusinessCategory')}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item])
                                                    : field.onChange(field.value?.filter(value => value !== item))
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                    )}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField control={individualUploadForm.control} name="serviceChargesFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Services & Pricing List (Optional)</FormLabel>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="secondary" onClick={handleDownloadPricingTemplate} className="w-full sm:w-auto">
                                        <Download className="mr-2 h-4 w-4" /> Download Template
                                    </Button>
                                    <FormControl className="flex-1">
                                        <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
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

  const PaymentScreen = () => {
    return (
        <>
        <CardHeader>
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('review')}>&larr; Back</Button>
            <CardTitle className="text-center pt-8 flex items-center justify-center gap-2"><CreditCard className="h-6 w-6"/> Step 3: Subscription & Payment</CardTitle>
            <CardDescription className="text-center">Choose your plan and complete the payment to join the network.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <Card className="bg-muted/50">
                    <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {watchSubscriptionTier !== 'lifetime' && <div className="flex justify-between"><span>One-time Registration Fee:</span><span>OMR {sanadSettings.registrationFee.toFixed(2)}</span></div>}
                        {watchSubscriptionTier === 'monthly' && <div className="flex justify-between"><span>Monthly Subscription:</span><span>OMR {sanadSettings.monthlyFee.toFixed(2)}</span></div>}
                        {watchSubscriptionTier === 'yearly' && <div className="flex justify-between"><span>Yearly Subscription:</span><span>OMR {sanadSettings.yearlyFee.toFixed(2)}</span></div>}
                        {watchSubscriptionTier !== 'lifetime' && <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold"><span>First-time Discount ({sanadSettings.firstTimeDiscountPercentage * 100}%):</span><span>- OMR {( (watchSubscriptionTier === 'yearly' ? sanadSettings.yearlyFee : sanadSettings.monthlyFee) * sanadSettings.firstTimeDiscountPercentage).toFixed(2)}</span></div>}
                        {discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold"><span>Coupon Discount:</span><span>- OMR {discount.toFixed(2)}</span></div>}
                        <hr className="my-2 border-dashed" />
                        <div className="flex justify-between font-bold text-lg"><span>Total Due Today:</span><span className="text-primary">OMR {totalPrice.toFixed(2)}</span></div>
                    </CardContent>
                     <CardFooter>
                        <FormField control={paymentForm.control} name="coupon" render={({ field }) => (
                            <FormItem className="w-full">
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
                    </CardFooter>
                </Card>
               
                {totalPrice > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                        <div className="space-y-4">
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
                        </div>
                    </div>
                )}
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                    {totalPrice > 0 ? `Pay OMR ${totalPrice.toFixed(2)} & Finalize` : `Complete Free Registration`}
                </Button>
            </form>
            </Form>
        </CardContent>
        </>
    );
  }


  const SubmittedScreen = () => {
    const [joiningDate, setJoiningDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setFullYear(today.getFullYear() + 1);
        setJoiningDate(today.toLocaleDateString());
        setExpiryDate(expiry.toLocaleDateString());
    }, []);

    const partnerName = inquiryForm.getValues('companyName') || inquiryForm.getValues('contactName');
    let crNumber;
    if (analysisResult && 'companyInfo' in analysisResult) {
        crNumber = analysisResult.companyInfo?.registrationNumber;
    }
    
    const classification = getClassification(allSelectedServices().length);

    return (
    <>
    <CardHeader className="text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Partnership Registration Complete!</CardTitle>
        <CardDescription>Thank you! You are now a registered partner. Below is your virtual membership card and legal agreements.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
        {recordNumber && (
            <Alert>
                <AlertTitle>Your Record Number</AlertTitle>
                <AlertDescription className="font-mono text-sm">{recordNumber}</AlertDescription>
            </Alert>
        )}

        <PartnershipCard 
            cardRef={cardRef}
            partnerName={partnerName}
            crNumber={crNumber}
            joiningDate={joiningDate}
            expiryDate={expiryDate}
            classification={classification}
            services={allSelectedServices().join(', ')}
            partnerType={applicantType === 'company' ? "Registered Company" : "Individual Freelancer"}
            logoUrl={logoDataUri}
        />
         <Button onClick={handleDownloadCard} variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Download Virtual Card</Button>

        <Tabs defaultValue="nda" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nda">Non-Disclosure Agreement</TabsTrigger>
                <TabsTrigger value="service">Service Agreement</TabsTrigger>
            </TabsList>
            <TabsContent value="nda">
                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-60 overflow-y-auto">
                    {agreement?.ndaContent}
                </div>
                <Button onClick={() => handleDownloadAgreement('nda')} variant="outline" className="w-full mt-2">
                    <Download className="mr-2 h-4 w-4" /> Download NDA
                </Button>
            </TabsContent>
            <TabsContent value="service">
                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-60 overflow-y-auto">
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
  )};
  
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
        case 'capture_id_front': return <CameraCapture title="Scan Front of ID Card" onCapture={onIdFrontCaptured} onCancel={() => setPageState('upload')} isFlipping={isFlipping} />;
        case 'capture_id_back': return <CameraCapture title="Scan Back of ID Card" onCapture={onIdBackCaptured} onCancel={() => setPageState('upload')} isFlipping={isFlipping} />;
        case 'capture_rep_id_front': return <CameraCapture title="Scan Representative's ID Front" onCapture={onRepIdFrontCaptured} onCancel={() => setPageState('upload')} isFlipping={isFlipping} />;
        case 'capture_rep_id_back': return <CameraCapture title="Scan Representative's ID Back" onRepIdBackCaptured} onCancel={() => setPageState('upload')} isFlipping={isFlipping} />;
        case 'capture_cr': return <CameraCapture title="Scan Commercial Record" onCapture={onCrCaptured} onCancel={() => setPageState('upload')} isFlipping={isFlipping} />;
        default: return <SelectionScreen />;
    }
  };

   const renderAnalysisResult = () => {
        if (!analysisResult) return null;
        
        if ('companyInfo' in analysisResult) { // It's a CrAnalysisOutput
            const info = analysisResult.companyInfo;
            return (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-semibold">Company Name:</div><div>{info?.companyNameEnglish || info?.companyNameArabic}</div>
                    <div className="font-semibold">CR Number:</div><div>{info?.registrationNumber}</div>
                    <div className="font-semibold">Status:</div><div>{info?.status}</div>
                    <div className="font-semibold">Legal Type:</div><div>{info?.legalType}</div>
                    <div className="font-semibold">Expiry Date:</div><div>{info?.expiryDate}</div>
                </div>
            )
        }

        if ('personalDetails' in analysisResult) { // It's an IdentityAnalysisOutput
             const { personalDetails: pd, idCardDetails: id } = analysisResult;
             return (
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-semibold">Full Name:</div><div>{pd?.fullName}</div>
                    <div className="font-semibold">Civil ID:</div><div>{id?.civilNumber}</div>
                    <div className="font-semibold">Nationality:</div><div>{pd?.nationality}</div>
                    <div className="font-semibold">Date of Birth:</div><div>{pd?.dateOfBirth}</div>
                </div>
             )
        }
        return null;
    }


  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Be Our Partner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our network of trusted freelancers, subcontractors, and service providers. Upload your documents to get started quickly with our AI-assisted onboarding.
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
