
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { generateLetterOfInterest } from '@/ai/flows/letter-of-interest';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import CompanyProfileDownloader from '@/app/invest/company-profile-downloader';
import { useProductsData, useStaffData, useServicesData, useSettingsData } from '@/hooks/use-data-hooks.tsx';

const FormSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  organizationName: z.string().optional(),
  investorType: z.string().min(1, "Please select an investor type."),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  investmentRange: z.string().optional(),
  areaOfInterest: z.string().min(10, "Please describe your area of interest."),
});

type FormValues = z.infer<typeof FormSchema>;

export default function InvestPage() {
    const { data: staffData } = useStaffData();
    const { data: services } = useServicesData();
    const { data: settings } = useSettingsData();
    const { data: products } = useProductsData();

  const [isLoading, setIsLoading] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setLetterContent(null);
    try {
      const result = await generateLetterOfInterest(data);
      setLetterContent(result.letterContent);
      toast({
        title: 'Thank You for Your Interest!',
        description: 'We have generated a formal letter of interest for your records.',
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

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Invest With Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us on our journey to revolutionize the business landscape in Oman and beyond. We are seeking strategic partners and investors to fuel our growth and expand our portfolio of innovative AI-driven products.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12 grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Register Your Interest</CardTitle>
                    <CardDescription>
                        Complete the form below to receive a formal Letter of Interest and begin the conversation. For a comprehensive overview of our company, you can also download our dynamic company profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CompanyProfileDownloader 
                        staffData={staffData} 
                        services={services} 
                        settings={settings!}
                        products={products}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Investor Inquiry Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name / Contact Person</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={form.control} name="organizationName" render={({ field }) => (<FormItem><FormLabel>Organization (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)}/>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="investorType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Investor Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select your investor type..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Angel Investor">Angel Investor</SelectItem>
                                        <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                                        <SelectItem value="Corporate Venture">Corporate Venture</SelectItem>
                                        <SelectItem value="Government Fund">Government Fund</SelectItem>
                                        <SelectItem value="Private Equity">Private Equity</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., Oman" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                        </div>
                        <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                         <FormField control={form.control} name="investmentRange" render={({ field }) => (<FormItem><FormLabel>Anticipated Investment Range (Optional)</FormLabel><FormControl><Input placeholder="e.g., OMR 50k - 200k" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="areaOfInterest" render={({ field }) => (
                            <FormItem><FormLabel>Primary Area of Interest</FormLabel><FormControl><Textarea placeholder="Tell us which of our products, services, or industries you are most interested in." rows={4} {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Letter...</>
                            ) : (
                            <><Send className="mr-2 h-4 w-4" /> Submit Inquiry & Generate Letter</>
                            )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            {letterContent && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Generated Letter of Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap">
                            {letterContent}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
