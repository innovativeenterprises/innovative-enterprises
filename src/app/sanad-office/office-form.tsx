
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, UploadCloud, Wand2, FileCheck2, Send, Handshake, Download, Building, CreditCard, Ticket, BadgePercent, Phone } from 'lucide-react';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { handleSanadOfficeRegistration } from '@/ai/flows/sanad-office-registration';
import type { SanadOfficeRegistrationInput } from '@/ai/flows/sanad-office-registration.schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useSettingsData } from '@/app/admin/settings-table';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  crDocument: z.any().optional(),
  officeName: z.string().min(3, "Office name is required"),
  crNumber: z.string().min(3, "CR number is required"),
  contactName: z.string().min(3, "Contact name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(5, "A valid phone number is required"),
  whatsapp: z.string().optional(),
  services: z.string().min(10, "Please list the key services you offer."),
  logoFile: z.any().optional(),
  serviceChargesFile: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

const PaymentSchema = z.object({
    subscriptionTier: z.enum(['monthly', 'yearly', 'lifetime']),
    coupon: z.string().optional(),
    cardholderName: z.string().min(3, 'Cardholder name is required.'),
    cardNumber: z.string().length(19, 'Card number must be 16 digits.'), // 16 digits + 3 spaces
    expiryDate: z.string().length(5, 'Expiry date must be MM/YY.'),
    cvc: z.string().length(3, 'CVC must be 3 digits.'),
});
type PaymentValues = z.infer<typeof PaymentSchema>;

type PageState = 'form' | 'payment' | 'submitting' | 'submitted';

export default function OfficeForm() {
  const { settings } = useSettingsData();
  const { sanadOffice: sanadSettings } = settings;
  
  const [pageState, setPageState] = useState<PageState>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      officeName: '',
      crNumber: '',
      contactName: '',
      email: '',
      phone: '',
      whatsapp: '',
      services: '',
    }
  });

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
        subscriptionTier: 'monthly',
        coupon: '',
    }
  });

  const watchSubscriptionTier = paymentForm.watch('subscriptionTier');
  const subtotal = useMemo(() => {
    let currentSubtotal = 0;
    if (watchSubscriptionTier === 'lifetime') {
        currentSubtotal = sanadSettings.lifetimeFee;
    } else {
        const subscriptionFee = watchSubscriptionTier === 'yearly' ? sanadSettings.yearlyFee : sanadSettings.monthlyFee;
        const discountedSubscription = subscriptionFee * (1 - sanadSettings.firstTimeDiscountPercentage);
        currentSubtotal = sanadSettings.registrationFee + discountedSubscription;
    }
    return currentSubtotal;
  }, [watchSubscriptionTier, sanadSettings]);

  useEffect(() => {
    setTotalPrice(subtotal);
  }, [subtotal]);
  
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
      form.setValue('officeName', result.companyInfo?.companyNameEnglish || result.companyInfo?.companyNameArabic || '');
      form.setValue('crNumber', result.companyInfo?.registrationNumber || '');
      form.setValue('email', result.companyInfo?.contactEmail || '');
      form.setValue('phone', result.companyInfo?.contactMobile || '');
      form.setValue('whatsapp', result.companyInfo?.contactMobile || '');
      form.setValue('contactName', result.authorizedSignatories?.[0]?.name || '');
      form.setValue('services', result.commercialActivities?.map(a => a.activityName).join(', ') || '');
      toast({ title: 'Analysis Complete!', description: 'Office details have been pre-filled from the CR.' });
    } catch(e) {
      toast({ title: 'Analysis Failed', description: 'Could not analyze document. Please fill the form manually.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Verified form data:", data);
    setPageState('payment');
  };

  const onPaymentSubmit: SubmitHandler<PaymentValues> = async (paymentData) => {
    setIsLoading(true);

    const officeData = form.getValues();
    
    let logoDataUri: string | undefined;
    if (officeData.logoFile && officeData.logoFile.length > 0) {
        logoDataUri = await fileToDataURI(officeData.logoFile[0]);
    }

    let serviceChargesDataUri: string | undefined;
     if (officeData.serviceChargesFile && officeData.serviceChargesFile.length > 0) {
        serviceChargesDataUri = await fileToDataURI(officeData.serviceChargesFile[0]);
    }
    
    const submissionData: SanadOfficeRegistrationInput = {
      officeName: officeData.officeName,
      crNumber: officeData.crNumber,
      contactName: officeData.contactName,
      email: officeData.email,
      phone: officeData.phone,
      services: officeData.services,
      logoDataUri,
      serviceChargesDataUri,
    };
    
    console.log("Submitting Sanad Office Registration:", submissionData);
    console.log("Payment Details:", paymentData);
    console.log("Total Price Paid:", totalPrice);
    
     await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing

    try {
        await handleSanadOfficeRegistration(submissionData);
        toast({
            title: "Registration Complete!",
            description: "Payment successful. Your application will be reviewed and you'll be notified upon approval."
        });
        setIsSubmitted(true);
    } catch (e) {
        console.error(e);
        toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleDownloadTemplate = () => {
    const headers = ["Service Name", "Official Fee (OMR)", "Our Service Charge (OMR)"];
    const allServices = Object.values(sanadServiceGroups).flat();
    
    let csvContent = headers.join(",") + "\n";
    csvContent += allServices.map(service => `"${service}",,`).join("\n");
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sanad_service_charge_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleApplyCoupon = () => {
    const coupon = paymentForm.getValues('coupon')?.toUpperCase();
    if (!coupon) {
      toast({ title: 'Please enter a coupon code.', variant: 'destructive' });
      return;
    }
    // Dummy coupon logic
    if (coupon === 'FREE100') {
      setTotalPrice(0);
      toast({ title: 'Coupon Applied!', description: 'Your registration is now free.' });
    } else if (coupon === 'AGENT50') {
      setTotalPrice(subtotal / 2);
      toast({ title: 'Coupon Applied!', description: 'You received a 50% discount.' });
    } else {
      toast({ title: 'Invalid Coupon', description: 'The entered coupon code is not valid.', variant: 'destructive' });
    }
  }


  if (isSubmitted) {
      return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Thank You for Registering!</CardTitle>
                        <CardDescription>
                            Your application to join the Sanad Hub Network has been received. Our partnership team will review your details and contact you within 2-3 business days to finalize your onboarding.
                        </CardDescription>
                    </div>
                    <Button onClick={() => { setIsSubmitted(false); setPageState('form'); form.reset(); setAnalysisResult(null); }}>Register Another Office</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <>
      {pageState === 'form' && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building className="h-6 w-6"/> Step 1: Office Details</CardTitle>
                        <CardDescription>Upload your Commercial Record (CR) and let our AI assist you with the form.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                Pre-fill Form
                                </Button>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {analysisResult && (
                        <Alert>
                            <FileCheck2 className="h-4 w-4" />
                            <AlertTitle>Analysis Complete</AlertTitle>
                            <AlertDescription>
                            Successfully extracted data for: <strong>{analysisResult.companyInfo.companyNameEnglish || analysisResult.companyInfo.companyNameArabic}</strong> (CR: {analysisResult.companyInfo.registrationNumber})
                            </AlertDescription>
                        </Alert>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="officeName" render={({ field }) => (
                                <FormItem><FormLabel>Sanad Office Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="crNumber" render={({ field }) => (
                                <FormItem><FormLabel>CR Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="contactName" render={({ field }) => (
                                <FormItem><FormLabel>Main Contact Person</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                                <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="+968 99123456" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="services" render={({ field }) => (
                        <FormItem><FormLabel>Services Offered</FormLabel><FormControl><Textarea placeholder="List your key services, e.g., Visa Processing, CR Renewal, Bill Payments..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Handshake className="h-6 w-6"/> Step 2: Branding & Pricing</CardTitle>
                        <CardDescription>Upload your list of service charges and your office logo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <FormLabel>Service Charge List</FormLabel>
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <Button type="button" variant="secondary" onClick={handleDownloadTemplate} className="w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" /> Download Template
                                </Button>
                                <FormField
                                    control={form.control}
                                    name="serviceChargesFile"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormControl>
                                            <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="logoFile"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Office Logo (Optional)</FormLabel>
                                <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><CreditCard className="mr-2 h-4 w-4"/> Proceed to Payment</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
      )}

      {pageState === 'payment' && (
        <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
                 <Card>
                    <CardHeader>
                        <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('form')}>&larr; Back</Button>
                        <CardTitle className="text-center pt-8 flex items-center justify-center gap-2"><CreditCard className="h-6 w-6"/> Step 3: Subscription & Payment</CardTitle>
                        <CardDescription className="text-center">Choose your plan and complete the payment to join the network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={paymentForm.control}
                            name="subscriptionTier"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Choose Your Subscription Plan</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                    <Label htmlFor="monthly" className={cn('flex flex-col rounded-lg border p-4 cursor-pointer hover:bg-accent/10 transition-colors', field.value === 'monthly' && 'border-primary ring-2 ring-primary')}>
                                        <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                                        <span className="font-bold text-lg">Monthly</span>
                                        <span className="text-2xl font-extrabold">OMR {sanadSettings.monthlyFee.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                                        <span className="text-xs text-muted-foreground mt-2">Billed every month.</span>
                                    </Label>
                                    <Label htmlFor="yearly" className={cn('flex flex-col rounded-lg border p-4 cursor-pointer hover:bg-accent/10 transition-colors', field.value === 'yearly' && 'border-primary ring-2 ring-primary')}>
                                        <RadioGroupItem value="yearly" id="yearly" className="sr-only" />
                                        <span className="font-bold text-lg">Yearly</span>
                                        <span className="text-2xl font-extrabold">OMR {sanadSettings.yearlyFee.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/year</span></span>
                                        <span className="text-xs text-muted-foreground mt-2">Save over 15%!</span>
                                    </Label>
                                    <Label htmlFor="lifetime" className={cn('flex flex-col rounded-lg border p-4 cursor-pointer hover:bg-accent/10 transition-colors', field.value === 'lifetime' && 'border-primary ring-2 ring-primary')}>
                                        <RadioGroupItem value="lifetime" id="lifetime" className="sr-only" />
                                        <span className="font-bold text-lg">Lifetime</span>
                                        <span className="text-2xl font-extrabold">OMR {sanadSettings.lifetimeFee.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/once</span></span>
                                        <span className="text-xs text-muted-foreground mt-2">One-time payment.</span>
                                    </Label>
                                    </RadioGroup>
                                </FormControl>
                                </FormItem>
                            )}
                            />

                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {watchSubscriptionTier !== 'lifetime' && <div className="flex justify-between"><span>One-time Registration Fee:</span><span>OMR {sanadSettings.registrationFee.toFixed(2)}</span></div>}
                                {watchSubscriptionTier === 'monthly' && <div className="flex justify-between"><span>Monthly Subscription:</span><span>OMR {sanadSettings.monthlyFee.toFixed(2)}</span></div>}
                                {watchSubscriptionTier === 'yearly' && <div className="flex justify-between"><span>Yearly Subscription:</span><span>OMR {sanadSettings.yearlyFee.toFixed(2)}</span></div>}
                                {watchSubscriptionTier !== 'lifetime' && <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold"><span>First-time Discount ({sanadSettings.firstTimeDiscountPercentage * 100}%):</span><span>- OMR {( (watchSubscriptionTier === 'yearly' ? sanadSettings.yearlyFee : sanadSettings.monthlyFee) * sanadSettings.firstTimeDiscountPercentage).toFixed(2)}</span></div>}
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
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</> : <>Pay OMR {totalPrice.toFixed(2)} & Complete Registration</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
      )}
    </>
  );
}
