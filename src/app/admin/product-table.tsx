
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { ProjectStage } from "@/lib/stages";
import { useProjectStagesData } from "./stage-table";
import { PlusCircle, Edit, Trash2, GripVertical } from "lucide-react";
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { store } from "@/lib/global-store";


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
  image: z.string().min(1, "An image is required"),
  aiHint: z.string().min(2, "AI hint is required"),
  enabled: z.boolean(),
  stage: z.string().min(1, "Stage is required"),
  price: z.coerce.number().min(0, "Price is required."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  category: z.string().min(1, "Category is required."),
});

type ProductValues = z.infer<typeof ProductSchema>;

// This hook now connects to the global store.
export const useProductsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            const currentProducts = store.get().products;
            const newProducts = updater(currentProducts);
            store.set(state => ({ ...state, products: newProducts }));
        }
    };
};

const AddEditProductDialog = ({ 
    product, 
    onSave,
    stages,
    children 
}: { 
    product?: Product, 
    onSave: (values: ProductValues, id?: number) => void,
    stages: ProjectStage[],
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
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
            imageFile: undefined,
            imageUrl: (product?.image.startsWith('http') || product?.image.startsWith('data:')) ? product.image : "",
            useUrl: product?.image.startsWith('http') || product?.image.startsWith('data:') || false,
        },
    });

    useEffect(() => {
        if(isOpen) {
           const isUrl = product?.image?.startsWith('http') || product?.image.startsWith('data:') || false;
           form.reset({ 
                name: product?.name || "",
                description: product?.description || "",
                aiHint: product?.aiHint || "",
                enabled: product?.enabled ?? true,
                stage: product?.stage || 'Idea Phase',
                price: product?.price || 0,
                rating: product?.rating || 0,
                category: product?.category || 'Uncategorized',
                imageFile: undefined,
                imageUrl: isUrl ? product.image : "",
                useUrl: isUrl,
            });
        }
    }, [product, form, isOpen]);

    const watchUseUrl = form.watch('useUrl');

    const onSubmit: SubmitHandler<any> = async (data) => {
        let imageValue = product?.image || "";
        
        if(data.useUrl) {
            if(data.imageUrl) imageValue = data.imageUrl;
        } else {
            if (data.imageFile && data.imageFile.length > 0) {
                const file = data.imageFile[0];
                imageValue = await fileToDataURI(file);
            }
        }
        
        if (!imageValue) {
            form.setError('imageUrl', { message: 'Please provide either an image file or a URL.' });
            return;
        }

        onSave({ 
            ...data,
            image: imageValue,
        }, product?.id);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

                        <FormField control={form.control} name="useUrl" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Use Image URL</FormLabel>
                                </div>
                            </FormItem>
                        )}/>

                        <div className="grid grid-cols-2 gap-4">
                           {watchUseUrl ? (
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                           ) : (
                                <FormField control={form.control} name="imageFile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                           )}
                           
                            <FormField control={form.control} name="aiHint" render={({ field }) => (
                                <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g., virtual reality" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
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

const SortableProductRow = ({ product, stages, handleSave, handleDelete, handleToggle }: { product: Product, stages: ProjectStage[], handleSave: (values: ProductValues, id?: number) => void, handleDelete: (id: number) => void, handleToggle: (id: number) => void }) => {
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
                <AddEditProductDialog product={product} onSave={handleSave} stages={stages}>
                    <div className="p-1 -m-1 rounded-md hover:bg-muted cursor-pointer w-fit">
                        <Image src={product.image} alt={product.name} width={60} height={45} className="rounded-md object-cover" />
                    </div>
                </AddEditProductDialog>
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
                    <AddEditProductDialog product={product} onSave={handleSave} stages={stages}>
                        <Button variant="ghost" size="icon"><Edit /></Button>
                    </AddEditProductDialog>
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

export default function ProductTable({ products, setProducts }: { products: Product[], setProducts: (updater: (products: Product[]) => Product[]) => void }) {
    const { toast } = useToast();
    const { stages } = useProjectStagesData();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleSave = (values: ProductValues, id?: number) => {
        if (id) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Product updated successfully." });
        } else {
            const newProduct: Product = {
                ...values,
                id: Math.max(...products.map(p => p.id), 0) + 1,
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
                    <CardDescription>Manage the products showcased on your homepage and e-commerce store.</CardDescription>
                </div>
                <AddEditProductDialog onSave={handleSave} stages={stages}>
                    <Button><PlusCircle /> Add Product</Button>
                </AddEditProductDialog>
            </CardHeader>
            <CardContent>
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
                        {isMounted ? (
                            <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                <TableBody>
                                    {products.map(p => (
                                        <SortableProductRow
                                            key={p.id}
                                            product={p}
                                            stages={stages}
                                            handleSave={handleSave}
                                            handleDelete={handleDelete}
                                            handleToggle={handleToggle}
                                        />
                                    ))}
                                </TableBody>
                            </SortableContext>
                        ) : (
                            <TableBody>
                                {products.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                                        <TableCell><Image src={p.image} alt={p.name} width={60} height={45} className="rounded-md object-cover" /></TableCell>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell><Badge variant="outline">{p.stage}</Badge></TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <Switch checked={p.enabled} disabled/>
                                                <Badge variant={p.enabled ? "default" : "secondary"}>
                                                    {p.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" disabled><Edit /></Button>
                                                <Button variant="ghost" size="icon" disabled><Trash2 className="text-destructive" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}
