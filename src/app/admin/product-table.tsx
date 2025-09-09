
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { ProjectStage } from "@/lib/stages";
import { useProjectStagesData } from "./stage-table";
import { PlusCircle, Edit, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProductsData } from "@/hooks/use-global-store-data";
import { Skeleton } from "../ui/skeleton";
import { generateImage } from "@/ai/flows/image-generator";


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
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
  aiHint: z.string().min(2, "AI hint is required"),
  enabled: z.boolean(),
  stage: z.string().min(1, "Stage is required"),
  price: z.coerce.number().min(0, "Price is required."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  category: z.string().min(1, "Category is required."),
}).refine(data => data.imageUrl || (data.imageFile && data.imageFile.length > 0), {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"], // Point error to imageUrl field
});

export type ProductValues = z.infer<typeof ProductSchema> & { image: string };

const AddEditProductDialog = ({ 
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
            const newImageUrl = await generateImage({ prompt: hint });
            form.setValue('imageUrl', newImageUrl, { shouldValidate: true });
            setImagePreview(newImageUrl);
             toast({ title: "Image Generated!", description: "The new image has been added."});
        } catch (e) {
            console.error(e);
            toast({ title: "Image Generation Failed", description: "The AI model might be busy. Please try again.", variant: "destructive"});
        } finally {
            setIsGenerating(false);
        }
    }

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

const SortableProductRow = ({ product, stages, handleSave, handleDelete, handleToggle, handleOpenDialog }: { 
    product: Product, 
    stages: ProjectStage[], 
    handleSave: (values: ProductValues, id?: number) => void, 
    handleDelete: (id: number) => void, 
    handleToggle: (id: number) => void,
    handleOpenDialog: (product: Product) => void,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell>
                 <div className="p-1 -m-1 rounded-md hover:bg-muted cursor-pointer w-fit" onClick={() => handleOpenDialog(product)}>
                    <Image src={product.image} alt={product.name} width={60} height={45} className="rounded-md object-cover" />
                </div>
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell><Badge variant="outline">{product.stage || 'N/A'}</Badge></TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                    <Switch
                        checked={product.enabled}
                        onCheckedChange={() => handleToggle(product.id)}
                        aria-label={`Enable/disable ${product.name}`}
                    />
                    <Badge variant={product.enabled ? "default" : "secondary"}>
                        {product.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}><Edit /></Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the product "{product.name}".</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default function ProductTable({ products, setProducts }: { products: Product[], setProducts: (updater: (products: Product[]) => void) => void }) {
    const { toast } = useToast();
    const { stages } = useProjectStagesData();
    const [isClient, setIsClient] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleOpenDialog = (product?: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    }

    const handleSave = (values: ProductValues, id?: number) => {
        if (id) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Product updated successfully." });
        } else {
            const newProduct: Product = {
                ...values,
                id: (products.length > 0 ? Math.max(...products.map(p => p.id)) : 0) + 1,
            };
            setProducts(prev => [newProduct, ...prev]);
            toast({ title: "Product added successfully." });
        }
    };
    
    const handleToggle = (id: number) => {
        setProducts(
            products.map(p =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            )
        );
        toast({ title: "Product status updated." });
    };

    const handleDelete = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: "Product removed.", variant: "destructive" });
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setProducts((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            toast({ title: "Product order updated." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Digital Product Management</CardTitle>
                    <CardDescription>Manage the projects and SaaS platforms displayed on your homepage.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle /> Add Product</Button>
            </CardHeader>
            <CardContent>
                <AddEditProductDialog 
                    isOpen={isDialogOpen} 
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct} 
                    onSave={handleSave} 
                    stages={stages}
                >
                    <div/>
                </AddEditProductDialog>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {!isClient ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Skeleton className="w-full h-20" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                    {products.map(p => (
                                        <SortableProductRow
                                            key={p.id}
                                            product={p}
                                            stages={stages}
                                            handleSave={handleSave}
                                            handleDelete={handleDelete}
                                            handleToggle={handleToggle}
                                            handleOpenDialog={handleOpenDialog}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}
