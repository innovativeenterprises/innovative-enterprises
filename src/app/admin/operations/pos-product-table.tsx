
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import type { PosProduct } from "@/lib/pos-data.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { usePosProductsData } from '@/hooks/use-data-hooks';

const PosProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Hot Drinks', 'Cold Drinks', 'Sandwiches', 'Snacks', 'Pastries']),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("A valid image URL is required"),
});
type PosProductValues = z.infer<typeof PosProductSchema>;

const AddEditPosProductDialog = ({ 
    product, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    product?: PosProduct, 
    onSave: (values: PosProductValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const form = useForm<PosProductValues>({
        resolver: zodResolver(PosProductSchema),
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset(product || { name: "", category: "Snacks", price: 0, stock: 0, imageUrl: "https://images.unsplash.com/photo-1599405452230-74f00454a83a?q=80&w=600&auto=format&fit=crop" });
        }
    }, [product, form, isOpen]);


    const onSubmit: SubmitHandler<PosProductValues> = (data) => {
        onSave(data, product?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Edit" : "Add"} POS Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., Cappuccino" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Hot Drinks">Hot Drinks</SelectItem>
                                        <SelectItem value="Cold Drinks">Cold Drinks</SelectItem>
                                        <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                        <SelectItem value="Pastries">Pastries</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="stock" render={({ field }) => (
                                <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         {form.watch("imageUrl") && (
                             <Image src={form.watch("imageUrl")} alt="Preview" width={100} height={100} className="rounded-md object-cover" />
                         )}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function PosProductTable({ initialProducts }: { initialProducts: PosProduct[] }) {
    const { data: products, setData: setProducts } = usePosProductsData(initialProducts);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<PosProduct | undefined>(undefined);

    const handleOpenDialog = (product?: PosProduct) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSave = (values: PosProductValues, id?: string) => {
        if (id) {
            setProducts(prev => prev.map(item => item.id === id ? { ...item, ...values } : item));
            toast({ title: "Product updated." });
        } else {
            const newItem: PosProduct = { ...values, id: `pos_${values.name.toLowerCase().replace(/\s+/g, '_')}` };
            setProducts(prev => [newItem, ...prev]);
            toast({ title: "Product added." });
        }
    };

    const handleDelete = (id: string) => {
        setProducts(prev => prev.filter(item => item.id !== id));
        toast({ title: "Product removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>AI-POS Product Management</CardTitle>
                    <CardDescription>Manage the products available in the point-of-sale system.</CardDescription>
                </div>
                 <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Product
                 </Button>
            </CardHeader>
            <CardContent>
                <AddEditPosProductDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct}
                    onSave={handleSave}
                >
                    <div />
                </AddEditPosProductDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price (OMR)</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                                <TableCell className="text-right font-mono">{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">{item.stock}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                                            <Edit />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{item.name}".</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
