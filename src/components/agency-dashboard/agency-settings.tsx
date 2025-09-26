
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";
import type { BeautyCenter } from "@/lib/beauty-centers.schema";
import { Loader2, Save, Wand2 } from "lucide-react";
import Image from 'next/image';
import { analyzeCrDocument } from '@/ai/flows/cr-analysis';
import { fileToDataURI } from '@/lib/utils';
import { useAgenciesData, useBeautyCentersData } from '@/hooks/use-data-hooks';

type GenericAgency = RaahaAgency | BeautyCenter;

const AgencySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().min(5, "A valid phone number is required"),
  logoUrl: z.string().url().optional().or(z.literal('')),
  logoFile: z.any().optional(),
  crDocument: z.any().optional(),
});
type AgencyValues = z.infer<typeof AgencySchema>;

interface AgencySettingsProps<T extends GenericAgency> {
    agency: T;
    dashboardType: 'raaha' | 'beauty';
}

export function AgencySettings<T extends GenericAgency>({ agency, dashboardType }: AgencySettingsProps<T>) {
    const { setData: setRaahaAgencies } = useAgenciesData();
    const { setData: setBeautyCenters } = useBeautyCentersData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(agency.logo);

    const setAgencies = dashboardType === 'raaha' ? setRaahaAgencies : setBeautyCenters;

    const form = useForm<AgencyValues>({
        resolver: zodResolver(AgencySchema),
        defaultValues: {
            name: agency.name,
            description: agency.description,
            contactEmail: agency.contactEmail,
            contactPhone: agency.contactPhone,
            logoUrl: agency.logo,
        },
    });

    const watchLogoUrl = form.watch('logoUrl');
    const watchLogoFile = form.watch('logoFile');

    useEffect(() => {
        if (watchLogoFile && watchLogoFile.length > 0) {
            fileToDataURI(watchLogoFile[0]).then(setImagePreview);
        } else if (watchLogoUrl) {
            setImagePreview(watchLogoUrl);
        } else {
            setImagePreview(agency.logo);
        }
    }, [watchLogoUrl, watchLogoFile, agency.logo]);

    const handleCrAnalysis = async () => {
        const crFile = form.getValues('crDocument');
        if (!crFile || crFile.length === 0) {
            toast({ title: 'Please select a CR document first.', variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        try {
            const uri = await fileToDataURI(crFile[0]);
            const result = await analyzeCrDocument({ documentDataUri: uri });
            
            if (result.companyInfo?.companyNameEnglish) {
                form.setValue('name', result.companyInfo.companyNameEnglish);
            }
            if (result.summary) {
                form.setValue('description', result.summary);
            }
            if (result.companyInfo?.contactEmail) {
                form.setValue('contactEmail', result.companyInfo.contactEmail);
            }
            if (result.companyInfo?.contactMobile) {
                form.setValue('contactPhone', result.companyInfo.contactMobile);
            }
            toast({ title: "Analysis Complete", description: "Agency details have been pre-filled from your CR." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not analyze the document.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };


    const onSubmit: SubmitHandler<AgencyValues> = async (data) => {
        setIsLoading(true);
        let newLogoUrl = agency.logo;
        if (data.logoFile && data.logoFile.length > 0) {
            newLogoUrl = await fileToDataURI(data.logoFile[0]);
        } else if (data.logoUrl) {
            newLogoUrl = data.logoUrl;
        }

        setAgencies((prev: any[]) => prev.map(a =>
            a.id === agency.id ? { ...a, ...data, logo: newLogoUrl } : a
        ));
        
        toast({ title: "Agency Settings Updated", description: "Your agency profile has been saved." });
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Agency Profile & Branding</CardTitle>
                <CardDescription>Update your agency's public information and logo.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <Card className="bg-muted/50 p-4">
                            <FormField
                                control={form.control}
                                name="crDocument"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Onboarding Assistant</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl className="flex-1">
                                                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                                            </FormControl>
                                            <Button type="button" variant="secondary" onClick={handleCrAnalysis} disabled={isAnalyzing}>
                                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                Analyze CR & Pre-fill
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Card>
                        <div className="grid md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agency Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-4">
                                {imagePreview && (
                                    <Image src={imagePreview} alt="Logo Preview" width={64} height={64} className="rounded-md object-contain border p-1 bg-white" />
                                )}
                                <div className="space-y-2 flex-grow">
                                     <FormField
                                        control={form.control}
                                        name="logoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Logo URL</FormLabel>
                                                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="logoFile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Description</FormLabel>
                                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl><Input type="email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
