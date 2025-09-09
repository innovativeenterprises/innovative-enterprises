
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Sparkles } from 'lucide-react';
import { useStairspaceData } from '@/hooks/use-global-store-data';
import type { StairspaceListing } from '@/lib/stairspace-listings';
import { useRouter } from 'next/navigation';
import { generateListingDescription } from '@/ai/flows/listing-description-generator';
import { Textarea } from '@/components/ui/textarea';
import Image from "next/image";
import { generateImage } from '@/ai/flows/image-generator';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ListSpaceSchema = z.object({
  title: z.string().min(5, "Title is required."),
  location: z.string().min(3, "Location is required."),
  price: z.string().min(3, "Price is required (e.g., 'OMR 25 / day')."),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
  aiHint: z.string().min(2, "AI hint is required."),
  tags: z.string().min(2, "Please add at least one tag."),
  description: z.string().min(10, "A description of at least 10 characters is required."),
}).refine(data => data.imageUrl || (data.imageFile && data.imageFile.length > 0), {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"],
});
type ListSpaceValues = z.infer<typeof ListSpaceSchema>;

export default function ListSpaceForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { stairspaceListings, setStairspaceListings } = useStairspaceData();

    const form = useForm<ListSpaceValues>({
        resolver: zodResolver(ListSpaceSchema),
        defaultValues: {
            title: '',
            location: '',
            price: '',
            imageUrl: '',
            aiHint: '',
            tags: '',
            description: '',
        }
    });

    const watchImageUrl = form.watch('imageUrl');
    const watchImageFile = form.watch('imageFile');

    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            fileToDataURI(watchImageFile[0]).then(setImagePreview);
        } else if (watchImageUrl) {
            setImagePreview(watchImageUrl);
        } else {
             setImagePreview(null);
        }
    }, [watchImageUrl, watchImageFile]);


    const handleGenerateDescription = async () => {
        const { title, location, tags } = form.getValues();
        if (!title || !location || !tags) {
            toast({ title: "Missing Details", description: "Please fill in Title, Location, and Tags before generating a description.", variant: "destructive" });
            return;
        }

        setIsGeneratingDesc(true);
        try {
            const result = await generateListingDescription({ title, location, tags });
            form.setValue('description', result.description, { shouldValidate: true });
            toast({ title: "Description Generated!", description: "The AI has drafted a description for your listing." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not generate description.", variant: "destructive" });
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    
     const handleGenerateImage = async () => {
        const { title, location, tags, aiHint } = form.getValues();
        if (!aiHint) {
            toast({ title: "AI Hint is empty", description: "Please provide a hint for the AI.", variant: "destructive" });
            return;
        }
        setIsGeneratingImg(true);
        toast({ title: "Generating Image...", description: "Lina is creating your image. This might take a moment."});
        try {
            const richPrompt = `A photorealistic image of a "${title}" located in ${location}. It's a ${tags}. The style should be ${aiHint}.`;
            const newImageUrl = await generateImage({ prompt: richPrompt });
            form.setValue('imageUrl', newImageUrl, { shouldValidate: true });
            form.setValue('imageFile', undefined);
            setImagePreview(newImageUrl);
            toast({ title: "Image Generated!", description: "The new image has been added."});
        } catch (e) {
            console.error(e);
            toast({ title: "Image Generation Failed", description: "The AI model might be busy. Please try again.", variant: "destructive"});
        } finally {
            setIsGeneratingImg(false);
        }
    }


    const onSubmit: SubmitHandler<ListSpaceValues> = async (data) => {
        setIsLoading(true);
        
        let imageUrl = data.imageUrl || '';
        if (data.imageFile && data.imageFile.length > 0) {
            imageUrl = await fileToDataURI(data.imageFile[0]);
        }

        const newListing: StairspaceListing = {
            ...data,
            imageUrl,
            id: (stairspaceListings.length > 0 ? Math.max(...stairspaceListings.map(l => l.id)) : 0) + 1,
            tags: data.tags.split(',').map(tag => tag.trim()),
        };

        setStairspaceListings(prev => [newListing, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({ title: "Listing Submitted!", description: `Your space "${newListing.title}" has been added to the marketplace.` });
        setIsLoading(false);
        router.push(`/real-estate-tech/stairspace/${newListing.id}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Space Details</CardTitle>
                <CardDescription>Provide the information for your new listing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Listing Title</FormLabel><FormControl><Input placeholder="e.g., Prime Pop-up Spot in Mall Lobby" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Avenues Mall, Muscat" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price</FormLabel><FormControl><Input placeholder="e.g., OMR 25 / day" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                         <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Listing Image</h4>
                                {imagePreview && (
                                    <div className="relative h-40 w-full rounded-md overflow-hidden border">
                                        <Image src={imagePreview} alt="Image Preview" fill className="object-contain"/>
                                    </div>
                                )}
                                <FormField control={form.control} name="aiHint" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AI Image Hint</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input placeholder="e.g., modern staircase retail" {...field} /></FormControl>
                                            <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGeneratingImg}>
                                                {isGeneratingImg ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                                Generate
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />

                                <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                                </div>

                                <FormField control={form.control} name="imageFile" render={({ field }) => (
                                <FormItem><FormLabel>Upload Image File</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>

                         <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., Retail, Pop-up, High Traffic" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                    <Textarea
                                        placeholder="Describe your space..."
                                        rows={5}
                                        {...field}
                                    />
                                    </FormControl>
                                     <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="absolute bottom-2 right-2"
                                        onClick={handleGenerateDescription}
                                        disabled={isGeneratingDesc}
                                    >
                                        {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                        Generate with AI
                                    </Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><PlusCircle className="mr-2 h-4 w-4" />List My Space</>}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
