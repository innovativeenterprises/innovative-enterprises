
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
import type { Agency } from "@/lib/raaha-agencies";
import { store } from "@/lib/global-store";
import { Loader2, Save } from "lucide-react";
import Image from 'next/image';

export const useAgenciesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        agencies: data.raahaAgencies,
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            const currentAgencies = store.get().raahaAgencies;
            const newAgencies = updater(currentAgencies);
            store.set(state => ({ ...state, raahaAgencies: newAgencies }));
        }
    };
};

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const AgencySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().min(5, "A valid phone number is required"),
  logoUrl: z.string().url().optional().or(z.literal('')),
  logoFile: z.any().optional(),
});
type AgencyValues = z.infer<typeof AgencySchema>;

export function AgencySettings({ agency, setAgencies }: { agency: Agency; setAgencies: (updater: (agencies: Agency[]) => void) => void }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(agency.logo);

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

    const onSubmit: SubmitHandler<AgencyValues> = async (data) => {
        setIsLoading(true);
        let newLogoUrl = agency.logo;
        if (data.logoFile && data.logoFile.length > 0) {
            newLogoUrl = await fileToDataURI(data.logoFile[0]);
        } else if (data.logoUrl) {
            newLogoUrl = data.logoUrl;
        }

        setAgencies(prev => prev.map(a =>
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
