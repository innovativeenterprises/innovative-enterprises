
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
import { initialProducts } from "@/lib/products";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';

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
});
type ProductValues = z.infer<typeof ProductSchema>;

const AddEditProductDialog = ({ 
    product, 
    onSave,
    children 
}: { 
    product?: Product, 
    onSave: (values: ProductValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<Omit<ProductValues, 'image'> & { image: any }>({
        resolver: zodResolver(ProductSchema.omit({ image: true })),
        defaultValues: product || { 
            name: "", 
            description: "", 
            aiHint: "",
        },
    });

    useEffect(() => {
        if(isOpen) {
           form.reset(product || { name: "", description: "", image: "", aiHint: "" });
        }
    }, [product, form, isOpen]);

    const onSubmit: SubmitHandler<any> = async (data) => {
        let imageDataUri = product?.image || "";
        if (data.image && data.image.length > 0) {
            const file = data.image[0];
            imageDataUri = await fileToDataURI(file);
        }

        onSave({ ...data, image: imageDataUri }, product?.id);
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
                           <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
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

export default function ProductTable() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const { toast } = useToast();

    const handleSave = (values: ProductValues, id?: string) => {
        if (id) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Product updated successfully." });
        } else {
            const newProduct: Product = {
                ...values,
                id: `prod_${(Math.random() + 1).toString(36).substring(7)}`,
            };
            setProducts(prev => [newProduct, ...prev]);
            toast({ title: "Product added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: "Product removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Digital Product Management</CardTitle>
                    <CardDescription>Manage the products showcased on your homepage.</CardDescription>
                </div>
                <AddEditProductDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Product</Button>
                </AddEditProductDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <AddEditProductDialog product={p} onSave={handleSave}>
                                        <div className="p-1 -m-1 rounded-md hover:bg-muted cursor-pointer w-fit">
                                            <Image src={p.image} alt={p.name} width={60} height={45} className="rounded-md object-cover" />
                                        </div>
                                    </AddEditProductDialog>
                                </TableCell>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell className="text-muted-foreground max-w-sm truncate">{p.description}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddEditProductDialog product={p} onSave={handleSave}>
                                            <Button variant="ghost" size="icon"><Edit /></Button>
                                        </AddEditProductDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the product "{p.name}".</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
