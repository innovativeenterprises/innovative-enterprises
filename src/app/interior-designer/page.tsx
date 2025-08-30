
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
import { Loader2, Sparkles, Download, ImageIcon, Wand2, ArrowLeft, ArrowRight, Home } from 'lucide-react';
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
  roomImageFile: z.any().refine(file => file?.length == 1, 'A room image is required.'),
  prompt: z.string().min(10, 'Please enter a more descriptive prompt (at least 10 characters).'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function InteriorDesignerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: 'Redesign this room in a modern minimalist style, with neutral colors, wooden floors, and a large plant.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTransformedImage(null);
    try {
      const baseImageUri = await fileToDataURI(data.roomImageFile[0]);
      setBaseImage(baseImageUri);

      const result = await transformImage({ baseImageUri, prompt: data.prompt });
      setTransformedImage(result.imageDataUri);
      toast({ title: "Redesign Complete!", description: "Your new interior design concept is ready." });
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
    link.download = 'ai-interior-design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The design has been downloaded." });
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Home className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Interior Designer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Stuck for ideas? Upload a photo of your room, describe the style you want, and let our AI generate a stunning new interior design concept for you in seconds.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Create a New Design</CardTitle>
                <CardDescription>Upload an image of your room and provide a prompt for the AI.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="roomImageFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Room Photo</FormLabel>
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
                                <FormLabel>Design Instructions</FormLabel>
                                <FormControl>
                                <VoiceEnabledTextarea
                                    placeholder="e.g., 'Make this living room look like a cozy Scandinavian space with light woods, a fireplace, and a large plush rug.'"
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Design...</>
                            ) : (
                            <><Wand2 className="mr-2 h-4 w-4" /> Generate New Design</>
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
                    <p className="text-muted-foreground">The AI is re-imagining your space...</p>
                    <p className="text-sm text-muted-foreground/80">This can take up to 30 seconds. Please be patient.</p>
                </CardContent>
                </Card>
            )}

            {transformedImage && baseImage && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Your AI-Generated Interior Design</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="font-semibold text-center mb-2">Before</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={baseImage} alt="Original Room" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-center mb-2">After</h3>
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <Image src={transformedImage} alt="AI Generated Design" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter className="justify-end">
                        <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download Design
                        </Button>
                    </CardFooter>
                </Card>
            )}
            </div>
      </div>
    </div>
  );
}
