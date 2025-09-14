
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
import { Loader2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import { generateFacebookCover } from '@/ai/flows/facebook-cover-generator';
import type { FacebookCoverInput, FacebookCoverOutput } from '@/ai/flows/facebook-cover-generator';

const FormSchema = z.object({
  businessName: z.string().min(1, "Business name is required."),
  tagline: z.string().optional(),
  businessDescription: z.string().min(10, "Please provide a brief description."),
  styleAndImagery: z.string().min(10, "Please describe the desired style."),
});

type FormValues = z.infer<typeof FormSchema>;

export default function GeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FacebookCoverOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessName: "INNOVATIVE ENTERPRISES",
      tagline: "Pioneering Tomorrow's Technology, Today.",
      businessDescription: "An AI-powered business services platform for the Omani market.",
      styleAndImagery: "A modern, professional theme with abstract digital circuit board patterns and a blue and gold color scheme.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    toast({ title: "Generating Cover Photo...", description: "This may take a moment. Please wait." });
    try {
      const result = await generateFacebookCover(data);
      setResponse(result);
      toast({ title: "Cover Photo Generated!", description: "Your new Facebook cover is ready." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the cover photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
   const handleDownload = () => {
    if (!response?.coverPhotoUrl) return;
    const link = document.createElement('a');
    link.href = response.coverPhotoUrl;
    link.download = 'facebook-cover.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The cover photo has been downloaded." });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Business</CardTitle>
          <CardDescription>Provide details about your brand, and Mira will generate a cover photo for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="businessName" render={({ field }) => (
                        <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="tagline" render={({ field }) => (
                        <FormItem><FormLabel>Tagline (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="businessDescription" render={({ field }) => (
                    <FormItem><FormLabel>Business Description</FormLabel><FormControl><VoiceEnabledTextarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="styleAndImagery" render={({ field }) => (
                    <FormItem><FormLabel>Desired Style & Imagery</FormLabel><FormControl><VoiceEnabledTextarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Cover Photo</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {isLoading && (
        <Card><CardContent className="p-6 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /><p className="mt-2 text-muted-foreground">Mira is designing your cover...</p></CardContent></Card>
      )}
      {response && (
         <Card>
          <CardHeader>
            <CardTitle>Generated Cover Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-[851/315] w-full overflow-hidden rounded-md border bg-black">
                <Image src={response.coverPhotoUrl} alt="Generated Facebook Cover" layout="fill" objectFit="contain" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <h4 className="text-sm font-semibold">Base Image</h4>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black mt-2">
                        <Image src={response.baseImageUrl} alt="Generated Base Background" layout="fill" objectFit="contain" />
                    </div>
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold">Final Image</h4>
                     <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black mt-2">
                        <Image src={response.coverPhotoUrl} alt="Generated Facebook Cover with text" layout="fill" objectFit="contain" />
                    </div>
                 </div>
             </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download Cover Photo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
