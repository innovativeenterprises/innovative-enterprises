
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Sparkles } from 'lucide-react';
import { useStairspaceData } from '@/hooks/use-global-store-data';
import type { StairspaceListing } from '@/lib/stairspace-listings';
import { useRouter } from 'next/navigation';
import { generateListingDescription } from '@/ai/flows/listing-description-generator';
import { Textarea } from '@/components/ui/textarea';


const ListSpaceSchema = z.object({
  title: z.string().min(5, "Title is required."),
  location: z.string().min(3, "Location is required."),
  price: z.string().min(3, "Price is required (e.g., 'OMR 25 / day')."),
  imageUrl: z.string().url("A valid image URL is required."),
  aiHint: z.string().min(2, "AI hint is required."),
  tags: z.string().min(2, "Please add at least one tag."),
  description: z.string().min(10, "A description of at least 10 characters is required."),
});
type ListSpaceValues = z.infer<typeof ListSpaceSchema>;

export default function ListSpaceForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
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

    const handleGenerateDescription = async () => {
        const { title, location, tags } = form.getValues();
        if (!title || !location || !tags) {
            toast({ title: "Missing Details", description: "Please fill in Title, Location, and Tags before generating a description.", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateListingDescription({ title, location, tags });
            form.setValue('description', result.description, { shouldValidate: true });
            toast({ title: "Description Generated!", description: "The AI has drafted a description for your listing." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not generate description.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };


    const onSubmit: SubmitHandler<ListSpaceValues> = async (data) => {
        setIsLoading(true);

        const newListing: StairspaceListing = {
            ...data,
            id: (stairspaceListings.length > 0 ? Math.max(...stairspaceListings.map(l => l.id)) : 0) + 1,
            tags: data.tags.split(',').map(tag => tag.trim()),
        };

        setStairspaceListings(prev => [newListing, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g., modern staircase retail" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
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
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
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
