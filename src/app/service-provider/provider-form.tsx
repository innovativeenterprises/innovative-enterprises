
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Handshake } from 'lucide-react';
import Link from 'next/link';
import type { Provider } from '@/lib/providers';

const FormSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  services: z.string().min(10, 'Please describe your services.'),
  portfolio: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  details: z.string().min(20, 'Please provide some details about your experience.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ProviderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      services: '',
      portfolio: '',
      details: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    
    // Simulate API call to submit the form data
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);

    toast({
        title: 'Application Submitted!',
        description: "We've sent your details to Paz, our Partnership Agent.",
    });
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
            <div className="flex flex-col items-center gap-6">
                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-2xl">Thank You for Your Application!</CardTitle>
                    <CardDescription>
                        Your submission has been received. Our partnership agent, Paz, will review your information and get in touch if there's a good fit. You can explore more about our AI agents while you wait.
                    </CardDescription>
                </div>
                <Button asChild>
                    <Link href="/automation">Explore Our AI Agents</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Service Provider & Freelancer Application</CardTitle>
            <CardDescription>Tell us about your expertise.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name or Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe or Creative Solutions LLC" {...field} />
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
                                        <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service(s) Offered</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Web Development, Graphic Design, Copywriting" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="portfolio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Portfolio Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., https://behance.net/johndoe" {...field} />
                                </FormControl>
                                 <FormDescription>
                                    Link to your Behance, Dribbble, GitHub, or personal website.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Briefly Describe Your Experience</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us about your skills, past projects, and what makes you a great partner." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                        ) : (
                           <>
                                <Handshake className="mr-2 h-4 w-4" /> Submit Application
                           </>
                        )}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
