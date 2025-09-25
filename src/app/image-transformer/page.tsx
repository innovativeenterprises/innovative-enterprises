
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Wand2, ArrowRight, Brush } from 'lucide-react';
import Image from 'next/image';
import { transformImage } from '@/ai/flows/image-transformer';
import { fileToDataURI } from '@/lib/utils';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  baseImageFile: z.any().refine(file => file?.length == 1, 'An image file is required.'),
  prompt: z.string().min(10, 'Please describe the transformation you want.'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function ImageTransformerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: 'Change the background to a futuristic cityscape at night.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTransformedImage(null);
    try {
      const baseImageUri = await fileToDataURI(data.baseImageFile[0]);
      setBaseImage(baseImageUri);

      const result = await transformImage({ baseImageUri, prompt: data.prompt });
      setTransformedImage(result.imageDataUri);
      toast({ title: "Image Transformed!", description: "Your new image is ready." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to transform the image. The model may be busy. Please try again.',
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
    link.download = 'transformed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The transformed image has been downloaded." });
  };

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Brush className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Image Transformer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload an image and tell our AI how you want to change it. Redesign a room, change the background of a photo, or turn a sketch into a photorealistic image.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Transform an Image</CardTitle>
                    <CardDescription>Upload your base image and describe the transformation.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="baseImageFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1. Base Image</FormLabel>
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
                                    <FormLabel>2. Transformation Prompt</FormLabel>
                                    <FormControl>
                                    <VoiceEnabledTextarea
                                        placeholder="e.g., 'Turn this sketch into a photorealistic render' or 'Change the color of the car to metallic blue'."
                                        rows={4}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                            {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transforming...</>
                            ) : (
                            <><Wand2 className="mr-2 h-4 w-4" /> Transform Image</>
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
                        <p className="text-muted-foreground">Vista is working its magic...</p>
                        <p className="text-sm text-muted-foreground/80">This can take up to 30 seconds.</p>
                    </CardContent>
                </Card>
            )}

            {transformedImage && baseImage && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Transformation Result</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="font-semibold text-center mb-2">Before</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={baseImage} alt="Original" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-center mb-2">After</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={transformedImage} alt="AI Transformed" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter className="justify-end">
                        <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download Result
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
