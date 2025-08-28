
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
import type { Product } from "@/lib/products";
import type { ProjectStage } from "@/lib/stages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ProductSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
  aiHint: z.string().min(2, "AI hint is required"),
  enabled: z.boolean(),
  stage: z.string().min(1, "Stage is required"),
  price: z.coerce.number().min(0, "Price is required."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  category: z.string().min(1, "Category is required."),
}).refine(data => data.imageUrl || data.imageFile, {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"], // Point error to imageUrl field
});

export type ProductValues = z.infer<typeof ProductSchema> & { image: string };

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
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
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
        }
    }, [product, form, isOpen]);

    const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (data) => {
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

                         <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="relative my-2">
                           <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                           <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                        </div>

                        <FormField control={form.control} name="imageFile" render={({ field }) => (
                           <FormItem><FormLabel>Upload Image File</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />

                         <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g., virtual reality" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

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

    
