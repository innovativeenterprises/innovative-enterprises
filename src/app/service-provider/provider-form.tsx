
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
import { Loader2, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { handlePartnershipInquiry } from '@/ai/flows/partnership-inquiry';
import type { PartnershipInquiryInput } from '@/ai/flows/partnership-inquiry.schema';
import { PartnershipInquiryInputSchema } from '@/ai/flows/partnership-inquiry.schema';

export default function ProviderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnershipInquiryInput>({
    resolver: zodResolver(PartnershipInquiryInputSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      partnershipDetails: '',
      undertaking: false,
    },
  });

  const onSubmit: SubmitHandler<PartnershipInquiryInput> = async (data) => {
    setIsLoading(true);
    try {
      const result = await handlePartnershipInquiry(data);
      toast({
        title: "Inquiry Submitted!",
        description: result.confirmationMessage,
      });
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
      return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Thank You!</CardTitle>
                <CardDescription>Your partnership inquiry has been submitted successfully. Our team will review it and get back to you shortly.</CardDescription>
            </CardHeader>
        </Card>
      );
  }

  return (
    <Card>
        <CardHeader>
          <CardTitle>Join Our Network</CardTitle>
          <CardDescription>Fill out the form below to apply as a service provider.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem><FormLabel>Company / Your Name</FormLabel><FormControl><Input placeholder="Your Company Inc. / John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contactName" render={({ field }) => (
                        <FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="partnershipDetails" render={({ field }) => (
                        <FormItem><FormLabel>Services Offered / Partnership Details</FormLabel><FormControl><Textarea placeholder="Briefly describe your services (e.g., 'React development, UI/UX design') and how you'd like to partner with us." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                        control={form.control}
                        name="undertaking"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Undertaking</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    I confirm that I have the authority to submit this application and that the information provided is accurate.
                                </p>
                                <FormMessage />
                            </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit Inquiry"
                    )}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
