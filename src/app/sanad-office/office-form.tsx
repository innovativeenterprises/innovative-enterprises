
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, UploadCloud, Wand2, FileCheck2, Send, Handshake, Download, Building } from 'lucide-react';
import { analyzeCrDocument, type CrAnalysisOutput } from '@/ai/flows/cr-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { handleSanadOfficeRegistration } from '@/ai/flows/sanad-office-registration';
import type { SanadOfficeRegistrationInput } from '@/ai/flows/sanad-office-registration.schema';

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
  services: z.string().min(10, "Please list the key services you offer."),
  logoFile: z.any().optional(),
  serviceChargesFile: z.any().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function OfficeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CrAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      officeName: '',
      crNumber: '',
      contactName: '',
      email: '',
      phone: '',
      services: '',
    }
  });
  
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
      form.setValue('contactName', result.authorizedSignatories?.[0]?.name || '');
      form.setValue('services', result.commercialActivities?.map(a => a.activityName).join(', ') || '');
      toast({ title: 'Analysis Complete!', description: 'Office details have been pre-filled from the CR.' });
    } catch(e) {
      toast({ title: 'Analysis Failed', description: 'Could not analyze document. Please fill the form manually.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    
    let logoDataUri: string | undefined;
    if (data.logoFile && data.logoFile.length > 0) {
        logoDataUri = await fileToDataURI(data.logoFile[0]);
    }

    let serviceChargesDataUri: string | undefined;
     if (data.serviceChargesFile && data.serviceChargesFile.length > 0) {
        serviceChargesDataUri = await fileToDataURI(data.serviceChargesFile[0]);
    }
    
    const submissionData: SanadOfficeRegistrationInput = {
      officeName: data.officeName,
      crNumber: data.crNumber,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      services: data.services,
      logoDataUri,
      serviceChargesDataUri,
    };
    
    console.log("Submitting Sanad Office Registration:", submissionData);

    try {
        await handleSanadOfficeRegistration(submissionData);
        toast({
            title: "Registration Submitted!",
            description: "Thank you for your application. Our team will review it and be in touch shortly."
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
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Service Name,Official Fee (OMR),Our Service Charge (OMR)\n"
      + "New Commercial Registration (CR),50.00,15.00\n"
      + "CR Renewal,30.00,10.00\n"
      + "New Visa Application (Work),20.00,20.00\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sanad_service_charge_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    <Button onClick={() => { setIsSubmitted(false); form.reset(); setAnalysisResult(null); }}>Register Another Office</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: AI-Powered Onboarding</CardTitle>
            <CardDescription>Upload your Commercial Record (CR) and let our AI assist you with the form.</CardDescription>
          </CardHeader>
          <CardContent>
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
              <Alert className="mt-4">
                <FileCheck2 className="h-4 w-4" />
                <AlertTitle>Analysis Complete</AlertTitle>
                <AlertDescription>
                  Successfully extracted data for: <strong>{analysisResult.companyInfo.companyNameEnglish || analysisResult.companyInfo.companyNameArabic}</strong> (CR: {analysisResult.companyInfo.registrationNumber})
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Verify Office Details</CardTitle>
            <CardDescription>Please review the pre-filled information or enter your details manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="services" render={({ field }) => (
              <FormItem><FormLabel>Services Offered</FormLabel><FormControl><Textarea placeholder="List your key services, e.g., Visa Processing, CR Renewal, Bill Payments..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Step 3: Service Charges & Branding</CardTitle>
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Handshake className="mr-2 h-4 w-4"/> Submit Registration</>}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
