

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateDocument } from '@/ai/flows/document-translation';
import { type DocumentTranslationOutput } from '@/ai/flows/document-translation.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Download, Languages, FileCheck2, ShieldCheck, Stamp, FileText, AlignLeft, CreditCard, Users, Send, Bot } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Pricing } from '@/lib/pricing';
import type { AppSettings } from '@/lib/settings';
import { translationOffices } from '@/lib/offices';


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const documentTypeEnum = z.enum([
    // Legal
    'Certificates (Birth, Marriage, Death, etc.)',
    'Court Documents, Power of Attorney, Notarized Docs',
    'Complex Legal Contracts, Immigration Docs',
    // Medical
    'Prescriptions, Test Results, Basic Reports',
    'Patient Records, Discharge Summaries',
    'Clinical Trials, Research, Device Instructions',
    // Business
    'Company Licenses, Simple Agreements',
    'Financial Statements, Policies, MOUs',
    'Import/Export, Detailed Trading Contracts',
    // Educational
    'Certificates, Diplomas, Transcripts',
    'Recommendation Letters, Course Material',
    'Thesis, Dissertations, Research Papers',
    // Technical
    'User Manuals, Product Guides',
    'Patents, Engineering Specs, Safety Data Sheets',
    // Media & Marketing
    'Flyers, Brochures, Simple Ads',
    'Websites, Presentations, Proposals',
    'Branding, Creative Copy with Localization',
    // Financial & Trade
    'Bank Statements, Loan Forms, Insurance Policies',
    'Trading Contracts, Customs Declarations, Tax Reports',
    'Invoices',
    'Other',
]);

const FormSchema = z.object({
  documentFiles: z.any().refine(files => files?.length > 0, 'At least one document file is required.'),
  numberOfPages: z.coerce.number().min(1, "Please enter at least 1 page."),
  sourceLanguage: z.string().min(1, "Source language is required."),
  targetLanguage: z.string().min(1, "Target language is required."),
  documentType: documentTypeEnum,
  requestSealedCopy: z.boolean().default(false),
  assignedOffice: z.string().optional(),
  tenderOffices: z.array(z.string()).optional(),
});
type FormValues = z.infer<typeof FormSchema>;

const PaymentSchema = z.object({
    cardholderName: z.string().min(3, 'Cardholder name is required.'),
    cardNumber: z.string().length(19, 'Card number must be 16 digits.'), // 16 digits + 3 spaces
    expiryDate: z.string().length(5, 'Expiry date must be MM/YY.'),
    cvc: z.string().length(3, 'CVC must be 3 digits.'),
    coupon: z.string().optional(),
});
type PaymentValues = z.infer<typeof PaymentSchema>;


const languageOptions = [
    "English", "Arabic", "French", "Spanish", "German", "Chinese", "Russian", "Japanese", "Portuguese", "Italian"
];

const PRICE_PER_STAMPED_PAGE = 2.5;
const MINIMUM_CHARGE = 3.0;

type PageState = 'form' | 'payment' | 'translating' | 'result';

