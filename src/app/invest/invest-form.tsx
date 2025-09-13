'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateLetterOfInterest } from '@/ai/flows/letter-of-interest';
import { type GenerateLetterOfInterestOutput } from '@/ai/flows/letter-of-interest.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Mail, Download, Briefcase, Calendar, CheckCircle, Bot, FileUp, ShieldCheck, Phone, ArrowLeft, Star, Mic } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  organizationName: z.string().optional(),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  investorType: z.enum(['Angel', 'Venture Capital', 'Corporate', 'Individual', 'Other']).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  investmentRange: z.string().optional(),
  areaOfInterest: z.string().min(10, 'Please describe your area of interest.'),
});

type FormValues = z.infer<typeof FormSchema>;

const kycSchema = z.object({
    identityDocument: z.any().refine(file => file?.length == 1, 'Identity document is required.'),
    incomeProof: z.any().refine(file => file?.length == 1, 'Proof of income is required.'),
});
type KycValues = z.infer<typeof kycSchema>;


export default function InvestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [response, setResponse] = useState<GenerateLetterOfInterestOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      organizationName: '',
      email: '',
      phone: '',
      whatsapp: '',
      country: '',
      investorType: undefined,
      website: '',
      investmentRange: '',
      areaOfInterest: '',
    },
  });

  const kycForm = useForm<KycValues>({
    resolver: zodResolver(kycSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    setIsSynced(false);
    setIsSyncing(false);
    setIsUploaded(false);
    setIsUploading(false);
    try {
      const result = await generateLetterOfInterest(data);
      setResponse(result);
      toast({
        title: 'Letter of Interest Generated!',
        description: 'Thank you for your inquiry. Please see the generated letter below.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.letterContent);
    toast({ title: 'Copied!', description: 'Letter content copied to clipboard.'});
  };

  const handleDownload = () => {
    if (!response) return;
    const element = document.createElement("a");
    const file = new Blob([response.letterContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Letter-of-Interest-INNOVATIVE-ENTERPRISES.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Downloaded!', description: `Your Letter of Interest has been downloaded.`});
  };

  const handleEmail = () => {
    if (!response) return;
    const subject = "Following up on my interest in INNOVATIVE ENTERPRISES";
    const body = encodeURIComponent("Dear INNOVATIVE ENTERPRISES Team,\n\nPlease find the automatically generated Letter of Interest based on my recent inquiry. I look forward to discussing potential investment opportunities.\n\n---\n\n" + response.letterContent);
    window.location.href = `mailto:invest@innovative.om?subject=${subject}&body=${body}`;
    toast({
        title: 'Forwarded to Sales Agent',
        description: 'Your inquiry has been sent to Sami for follow-up.',
    });
  };
  
  const handleSyncToCrm = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
        setIsSyncing(false);
        setIsSynced(true);
        toast({
            title: 'Successfully Synced!',
            description: 'Investor details sent to Remi (CRM Agent).',
        });
    }, 1500);
  }

  const handleKycSubmit: SubmitHandler<KycValues> = async (data) => {
    setIsUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Uploaded KYC Documents:", data);
    setIsUploading(false);
    setIsUploaded(true);
    toast({
        title: 'Documents Securely Uploaded!',
        description: 'Your documents have been forwarded to Lexi (Legal Agent) for pre-verification.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
        {!response ? (
            <Card>
                <CardHeader>
                <CardTitle>Investor Relations Inquiry</CardTitle>
                <CardDescription>Please fill out the form to get in touch with our investment team. An AI-generated Letter of Interest will be created based on your input.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., +968 99123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Oman" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="organizationName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Future Ventures Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website / LinkedIn (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="investorType"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Investor Type (Optional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select investor type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Individual">Individual</SelectItem>
                                                <SelectItem value="Angel">Angel Investor</SelectItem>
                                                <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="investmentRange"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Investment Range (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., $50,000 - $100,000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="areaOfInterest"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Area of Interest</FormLabel>
                                    <FormControl>
                                        <VoiceEnabledTextarea placeholder="Please provide a brief introduction and your area of interest (e.g., 'Interested in early-stage AI projects and cybersecurity ventures')." rows={6} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Submit Inquiry & Generate Letter</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle>Your Generated Letter of Interest</CardTitle>
                    <CardDescription>
                        Thank you for your interest. Here is the letter generated by our AI. You can copy, download, or email it. Our team will be in touch shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                        {response.letterContent}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 items-start">
                    <div className="space-y-4 w-full">
                        <p className="text-sm text-muted-foreground">Next Steps:</p>
                        <div className="flex justify-between items-center w-full">
                            <Button variant="outline" onClick={handleSyncToCrm} disabled={isSyncing || isSynced}>
                                {isSyncing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
                                ) : isSynced ? (
                                    <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Synced to CRM</>
                                ) : (
                                    <><Briefcase className="mr-2 h-4 w-4"/> Sync to CRM (Remi)</>
                                )}
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                                <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                                <Button onClick={handleEmail}><Mail className="mr-2 h-4 w-4"/> Email to Us (Sami)</Button>
                            </div>
                        </div>
                        {isSynced && (
                            <Card className="w-full bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5"/> Schedule a Meeting</CardTitle>
                                    <CardDescription>Aida, our assistant agent, can help you book a meeting with our team.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row gap-4">
                                <Button className="w-full" asChild><a href="https://calendly.com" target="_blank" rel="noopener noreferrer">Book via Calendly</a></Button>
                                <Button className="w-full" variant="outline" asChild><a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">Book via Google Calendar</a></Button>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Card className="w-full bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileUp className="h-5 w-5" /> Optional: Expedite Your Application
                                </CardTitle>
                                <CardDescription>
                                    To speed up the due diligence process, you can optionally upload verification documents now.
                                </CardDescription>
                            </CardHeader>
                             {!isUploaded ? (
                            <CardContent>
                                <Form {...kycForm}>
                                    <form onSubmit={kycForm.handleSubmit(handleKycSubmit)} className="space-y-4">
                                        <FormField
                                            control={kycForm.control}
                                            name="identityDocument"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Commercial Registration (CR) or Passport</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={kycForm.control}
                                            name="incomeProof"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Proof of Income Source</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Alert variant="default" className="mt-4">
                                            <ShieldCheck className="h-4 w-4"/>
                                            <AlertTitle>Secure Upload</AlertTitle>
                                            <AlertDescription>
                                                Your documents are encrypted and will be handled with strict confidentiality by our legal team for verification purposes only.
                                            </AlertDescription>
                                        </Alert>
                                        <Button type="submit" className="w-full" disabled={isUploading}>
                                            {isUploading ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Securely Uploading...</>
                                            ) : (
                                                <><FileUp className="mr-2 h-4 w-4" /> Upload Documents (to Lexi)</>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                            ) : (
                               <CardContent>
                                    <div className="flex items-center justify-center p-6 bg-green-100 dark:bg-green-900/50 rounded-md">
                                        <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                                        <div>
                                            <p className="font-semibold text-green-800 dark:text-green-200">Documents Submitted Successfully!</p>
                                            <p className="text-sm text-green-700 dark:text-green-300">Our legal agent, Lexi, will begin the pre-verification process.</p>
                                        </div>
                                    </div>
                               </CardContent>
                            )}
                        </Card>
                    </div>
                </CardFooter>
            </Card>
        )}

        {isLoading && !response && (
            <Card className="mt-8">
                <CardContent className="p-6 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Our AI is drafting your Letter of Interest...</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
