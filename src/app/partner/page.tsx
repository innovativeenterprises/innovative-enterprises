
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { handlePartnershipInquiry, PartnershipInquiryInputSchema, type PartnershipInquiryInput, type PartnershipInquiryOutput } from '@/ai/flows/partnership-inquiry';
import { Loader2, CheckCircle, Handshake } from 'lucide-react';
import Link from 'next/link';

export default function PartnerPage() {
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
    },
  });

  const onSubmit: SubmitHandler<PartnershipInquiryInput> = async (data) => {
    setIsLoading(true);
    try {
      const result = await handlePartnershipInquiry(data);
      setIsSubmitted(true);
      toast({
        title: 'Inquiry Submitted!',
        description: result.confirmationMessage,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
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
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Be Our Partner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us in a strategic partnership to drive mutual growth and success. We are looking for partners who share our vision for innovation and excellence.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            {isSubmitted ? (
                 <Card>
                    <CardContent className="p-10 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">Thank You for Your Interest!</CardTitle>
                                <CardDescription>
                                    Your partnership inquiry has been received. Our partnership agent, Paz, will review your information and get in touch to discuss potential collaboration.
                                </CardDescription>
                            </div>
                            <Button asChild onClick={() => {
                                setIsSubmitted(false);
                                form.reset();
                            }}>
                                <Link href="#">Submit Another Inquiry</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Partnership Inquiry</CardTitle>
                        <CardDescription>Fill out the form below to start the conversation. Your inquiry will be sent to Paz, our Partnership Agent.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Company Inc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
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
                                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="partnershipDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tell us about your company and why you'd like to partner with us.</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your company's mission, strengths, and how you envision a partnership with us." rows={6} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                                     {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Handshake className="mr-2 h-4 w-4" /> Submit Inquiry</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
