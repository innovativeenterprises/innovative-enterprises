
'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { StockItem } from "@/lib/stock-items.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { useStockItemsData } from "@/hooks/use-data-hooks";

const StockItemSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required."),
  category: z.string().min(2, "Category is required."),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  price: z.coerce.number().positive("Price must be positive."),
  status: z.enum(['Active', 'Sold', 'Expired']),
  saleType: z.enum(['Fixed Price', 'Auction']),
  expiryDate: z.string().optional(),
  auctionEndDate: z.string().optional(),
  imageUrl: z.string().url("Image URL is required."),
  aiHint: z.string().optional(),
});
type StockItemValues = z.infer<typeof StockItemSchema>;

const AddEditStockItemDialog = ({ 
    item, 
    onSave,
    children 
}: { 
    item?: StockItem, 
    onSave: (values: StockItemValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<StockItemValues>({ resolver: zodResolver(StockItemSchema) });

    useEffect(() => {
        if(isOpen) {
           form.reset(item || { name: "", description: "", category: "Food & Beverage", quantity: 1, price: 0, status: 'Active', saleType: 'Fixed Price' });
        }
    }, [item, form, isOpen]);

    const onSubmit: SubmitHandler<StockItemValues> = (data) => {
        onSave(data, item?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader><DialogTitle>{item ? "Edit" : "Add"} Stock Item</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="quantity" render={({ field }) => (
                                <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Total Price (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="saleType" render={({ field }) => (
                                <FormItem><FormLabel>Sale Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                                    <SelectItem value="Auction">Auction</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         {form.watch('saleType') === 'Auction' && (
                             <FormField control={form.control} name="auctionEndDate" render={({ field }) => (
                                <FormItem><FormLabel>Auction End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         )}
                         <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Item</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function StockClearClientPage({ initialItems }: { initialItems: StockItem[] }) {
    const { data: items, setData: setItems, isClient } = useStockItemsData(initialItems);
    const { toast } = useToast();

    const handleSave = (values: StockItemValues, id?: string) => {
        if (id) {
            setItems(prev => prev.map(item => (item.id === id ? { ...item, ...values } as StockItem : item)));
            toast({ title: "Item updated." });
        } else {
            const newItem: StockItem = { ...values, id: `stock_${Date.now()}` };
            setItems(prev => [newItem, ...prev]);
            toast({ title: "Item added." });
        }
    };

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        toast({ title: "Item removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>StockClear Marketplace Management</CardTitle>
                    <CardDescription>Manage all overstock and clearance item listings.</CardDescription>
                </div>
                <AddEditStockItemDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Item</Button>
                </AddEditStockItemDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price (OMR)</TableHead>
                            <TableHead>Sale Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow><TableCell colSpan={7}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                        ) : items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="font-mono">{item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.saleType}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddEditStockItemDialog item={item} onSave={handleSave}>
                                            <Button variant="ghost" size="icon"><Edit /></Button>
                                        </AddEditStockItemDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Item?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{item.name}".</AlertDialogDescription></AlertDialogHeader>
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
