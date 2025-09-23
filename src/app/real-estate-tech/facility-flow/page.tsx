
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle, Wrench } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProvidersData } from '@/hooks/use-global-store-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FacilityFlow SaaS | Innovative Enterprises",
  description: "A streamlined platform for tenants to raise service tickets. Our system uses AI to automatically assign the issue to the best-qualified vendor.",
};


const TicketSchema = z.object({
  propertyAddress: z.string().min(5, "Property address is required."),
  issueCategory: z.enum(['Plumbing', 'Electrical', 'AC & Cooling', 'General Maintenance', 'Other']),
  issueDescription: z.string().min(10, "Please describe the issue in detail."),
  contactName: z.string().min(3, "Contact name is required."),
  contactPhone: z.string().min(8, "A valid phone number is required."),
  urgency: z.enum(['Low', 'Medium', 'High', 'Emergency']),
});
type TicketValues = z.infer<typeof TicketSchema>;


export default function FacilityFlowPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [assignedVendor, setAssignedVendor] = useState<string | null>(null);
    const { toast } = useToast();
    const { data: providers } = useProvidersData();

    const form = useForm<TicketValues>({
        resolver: zodResolver(TicketSchema),
        defaultValues: {
            issueCategory: 'General Maintenance',
            urgency: 'Medium',
        },
    });

    const findBestVendor = (category: string): string => {
        // Simple AI simulation: find a vetted provider whose services match the category
        const searchTerms = category.toLowerCase().split('&').map(s => s.trim());
        const potentialVendors = providers.filter(p => 
            p.status === 'Vetted' && 
            searchTerms.some(term => p.services.toLowerCase().includes(term))
        );
        return potentialVendors.length > 0 ? potentialVendors[0].name : "General Maintenance Team";
    };

    const onSubmit: SubmitHandler<TicketValues> = async (data) => {
        setIsLoading(true);
        setIsSubmitted(false);
        setAssignedVendor(null);

        // Simulate AI analysis and assignment
        await new Promise(resolve => setTimeout(resolve, 1500));
        const vendor = findBestVendor(data.issueCategory);
        setAssignedVendor(vendor);

        console.log("Service Ticket Submitted:", { ...data, assignedTo: vendor });

        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: "Service Ticket Submitted!", description: "Your maintenance request has been received and assigned." });
    };

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto mt-12">
                 <Card>
                    <CardContent className="p-10 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">Ticket Submitted Successfully!</CardTitle>
                                <CardDescription>
                                    Your service request for "{form.getValues('propertyAddress')}" has been assigned to:
                                    <br/>
                                    <strong className="text-primary">{assignedVendor}</strong>
                                    <br/>
                                    They will contact you shortly at {form.getValues('contactPhone')} to schedule the service.
                                </CardDescription>
                            </div>
                            <Button onClick={() => { setIsSubmitted(false); form.reset(); }}>Submit Another Ticket</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Wrench className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">FacilityFlow SaaS</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A streamlined platform for tenants to raise service tickets. Our system uses AI to automatically assign the issue to the best-qualified vendor, ensuring a fast and effective resolution.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Submit a New Service Ticket</CardTitle>
                    <CardDescription>Please provide the details of the maintenance issue below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                                <FormItem><FormLabel>Property Address / Unit Number</FormLabel><FormControl><Input placeholder="e.g., Villa 12, Al Mouj" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="issueCategory" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Issue Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                                        <SelectItem value="Electrical">Electrical</SelectItem>
                                        <SelectItem value="AC & Cooling">AC & Cooling</SelectItem>
                                        <SelectItem value="General Maintenance">General Maintenance</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="issueDescription" render={({ field }) => (
                                <FormItem><FormLabel>Description of Issue</FormLabel><FormControl><Textarea placeholder="Please be as specific as possible. e.g., 'The kitchen sink is leaking under the cabinet.'" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="contactName" render={({ field }) => (
                                    <FormItem><FormLabel>Contact Person Name</FormLabel><FormControl><Input placeholder="e.g., John Smith" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="contactPhone" render={({ field }) => (
                                    <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input placeholder="+968 99123456" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="urgency" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Urgency Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select the urgency level..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Low">Low - (Can be scheduled next week)</SelectItem>
                                        <SelectItem value="Medium">Medium - (Requires attention within 48 hours)</SelectItem>
                                        <SelectItem value="High">High - (Requires attention within 24 hours)</SelectItem>
                                        <SelectItem value="Emergency">Emergency - (Requires immediate attention)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                             <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Submitting Ticket...</> : <><Send className="mr-2 h-4 w-4"/> Submit Service Ticket</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
