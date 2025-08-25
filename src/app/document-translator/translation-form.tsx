
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateDocument } from '@/ai/flows/document-translation';
import { type DocumentTranslationOutput } from '@/ai/flows/document-translation.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Download, Languages, FileCheck2, ShieldCheck, Stamp, FileText, AlignLeft, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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
    'Other',
]);

const documentPricing: Record<z.infer<typeof documentTypeEnum>, number> = {
    // Legal
    'Certificates (Birth, Marriage, Death, etc.)': 4.0,
    'Court Documents, Power of Attorney, Notarized Docs': 6.0,
    'Complex Legal Contracts, Immigration Docs': 8.0,
    // Medical
    'Prescriptions, Test Results, Basic Reports': 4.0,
    'Patient Records, Discharge Summaries': 6.0,
    'Clinical Trials, Research, Device Instructions': 8.0,
    // Business
    'Company Licenses, Simple Agreements': 5.0,
    'Financial Statements, Policies, MOUs': 7.0,
    'Import/Export, Detailed Trading Contracts': 8.0,
    // Educational
    'Certificates, Diplomas, Transcripts': 4.0,
    'Recommendation Letters, Course Material': 5.0,
    'Thesis, Dissertations, Research Papers': 7.0,
    // Technical
    'User Manuals, Product Guides': 6.0,
    'Patents, Engineering Specs, Safety Data Sheets': 8.0,
    // Media & Marketing
    'Flyers, Brochures, Simple Ads': 4.0,
    'Websites, Presentations, Proposals': 6.0,
    'Branding, Creative Copy with Localization': 7.0,
    // Financial & Trade
    'Bank Statements, Loan Forms, Insurance Policies': 5.0,
    'Trading Contracts, Customs Declarations, Tax Reports': 7.0,
    // Other
    'Other': 5.0,
};

const documentTypeGroups = {
    "Legal & Official Documents": [
        "Certificates (Birth, Marriage, Death, etc.)",
        "Court Documents, Power of Attorney, Notarized Docs",
        "Complex Legal Contracts, Immigration Docs",
    ],
    "Medical & Healthcare Documents": [
        "Prescriptions, Test Results, Basic Reports",
        "Patient Records, Discharge Summaries",
        "Clinical Trials, Research, Device Instructions",
    ],
    "Business & Commercial Documents": [
        "Company Licenses, Simple Agreements",
        "Financial Statements, Policies, MOUs",
        "Import/Export, Detailed Trading Contracts",
    ],
    "Educational & Academic Documents": [
        "Certificates, Diplomas, Transcripts",
        "Recommendation Letters, Course Material",
        "Thesis, Dissertations, Research Papers",
    ],
    "Technical & Industrial Documents": [
        "User Manuals, Product Guides",
        "Patents, Engineering Specs, Safety Data Sheets",
    ],
    "Media & Marketing Documents": [
        "Flyers, Brochures, Simple Ads",
        "Websites, Presentations, Proposals",
        "Branding, Creative Copy with Localization",
    ],
    "Financial & Trade Documents": [
        "Bank Statements, Loan Forms, Insurance Policies",
        "Trading Contracts, Customs Declarations, Tax Reports",
    ],
};


const FormSchema = z.object({
  documentFiles: z.any().refine(files => files?.length > 0, 'At least one document file is required.'),
  numberOfPages: z.coerce.number().min(1, "Please enter at least 1 page."),
  sourceLanguage: z.string().min(1, "Source language is required."),
  targetLanguage: z.string().min(1, "Target language is required."),
  documentType: documentTypeEnum,
  requestSealedCopy: z.boolean().default(false),
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

export default function TranslationForm() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<DocumentTranslationOutput | null>(null);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sourceLanguage: 'English',
      targetLanguage: 'Arabic',
      documentType: 'Complex Legal Contracts, Immigration Docs',
      requestSealedCopy: false,
      numberOfPages: 1,
    },
  });
  
  const paymentForm = useForm<PaymentValues>({ resolver: zodResolver(PaymentSchema) });

  const watchAllFields = form.watch();

  const basePrice = useMemo(() => {
      const { documentType, numberOfPages, requestSealedCopy } = watchAllFields;
      if (!documentType || !numberOfPages || numberOfPages < 1) {
          return 0;
      }
      const pricePerPage = documentPricing[documentType];
      let total = pricePerPage * numberOfPages;

      if (requestSealedCopy) {
          total += PRICE_PER_STAMPED_PAGE * numberOfPages;
      }
      
      if (numberOfPages > 10) {
          total *= 0.9; // 10% discount
      }
      
      return Math.max(total, MINIMUM_CHARGE);

  }, [watchAllFields]);

  const [finalPrice, setFinalPrice] = useState(basePrice);
  
  useEffect(() => {
      setFinalPrice(basePrice);
  }, [basePrice]);


  const handleProceedToPayment: SubmitHandler<FormValues> = async (data) => {
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
          form.setValue('documentFiles', remainingFiles);
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
      setFinalPrice(basePrice / 2);
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
                          <FormLabel>Document to Translate</FormLabel>
                          <FormControl>
                            <Input type="file" multiple accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                          </FormControl>
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
                            <SelectGroup>
                                <SelectLabel>Other</SelectLabel>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectGroup>
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
            <div className="mb-6 p-4 rounded-md border bg-muted/50 flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
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

  const ResultScreen = () => (
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
  );

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
