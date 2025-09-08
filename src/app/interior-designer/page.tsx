
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
import { Loader2, Sparkles, Download, ImageIcon, Wand2, ArrowRight, Home } from 'lucide-react';
import Image from 'next/image';
import { transformImage } from '@/ai/flows/image-transformer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office"];
const designStyles = ["Modern", "Minimalist", "Scandinavian", "Bohemian", "Industrial", "Coastal"];
const colorPalettes = ["Warm Neutrals", "Cool Tones", "Monochromatic", "Earthy Tones", "Pastel"];
const keyFeatures = ["a large plant", "a statement light fixture", "a gallery wall", "a fireplace", "wooden beams"];


const FormSchema = z.object({
  roomImageFile: z.any().refine(file => file?.length == 1, 'A room image is required.'),
  roomType: z.string().min(1, "Please select a room type."),
  designStyle: z.string().min(1, "Please select a design style."),
  colorPalette: z.string().min(1, "Please select a color palette."),
  keyFeature: z.string().min(1, "Please select a key feature."),
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
        roomType: "Living Room",
        designStyle: "Modern",
        colorPalette: "Warm Neutrals",
        keyFeature: "a large plant",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTransformedImage(null);
    try {
      const baseImageUri = await fileToDataURI(data.roomImageFile[0]);
      setBaseImage(baseImageUri);

      const prompt = `Redesign this ${data.roomType} in a ${data.designStyle} style. The color palette should be ${data.colorPalette}. Make sure to include ${data.keyFeature}.`;

      const result = await transformImage({ baseImageUri, prompt });
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
                <CardDescription>Upload an image of your room and select your desired design elements.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="roomImageFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1. Your Room Photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                             <FormField
                                control={form.control}
                                name="roomType"
                                render={({ field }) => (
                                    <FormItem><FormLabel>2. Room Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                        {roomTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="designStyle"
                                render={({ field }) => (
                                    <FormItem><FormLabel>3. Design Style</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                         {designStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="keyFeature"
                                render={({ field }) => (
                                    <FormItem><FormLabel>5. Key Feature</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                        {keyFeatures.map(feature => <SelectItem key={feature} value={feature}>Include {feature}</SelectItem>)}
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="colorPalette"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>4. Color Palette</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                                    >
                                    {colorPalettes.map(palette => (
                                         <FormItem key={palette}>
                                            <FormControl>
                                                <RadioGroupItem value={palette} id={palette} className="sr-only" />
                                            </FormControl>
                                            <Label htmlFor={palette} className={cn('block p-4 rounded-lg border-2 text-center cursor-pointer', field.value === palette && 'border-primary ring-2 ring-primary')}>
                                                {palette}
                                            </Label>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
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
