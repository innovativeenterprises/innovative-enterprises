
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
import { Loader2, Send, Download, FileText, Presentation } from 'lucide-react';
import CompanyProfileDownloader from '@/app/invest/company-profile-downloader';
import { useProductsData, useStaffData, useServicesData, useSettingsData } from '@/hooks/use-data-hooks';
import type { Product } from '@/lib/products.schema';
import { generateFeasibilityStudy } from '@/ai/flows/feasibility-study';
import Image from 'next/image';
import { StageBadge } from '@/components/stage-badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Link from "next/link";
import { useRouter } from 'next/navigation';


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

const ProjectCard = ({ project }: { project: Product }) => {
    const { toast } = useToast();

    const handleGenerateFeasibilityStudy = async () => {
        toast({ title: 'Generating Feasibility Study...', description: 'Please wait while Sage analyzes the project.' });
        try {
            const study = await generateFeasibilityStudy({ businessIdea: project.description });
            // For this prototype, we'll generate a simple PDF on the fly.
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(study.title, 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            const summaryText = doc.splitTextToSize(`Executive Summary: ${study.executiveSummary}`, 180);
            doc.text(summaryText, 14, 32);
            // In a real app, you would format the full study.
            doc.save(`${project.name}_Feasibility_Study.pdf`);
            toast({ title: 'Feasibility Study Generated!', description: 'Your PDF download should begin shortly.' });
        } catch (e) {
            toast({ title: 'Error', description: 'Could not generate feasibility study.', variant: 'destructive'});
        }
    }
    
    // Placeholder functions for other documents
    const handleGeneratePitchDeck = (format: 'PDF' | 'PPT') => {
        toast({ title: `Generating ${format} Pitch Deck...`, description: `This feature is coming soon for ${project.name}.` });
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="relative aspect-video w-full rounded-md overflow-hidden">
                    <Image src={project.image || 'https://placehold.co/600x400'} alt={project.name} fill className="object-cover" />
                     {project.stage && <StageBadge stage={project.stage} />}
                </div>
                <CardTitle className="pt-4">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <p className="text-xs text-muted-foreground">Category: <span className="font-semibold">{project.category}</span></p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <div>
                    <h4 className="text-sm font-semibold mb-2">Investor Documents</h4>
                    <div className="flex flex-wrap gap-2">
                         <Button onClick={() => handleGeneratePitchDeck('PDF')} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Pitch Deck (PDF)</Button>
                         <Button onClick={() => handleGeneratePitchDeck('PPT')} variant="outline" size="sm"><Presentation className="mr-2 h-4 w-4"/> Pitch Deck (PPT)</Button>
                         <Button onClick={handleGenerateFeasibilityStudy} variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/> Feasibility Study</Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};


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
    defaultValues: {
      fullName: '',
      organizationName: '',
      investorType: '',
      country: '',
      website: '',
      investmentRange: '',
      areaOfInterest: '',
    },
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
  
  const investableProducts = (products || []).filter(p => p.stage !== 'Live & Operating');

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Invest With Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us on our journey to revolutionize the business landscape in Oman and beyond. We are seeking strategic partners and investors to fuel our growth and expand our portfolio of innovative AI-driven products.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 grid gap-8">
            
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Investment Opportunities</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {investableProducts.map(product => (
                        <ProjectCard key={product.id} project={product} />
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                 <h2 className="text-3xl font-bold text-center pt-8 border-t">General Inquiry</h2>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                     <Card>
                        <CardHeader>
                            <CardTitle>Register Your Interest</CardTitle>
                            <CardDescription>
                                Complete the form to receive a formal Letter of Interest. For a comprehensive overview, download our dynamic company profile.
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
                                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name / Contact Person</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)}/>
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
                                                <SelectItem value="Donation">Donation</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                <FormField control={form.control} name="areaOfInterest" render={({ field }) => (
                                    <FormItem><FormLabel>Primary Area of Interest</FormLabel><FormControl><Textarea placeholder="Tell us which industries or technologies you are most interested in." rows={4} {...field} /></FormControl><FormMessage/></FormItem>
                                )}/>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                    ) : (
                                    <><Send className="mr-2 h-4 w-4" /> Submit Inquiry & Generate Letter</>
                                    )}
                                </Button>
                            </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
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
