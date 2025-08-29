
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
import { Loader2, Sparkles, Download, Image as ImageIcon, Wand2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { annotateImage } from '@/ai/flows/image-annotation';
import Link from 'next/link';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan image is required.'),
  prompt: z.string().min(10, 'Please enter a more descriptive prompt (at least 10 characters).'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function VirtualTourPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: 'Place standard furniture icons on this floor plan. Include beds in bedrooms, sofas in the living room, a dining table in the dining area, and kitchen appliances.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAnnotatedImage(null);
    try {
      const baseImageUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImage(baseImageUri);

      const result = await annotateImage({ baseImageUri, prompt: data.prompt });
      setAnnotatedImage(result.imageDataUri);
      toast({ title: "Virtual Staging Complete!", description: "Your floor plan has been annotated." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate annotated image. The model may be unavailable. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!annotatedImage) return;
    const link = document.createElement('a');
    link.href = annotatedImage;
    link.download = 'staged-floor-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The staged floor plan has been downloaded." });
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Virtual Staging</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a floor plan and tell our AI how to furnish it. Generate professionally staged layouts in seconds to help clients visualize the space.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Create a Staged Floor Plan</CardTitle>
                <CardDescription>Upload a floor plan image and provide a prompt for the AI.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="floorPlanFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Floor Plan Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Staging Instructions</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="e.g., 'Place modern, minimalist furniture icons on this floor plan. Add a king-sized bed in the master bedroom...'"
                                    rows={5}
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Staging Floor Plan...</>
                            ) : (
                            <><Wand2 className="mr-2 h-4 w-4" /> Generate Staged Plan</>
                            )}
                        </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card>
                <CardContent className="p-6 text-center space-y-4">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">The AI is virtually staging your floor plan...</p>
                    <p className="text-sm text-muted-foreground/80">This can take up to 30 seconds. Please be patient.</p>
                </CardContent>
                </Card>
            )}

            {annotatedImage && baseImage && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Virtual Staging Result</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-center mb-2">Before</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={baseImage} alt="Original Floor Plan" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-center mb-2">After</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={annotatedImage} alt="Staged Floor Plan" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter className="justify-end">
                        <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download Staged Plan
                        </Button>
                    </CardFooter>
                </Card>
            )}
            </div>
      </div>
    </div>
  );
}
