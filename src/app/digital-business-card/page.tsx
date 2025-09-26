
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Contact } from 'lucide-react';
import Image from 'next/image';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import { generateBusinessCard } from '@/ai/flows/digital-business-card-generator';
import type { BusinessCardOutput } from '@/ai/flows/digital-business-card-generator';

const FormSchema = z.object({
  name: z.string().min(3, "Name is required."),
  title: z.string().min(3, "Title is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(8, "A valid phone number is required."),
  styleAndImagery: z.string().min(10, "Please describe the desired style and imagery."),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DigitalBusinessCardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BusinessCardOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "Jumaa Salim Al Hadidi",
      title: "CEO & Co-Founder",
      email: "jumaa.hadidi@innovative.om",
      phone: "+968 78492280",
      styleAndImagery: "A professional, minimalist design with a dark blue background, gold text, and a subtle geometric pattern.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: "Generating Business Card...", description: "This may take a moment. Please wait." });
    try {
      const result = await generateBusinessCard(data);
      setResponse(result);
      toast({ title: "Business Card Generated!", description: "Your new digital business card is ready." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the business card. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!response?.cardImageUrl) return;
    const link = document.createElement('a');
    link.href = response.cardImageUrl;
    link.download = 'digital-business-card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The business card image has been downloaded." });
  };

  return (
    <div className="space-y-8">
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Contact className="h-6 w-6 text-primary"/> AI Digital Business Card Generator</CardTitle>
              <CardDescription>Create a unique and professional digital business card in seconds.</CardDescription>
          </CardHeader>
          <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="title" render={({ field }) => (
                          <FormItem><FormLabel>Title / Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                  </div>
                  <FormField control={form.control} name="styleAndImagery" render={({ field }) => (
                      <FormItem><FormLabel>Desired Style & Imagery</FormLabel><FormControl><VoiceEnabledTextarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
              <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Business Card</>}
              </Button>
              </form>
          </Form>
          </CardContent>
      </Card>
      {isLoading && (
          <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /><p className="mt-2 text-muted-foreground">Mira is designing your card...</p></CardContent></Card>
      )}
      {response && (
          <Card>
          <CardHeader>
              <CardTitle>Generated Business Card</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
              <div className="relative w-full max-w-md aspect-[1.7/1] overflow-hidden rounded-md border bg-black">
                  <Image src={response.cardImageUrl} alt="Generated Business Card" layout="fill" objectFit="contain" />
              </div>
          </CardContent>
          <CardFooter className="justify-end">
              <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download Card
              </Button>
          </CardFooter>
          </Card>
      )}
    </div>
  );
}
