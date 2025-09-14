
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Download, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { generateFacebookCover } from '@/ai/flows/facebook-cover-generator';
import type { FacebookCoverOutput } from '@/ai/flows/facebook-cover-generator';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  businessName: z.string().min(1, "Business name is required."),
  tagline: z.string().optional(),
  businessDescription: z.string().min(10, "Please provide a brief description of your business."),
  styleAndImagery: z.string().min(10, "Please describe the desired style and imagery."),
});
type FormValues = z.infer<typeof FormSchema>;

export default function FacebookCoverGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FacebookCoverOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessName: 'Innovative Enterprises',
      tagline: 'Pioneering Tomorrow\'s Technology, Today.',
      businessDescription: 'A technology company specializing in AI and digital transformation.',
      styleAndImagery: 'A professional and modern corporate style, with abstract blue and orange light trails representing data and innovation.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: 'Generating Cover Photo...', description: 'Our AI is designing your Facebook cover. This may take a moment.' });
    try {
      const result = await generateFacebookCover(data);
      setResponse(result);
      toast({ title: 'Cover Photo Generated!', description: 'Your new Facebook cover photo is ready for review.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Generation Failed', description: 'Could not generate the cover photo. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!response?.coverPhotoUrl) return;
    const link = document.createElement('a');
    link.href = response.coverPhotoUrl;
    link.download = `facebook-cover-${form.getValues('businessName').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Mira is working her magic...</CardTitle>
                        <CardDescription>Generating a background image and overlaying text. Please wait.</CardDescription>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }
  
  if (response) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your AI-Generated Facebook Cover</CardTitle>
                <CardDescription>Review the generated image. If you're not satisfied, you can go back and adjust your prompts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full aspect-[851/315] overflow-hidden rounded-lg border bg-muted">
                    <Image src={response.coverPhotoUrl} alt="Generated Facebook Cover" layout="fill" objectFit="contain" />
                </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
                <Button onClick={() => setResponse(null)} variant="outline" className="w-full sm:w-auto">
                    <Wand2 className="mr-2 h-4 w-4" /> Try Again
                </Button>
                 <Button onClick={handleDownload} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Download Cover Photo
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Facebook Cover Designer</CardTitle>
        <CardDescription>Describe your business, and our AI will create a professional cover photo for your Facebook page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="businessName" render={({ field }) => (
                <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tagline" render={({ field }) => (
                <FormItem><FormLabel>Tagline (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="businessDescription" render={({ field }) => (
                <FormItem><FormLabel>Business Description</FormLabel><FormControl><Textarea placeholder="e.g., A local bakery specializing in artisan sourdough bread." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="styleAndImagery" render={({ field }) => (
                <FormItem>
                  <FormLabel>Style & Imagery</FormLabel>
                  <FormControl>
                    <VoiceEnabledTextarea placeholder="e.g., A warm, rustic style with images of wheat fields and freshly baked bread." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                <Sparkles className="mr-2 h-4 w-4" /> Generate Cover Photo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
