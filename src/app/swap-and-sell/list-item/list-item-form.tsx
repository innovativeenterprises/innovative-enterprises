
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
import { Loader2, Sparkles, Wand2, Upload, Send } from 'lucide-react';
import { analyzeUsedItem, type UsedItemAnalysisOutput } from '@/ai/flows/used-item-analyzer';
import { fileToDataURI } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsedItemsData } from '@/hooks/use-global-store-data';
import type { UsedItem } from '@/lib/used-items';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  itemImage: z.any().refine(file => file?.length == 1, 'An image of the item is required.'),
  name: z.string().min(3, "Item name is required."),
  category: z.string().min(3, "Category is required."),
  description: z.string().min(10, "Description is required."),
  condition: z.enum(['New', 'Like New', 'Used - Good', 'Used - Fair']),
  price: z.coerce.number().min(0, "Price must be zero or more."),
  listingType: z.enum(['For Sale', 'For Donation', 'Gift']),
});
type FormValues = z.infer<typeof FormSchema>;

export default function ListItemForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { setItems } = useUsedItemsData();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            condition: 'Used - Good',
            listingType: 'For Sale',
        },
    });

    const handleAnalyzeImage = async () => {
        const itemImageFile = form.getValues('itemImage');
        if (!itemImageFile || itemImageFile.length === 0) {
            toast({ title: 'Please upload an image first.', variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing Image...', description: 'Our AI is identifying your item.' });

        try {
            const imageUri = await fileToDataURI(itemImageFile[0]);
            const result = await analyzeUsedItem({ imageDataUri: imageUri });
            
            form.setValue('name', result.itemName);
            form.setValue('category', result.category);
            form.setValue('description', result.description);
            form.setValue('price', result.estimatedPriceOMR);
            
            toast({ title: 'Analysis Complete!', description: 'Item details have been pre-filled.' });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not identify the item from the image.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        const imageUri = await fileToDataURI(data.itemImage[0]);
        
        const newItem: UsedItem = {
            id: `item_${Date.now()}`,
            name: data.name,
            category: data.category,
            description: data.description,
            condition: data.condition,
            price: data.price,
            listingType: data.listingType,
            imageUrl: imageUri,
            seller: 'Current User', // In a real app, this would be the logged-in user
        };
        
        setItems(prev => [newItem, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({ title: "Listing Created!", description: "Your item is now live on the marketplace." });
        setIsLoading(false);
        router.push(`/swap-and-sell/${newItem.id}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>List a New Item</CardTitle>
                <CardDescription>Upload a photo of your item and let our AI help you fill in the details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         <FormField
                            control={form.control}
                            name="itemImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1. Upload Item Image</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl className="flex-1">
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <Button type="button" variant="secondary" onClick={handleAnalyzeImage} disabled={isAnalyzing}>
                                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                            Analyze with AI
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>2. Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>3. Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage/></FormItem>)} />

                        <div className="grid md:grid-cols-3 gap-6">
                             <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>4. Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                             <FormField control={form.control} name="condition" render={({ field }) => (<FormItem><FormLabel>5. Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Like New">Like New</SelectItem>
                                <SelectItem value="Used - Good">Used - Good</SelectItem>
                                <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                             </SelectContent></Select><FormMessage/></FormItem>)} />
                              <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>6. Price (OMR)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage/></FormItem>)} />
                        </div>
                        
                         <FormField control={form.control} name="listingType" render={({ field }) => (
                            <FormItem><FormLabel>7. Listing Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="For Sale">For Sale</SelectItem>
                                <SelectItem value="For Donation">For Donation</SelectItem>
                                <SelectItem value="Gift">Gift (Free)</SelectItem>
                            </SelectContent></Select><FormMessage/></FormItem>
                        )} />

                        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Listing...</> : <><Send className="mr-2 h-4 w-4" /> Publish Listing</>}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
