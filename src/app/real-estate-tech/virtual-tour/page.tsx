
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
import { Loader2, Sparkles, Download, ImageIcon, Wand2, Building, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { transformImage } from '@/ai/flows/image-transformer';
import { fileToDataURI } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  floorPlanFile: z.any().refine(file => file?.length == 1, 'A floor plan image is required.'),
  stylePrompt: z.string().min(10, 'Please enter a style description (at least 10 characters).'),
});
type FormValues = z.infer<typeof FormSchema>;

interface TourImage {
    room: string;
    imageUrl: string;
}

const roomPrompts = [
    { room: 'Living Room', prompt: 'Render the living room of this floor plan. It should be spacious and well-lit.' },
    { room: 'Kitchen', prompt: 'Render the kitchen area of this floor plan. Include modern appliances and countertops.' },
    { room: 'Master Bedroom', prompt: 'Render the master bedroom. It should feel cozy and relaxing.' },
    { room: 'Exterior View', prompt: 'Generate a photorealistic 3D architectural rendering of the exterior of the building based on this 2D floor plan.' },
];

export default function VirtualTourPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [tourImages, setTourImages] = useState<TourImage[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stylePrompt: 'A modern, luxury style with a neutral color palette, large windows, and wooden accents.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTourImages([]);
    try {
      const baseImageUri = await fileToDataURI(data.floorPlanFile[0]);
      setBaseImage(baseImageUri);

      toast({ title: "Generating Virtual Tour...", description: "Vista is rendering multiple scenes. This may take a minute." });

      const imagePromises = roomPrompts.map(p => 
        transformImage({ 
            baseImageUri, 
            prompt: `${p.prompt} The overall style should be: ${data.stylePrompt}`
        }).then(result => ({ room: p.room, imageUrl: result.imageDataUri }))
      );

      const results = await Promise.all(imagePromises);
      
      setTourImages(results);
      toast({ title: "Virtual Tour Ready!", description: "Your virtual tour has been generated successfully." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the virtual tour. The model may be busy. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, roomName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `virtual-tour-${roomName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: `The ${roomName} image has been downloaded.` });
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Building className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Virtual Tour & Staging</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Transform 2D floor plans into an immersive virtual tour. Upload a plan, describe your desired style, and let our AI generate stunningly realistic 3D renderings of multiple rooms.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Create a New Virtual Tour</CardTitle>
                <CardDescription>Upload a 2D floor plan image and provide a style prompt for the AI.</CardDescription>
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
                            name="stylePrompt"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Overall Design Style</FormLabel>
                                <FormControl>
                                <VoiceEnabledTextarea
                                    placeholder="e.g., 'A modern, luxury style with a neutral color palette, large windows, and wooden accents.'"
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Tour...</>
                            ) : (
                            <><Wand2 className="mr-2 h-4 w-4" /> Generate Virtual Tour</>
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
                    <p className="text-muted-foreground">Vista is rendering multiple 3D scenes for your tour...</p>
                    <p className="text-sm text-muted-foreground/80">This process can take a minute or two. Please be patient.</p>
                </CardContent>
                </Card>
            )}

            {tourImages.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Your AI-Generated Virtual Tour</CardTitle>
                         <CardDescription>Click through the carousel to see the different rendered rooms of your property.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Carousel className="w-full max-w-2xl">
                            <CarouselContent>
                                {baseImage && (
                                    <CarouselItem>
                                        <div className="p-1">
                                            <Card>
                                                <CardHeader><CardTitle className="text-lg">Original 2D Plan</CardTitle></CardHeader>
                                                <CardContent className="flex aspect-video items-center justify-center p-6 bg-black rounded-b-lg">
                                                    <Image src={baseImage} alt="Original Floor Plan" width={500} height={300} className="object-contain" />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                )}
                                {tourImages.map((image, index) => (
                                    <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                             <CardHeader className="flex flex-row justify-between items-center">
                                                <CardTitle className="text-lg">{image.room}</CardTitle>
                                                <Button variant="outline" size="sm" onClick={() => handleDownload(image.imageUrl, image.room)}><Download className="mr-2 h-4 w-4" /> Download</Button>
                                             </CardHeader>
                                            <CardContent className="flex aspect-video items-center justify-center p-6 bg-black rounded-b-lg">
                                                 <Image src={image.imageUrl} alt={`Render of ${image.room}`} width={500} height={300} className="object-contain" />
                                            </CardContent>
                                        </Card>
                                    </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-12" />
                            <CarouselNext className="-right-12" />
                        </Carousel>
                    </CardContent>
                </Card>
            )}
            </div>
      </div>
    </div>
  );
}
