
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import { ProductSchema } from "@/lib/products.schema";
import type { ProjectStage } from "@/lib/stages";
import { PlusCircle, Edit, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";
import Image from 'next/image';
import { generateImage } from '@/ai/flows/image-generator';
import { Card, CardContent } from "@/components/ui/card";
import { fileToDataURI } from "@/lib/utils";

const DialogProductSchema = ProductSchema.extend({
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
}).refine(data => data.imageUrl || (data.imageFile && data.imageFile.length > 0), {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"], // Point error to imageUrl field
});

export type ProductValues = z.infer<typeof ProductSchema>;

export const AddEditProductDialog = ({ 
    product, 
    onSave,
    stages,
    children,
    isOpen,
    onOpenChange,
}: { 
    product?: Product, 
    onSave: (values: ProductValues, id?: number) => void,
    stages: ProjectStage[],
    children: React.ReactNode,
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof DialogProductSchema>>({
        resolver: zodResolver(DialogProductSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            aiHint: product?.aiHint || "",
            enabled: product?.enabled ?? true,
            stage: product?.stage || 'Idea Phase',
            price: product?.price || 0,
            rating: product?.rating || 0,
            category: product?.category || 'Uncategorized',
            imageUrl: product?.image || "",
            imageFile: undefined,
        },
    });

     const watchImageUrl = form.watch('imageUrl');
     const watchImageFile = form.watch('imageFile');

    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            fileToDataURI(watchImageFile[0]).then(setImagePreview);
        } else if (watchImageUrl) {
            setImagePreview(watchImageUrl);
        } else {
             setImagePreview(product?.image || null);
        }
    }, [watchImageUrl, watchImageFile, product?.image]);

    useEffect(() => {
        if(isOpen) {
           form.reset({ 
                name: product?.name || "",
                description: product?.description || "",
                aiHint: product?.aiHint || "",
                enabled: product?.enabled ?? true,
                stage: product?.stage || 'Idea Phase',
                price: product?.price || 0,
                rating: product?.rating || 0,
                category: product?.category || 'Uncategorized',
                imageUrl: product?.image || "",
                imageFile: undefined,
            });
            setImagePreview(product?.image || null);
        }
    }, [product, form, isOpen]);

    const handleGenerateImage = async () => {
        const hint = form.getValues('aiHint');
        if (!hint) {
            toast({ title: "AI Hint is empty", description: "Please provide a hint for the AI.", variant: "destructive" });
            return;
        }
        setIsGenerating(true);
        toast({ title: "Generating Image...", description: "Lina is creating your image. This might take a moment."});
        try {
            const { imageUrl } = await generateImage({ prompt: hint });
            form.setValue('imageUrl', imageUrl, { shouldValidate: true });
            setImagePreview(imageUrl);
             toast({ title: "Image Generated!", description: "The new image has been added."});
        } catch (e) {
            console.error(e);
            toast({ title: "Image Generation Failed", description: "The AI model might be busy. Please try again.", variant: "destructive"});
        } finally {
            setIsGenerating(false);
        }
    }

    const onSubmit: SubmitHandler<z.infer<typeof DialogProductSchema>> = async (data) => {
        let imageValue = "";
        
        if (data.imageFile && data.imageFile.length > 0) {
            imageValue = await fileToDataURI(data.imageFile[0]);
        } else if (data.imageUrl) {
            imageValue = data.imageUrl;
        }

        onSave({ 
            ...data,
            image: imageValue,
        }, product?.id);
        form.reset();
        setImagePreview(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit" : "Add"} Product</DialogTitle>
                    <DialogDescription>
                        {product ? "Update the details for this product." : "Enter the details for the new product."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="stage" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Stage</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {stages.map(stage => <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-commerce Category</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="rating" render={({ field }) => (
                                <FormItem><FormLabel>Rating (0-5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                         <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Product Image</h4>
                                {imagePreview && (
                                    <div className="relative h-40 w-full rounded-md overflow-hidden border">
                                        <Image src={imagePreview} alt="Image Preview" fill className="object-contain"/>
                                    </div>
                                )}
                                <FormField control={form.control} name="aiHint" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AI Image Hint</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input placeholder="e.g., virtual reality" {...field} /></FormControl>
                                            <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGenerating}>
                                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
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


                         <FormField control={form.control} name="enabled" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Enabled</FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}/>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