export default function TranslationForm({ pricing, settings }: { pricing: Pricing[], settings: AppSettings }) {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<DocumentTranslationOutput | null>(null);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const pricingMap = useMemo(() => {
      return pricing.reduce((acc, item) => {
          acc[item.type] = item.price;
          return acc;
      }, {} as Record<string, number>);
  }, [pricing]);

  const documentTypeGroups = useMemo(() => {
      return pricing.reduce((acc, item) => {
          if (!acc[item.group]) {
              acc[item.group] = [];
          }
          acc[item.group].push(item.type);
          return acc;
      }, {} as Record<string, string[]>);
  }, [pricing]);


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceLanguage: 'English',
      targetLanguage: 'Arabic',
      documentType: 'Complex Legal Contracts, Immigration Docs',
      requestSealedCopy: false,
      numberOfPages: 1,
      assignedOffice: '',
      tenderOffices: [],
    },
  });
  
  const paymentForm = useForm<PaymentValues>({ resolver: zodResolver(PaymentSchema) });

  const watchAllFields = form.watch();

  const pricePerPage = useMemo(() => {
    const { documentType } = watchAllFields;
    return pricingMap[documentType] || 0;
  }, [watchAllFields, pricingMap]);

  const subtotal = useMemo(() => {
      const { numberOfPages, requestSealedCopy } = watchAllFields;
      if (!pricePerPage || !numberOfPages || numberOfPages < 1) {
          return 0;
      }
      
      let total = pricePerPage * numberOfPages;

      if (requestSealedCopy) {
          total += PRICE_PER_STAMPED_PAGE * numberOfPages;
      }
      
      if (numberOfPages > 10) {
          total *= 0.9; // 10% discount
      }
      
      return Math.max(total, MINIMUM_CHARGE);

  }, [watchAllFields, pricePerPage]);

  const vatAmount = useMemo(() => {
    return settings.vat.enabled ? subtotal * settings.vat.rate : 0;
  }, [subtotal, settings.vat]);

  const [finalPrice, setFinalPrice] = useState(subtotal + vatAmount);
  
  useEffect(() => {
      setFinalPrice(subtotal + vatAmount);
  }, [subtotal, vatAmount]);


  const handleProceedToPayment: SubmitHandler<FormValues> = async (data) => {
    if (settings.translationAssignmentMode === 'tender' && (!data.tenderOffices || data.tenderOffices.length === 0)) {
        form.setError('tenderOffices', { type: 'manual', message: 'Please select at least one office for the tender.' });
        return;
    }
     if (settings.translationAssignmentMode === 'direct' && !data.assignedOffice) {
        form.setError('assignedOffice', { type: 'manual', message: 'Please select an office to assign the task to.' });
        return;
    }
    setSubmittedData(data);
    setPageState('payment');
  };
  
  const handleFinalSubmit: SubmitHandler<PaymentValues> = async (paymentData) => {
    if (!submittedData) return;
    
    setPageState('translating');
    console.log("Processing payment with details:", paymentData);
    if(finalPrice > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
        toast({ title: 'Payment Successful!', description: "Your payment has been processed."});
    }

    try {
      const file = submittedData.documentFiles[0];
      const documentDataUri = await fileToDataURI(file);

      // Log assignment/tender details
      if (settings.translationAssignmentMode === 'direct') {
          console.log(`Assigning task directly to: ${submittedData.assignedOffice}`);
      } else if (settings.translationAssignmentMode === 'tender') {
          console.log(`Sending tender to: ${submittedData.tenderOffices?.join(', ')}`);
      } else {
          console.log('Using built-in AI translator.');
      }

      const result = await translateDocument({
          documentDataUri,
          sourceLanguage: submittedData.sourceLanguage,
          targetLanguage: submittedData.targetLanguage,
          documentType: submittedData.documentType,
      });

      setResponse(result);
      setPageState('result');

      toast({
        title: 'Translation Complete!',
        description: 'Your document has been successfully translated.',
      });
      
      if (submittedData.documentFiles.length > 1) {
          const remainingFiles = Array.from(submittedData.documentFiles).slice(1);
          form.reset({
              ...form.getValues(),
              documentFiles: remainingFiles,
          });
          toast({
            title: 'Next file is ready',
            description: `${remainingFiles.length} file(s) remaining in your queue. Go back to the form to process the next one.`,
            duration: 9000,
          });
      } else {
        form.reset();
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to translate the document. Please try again.',
        variant: 'destructive',
      });
      setPageState('form');
    }
  };

  const handleDownload = (content: string) => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `translated-document.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Downloaded!', description: `Your translated document has been downloaded.`});
  };

  const handleCopy = (content: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: 'Translated content copied to clipboard.'});
  };

  const handleApplyCoupon = () => {
    const coupon = paymentForm.getValues('coupon')?.toUpperCase();
    if (!coupon) {
      toast({ title: 'Please enter a coupon code.', variant: 'destructive' });
      return;
    }
    // Dummy coupon logic
    if (coupon === 'FREE100') {
      setFinalPrice(0);
      toast({ title: 'Coupon Applied!', description: 'Your translation is now free.' });
    } else if (coupon === 'AGENT50') {
      setFinalPrice((subtotal + vatAmount) / 2);
      toast({ title: 'Coupon Applied!', description: 'You received a 50% discount.' });
    } else {
      toast({ title: 'Invalid Coupon', description: 'The entered coupon code is not valid.', variant: 'destructive' });
    }
  }
  
  const targetLanguage = form.watch("targetLanguage");

  const FormScreen = () => (
      <Card>
          <CardHeader>
            <CardTitle>Translate a Document</CardTitle>
            <CardDescription>Upload your document and specify the translation details. Your document is processed securely and is not stored.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleProceedToPayment)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="documentFiles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document(s) to Translate</FormLabel>
                          <FormControl>
                            <Input type="file" multiple accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                          </FormControl>
                           <FormDescription>You can select multiple files.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfPages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Pages</FormLabel>
                           <FormControl>
                            <Input type="number" min="1" {...field} />
                           </FormControl>
                            <FormDescription>Total pages for the current file.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type / Purpose</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.entries(documentTypeGroups).map(([group, types]) => (
                                <SelectGroup key={group}>
                                    <SelectLabel>{group}</SelectLabel>
                                    {types.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sourceLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requestSealedCopy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Request Certified Stamped Copy
                        </FormLabel>
                        <FormDescription>
                          An official, stamped document for legal use. Adds OMR {PRICE_PER_STAMPED_PAGE.toFixed(2)} per page.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Assignment / Tender Section */}
                {settings.translationAssignmentMode !== 'builtin' && (
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {settings.translationAssignmentMode === 'direct' ? "Direct Assignment" : "Send Tender to Partners"}
                            </CardTitle>
                            <CardDescription>
                                {settings.translationAssignmentMode === 'direct' 
                                    ? "Assign this translation task directly to a preferred office."
                                    : "Select one or more partner offices to send this translation job out to tender."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {settings.translationAssignmentMode === 'direct' ? (
                                <FormField
                                control={form.control}
                                name="assignedOffice"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Select Translation Office</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an office..." />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {translationOffices.map(office => {
                                            const stampCostText = watchAllFields.requestSealedCopy ? ` + OMR ${PRICE_PER_STAMPED_PAGE.toFixed(2)}/stamped` : '';
                                            const label = `${office} (OMR ${pricePerPage.toFixed(2)}/page${stampCostText})`;
                                            return (
                                                <SelectItem key={office} value={office}>{label}</SelectItem>
                                            )
                                        })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="tenderOffices"
                                    render={() => (
                                    <FormItem>
                                        <FormLabel>Select Partner Offices for Tender</FormLabel>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            {translationOffices.map((office) => (
                                                <FormField
                                                key={office}
                                                control={form.control}
                                                name="tenderOffices"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={office}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(office)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), office])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== office
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {office}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}


                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment ({finalPrice.toFixed(2)} OMR)
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
  );

  const PaymentScreen = () => (
     <Card>
      <CardHeader>
        <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setPageState('form')}>&larr; Back to Form</Button>
        <CardTitle className="text-center pt-8">Final Step: Complete Payment</CardTitle>
        <CardDescription className="text-center">Please confirm the payment to begin your translation.</CardDescription>
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
            <div className="p-4 rounded-md border bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>OMR {subtotal.toFixed(2)}</span>
                </div>
                 {settings.vat.enabled && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT ({settings.vat.rate * 100}%)</span>
                        <span>OMR {vatAmount.toFixed(2)}</span>
                    </div>
                 )}
                 <hr className="my-2 border-dashed" />
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-xl font-bold text-primary">OMR {finalPrice.toFixed(2)}</span>
                </div>
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
                {finalPrice > 0 ? `Pay OMR ${finalPrice.toFixed(2)} & Translate` : `Submit Free Translation`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const TranslatingScreen = () => (
    <Card>
        <CardContent className="p-10 text-center">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="space-y-2">
                    <CardTitle className="text-2xl">Translating Document...</CardTitle>
                    <CardDescription>Voxi is processing your document. This may take a moment.</CardDescription>
                </div>
            </div>
        </CardContent>
    </Card>
  );

  const ResultScreen = () => {
    let alertTitle: string;
    let alertDescription: string;
    
    switch (settings.translationAssignmentMode) {
        case 'direct':
            alertTitle = 'Task Assigned Directly';
            alertDescription = `This task has been assigned to ${submittedData?.assignedOffice}.`;
            break;
        case 'tender':
            alertTitle = 'Task Sent to Tender';
            alertDescription = `This task has been sent out for tender to ${submittedData?.tenderOffices?.length} partner(s).`;
            break;
        case 'builtin':
            alertTitle = 'Internal AI Translation';
            alertDescription = 'This task was handled by our internal, high-speed AI translation service.';
            break;
        default:
            alertTitle = 'Task Routed';
            alertDescription = 'The task has been routed for processing.'
    }

    const AlertIcon = settings.translationAssignmentMode === 'builtin' ? Bot : Send;

    return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileCheck2 /> Translation Complete</CardTitle>
            <CardDescription>Your document has been translated by Voxi. You can copy or download the results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {submittedData?.requestSealedCopy && (
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                <Stamp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle>Certified Stamped Document</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                Your certified, stamped digital copy is ready. For physical copies, please contact our support team.
                </AlertDescription>
            </Alert>
            )}

             <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                <AlertIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>{alertTitle}</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                    {alertDescription}
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="formatted" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="formatted"><FileText className="mr-2 h-4 w-4"/> Formatted Version</TabsTrigger>
                    <TabsTrigger value="clean"><AlignLeft className="mr-2 h-4 w-4"/> Clean Text Version</TabsTrigger>
                </TabsList>
                <TabsContent value="formatted">
                    <div 
                        className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto"
                        dir={targetLanguage === 'Arabic' ? 'rtl' : 'ltr'}
                    >
                        {response!.formattedTranslatedText}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(response!.formattedTranslatedText)}><Download className="mr-2 h-4 w-4"/> Download</Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(response!.formattedTranslatedText)}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                    </div>
                </TabsContent>
                <TabsContent value="clean">
                    <div 
                        className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto"
                        dir={targetLanguage === 'Arabic' ? 'rtl' : 'ltr'}
                    >
                        {response!.cleanTranslatedText}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(response!.cleanTranslatedText)}><Download className="mr-2 h-4 w-4"/> Download</Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(response!.cleanTranslatedText)}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                    </div>
                </TabsContent>
            </Tabs>
            
            <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Statement of Translation Accuracy</AlertTitle>
                <AlertDescription>
                {response!.verificationStatement}
                </AlertDescription>
            </Alert>

        </CardContent>
        <CardFooter>
            <Button onClick={() => setPageState('form')} className="w-full">Translate Another Document</Button>
        </CardFooter>
    </Card>
  )};

  const renderContent = () => {
    switch (pageState) {
      case 'form':
        return <FormScreen />;
      case 'payment':
        return <PaymentScreen />;
      case 'translating':
        return <TranslatingScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <FormScreen />;
    }
  };

  return <div className="space-y-8">{renderContent()}</div>;
}
