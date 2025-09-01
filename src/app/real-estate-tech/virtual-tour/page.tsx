
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
import { Loader2, Sparkles, Download, ImageIcon, Wand2, ArrowLeft, ArrowRight, Building } from 'lucide-react';
import Image from 'next/image';
import { transformImage } from '@/ai/flows/image-transformer';
import Link from 'next/link';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

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
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: 'Create a photorealistic 3D architectural rendering of a modern luxury villa based on this 2D floor plan. Show the exterior with a clean, white facade, large glass windows, a swimming pool, and landscaped garden. The lighting should be bright daylight.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTransformedImage(null);
    try {
      const baseImageUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImage(baseImageUri);

      const result = await transformImage({ baseImageUri, prompt: data.prompt });
      setTransformedImage(result.imageDataUri);
      toast({ title: "Rendering Complete!", description: "Your 3D floor plan has been generated." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the image. The model may be unavailable. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!transformedImage) return;
    const link = document.createElement('a');
    link.href = transformedImage;
    link.download = '3d-floor-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The 3D plan has been downloaded." });
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Building className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Floor Plan Renderer & Staging</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Transform your 2D floor plans into stunning 3D architectural renderings or virtually staged layouts. Upload a plan, describe your vision, and let our AI bring it to life.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Create a 3D Render</CardTitle>
                <CardDescription>Upload a 2D floor plan image and provide a prompt for the AI.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="floorPlanFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>2D Floor Plan Image</FormLabel>
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
                                <FormLabel>Transformation Instructions</FormLabel>
                                <FormControl>
                                <VoiceEnabledTextarea
                                    placeholder="e.g., 'Create a photorealistic 3D architectural rendering of a modern luxury villa based on this 2D floor plan...'"
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating 3D Render...</>
                            ) : (
                            <><Wand2 className="mr-2 h-4 w-4" /> Generate 3D Plan</>
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
                    <p className="text-muted-foreground">The AI is rendering your 3D visualization...</p>
                    <p className="text-sm text-muted-foreground/80">This can take up to 30 seconds. Please be patient.</p>
                </CardContent>
                </Card>
            )}

            {transformedImage && baseImage && (
                 <Card>
                    <CardHeader>
                        <CardTitle>AI Rendering Result</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="font-semibold text-center mb-2">Before (2D Plan)</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={baseImage} alt="Original Floor Plan" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-center mb-2">After (3D Render)</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={transformedImage} alt="Staged Floor Plan" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter className="justify-end">
                        <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download 3D Render
                        </Button>
                    </CardFooter>
                </Card>
            )}
            </div>
      </div>
    </div>
  );
}
