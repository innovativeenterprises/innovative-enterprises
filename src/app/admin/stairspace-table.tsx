
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
import type { StairspaceListing } from "@/lib/stairspace-listings";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";

const StairspaceSchema = z.object({
  title: z.string().min(5, "Title is required."),
  location: z.string().min(3, "Location is required."),
  price: z.string().min(3, "Price is required (e.g., 'OMR 25 / day')."),
  imageUrl: z.string().url("A valid image URL is required."),
  aiHint: z.string().min(2, "AI hint is required."),
  tags: z.string().describe("Comma-separated tags"),
});
type StairspaceValues = z.infer<typeof StairspaceSchema>;

const AddEditStairspaceDialog = ({ 
    listing, 
    onSave,
    children,
}: { 
    listing?: StairspaceListing, 
    onSave: (values: StairspaceValues, id?: number) => void,
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<StairspaceValues>({
        resolver: zodResolver(StairspaceSchema),
        defaultValues: {
            ...listing,
            tags: listing?.tags.join(', ') || '',
        },
    });

    useEffect(() => {
        if(isOpen) {
           form.reset({
            ...listing,
            tags: listing?.tags.join(', ') || '',
           });
        }
    }, [listing, form, isOpen]);

    const onSubmit: SubmitHandler<StairspaceValues> = async (data) => {
        onSave(data, listing?.id);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{listing ? "Edit" : "Add"} StairSpace Listing</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input placeholder="e.g., OMR 25 / day" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input placeholder="e.g., modern staircase retail" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="e.g., Retail, Pop-up, High Traffic" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Listing</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function StairspaceTable({ stairspaceListings, setStairspaceListings, isClient }: { stairspaceListings: StairspaceListing[], setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => void, isClient: boolean }) {
    const { toast } = useToast();

    const handleSave = (values: StairspaceValues, id?: number) => {
        const listingData = {
            ...values,
            tags: values.tags.split(',').map(tag => tag.trim()),
        };

        if (id) {
            setStairspaceListings(prev => prev.map(l => l.id === id ? { ...l, ...listingData } : l));
            toast({ title: "Listing updated." });
        } else {
            const newListing: StairspaceListing = {
                ...listingData,
                id: (stairspaceListings.length > 0 ? Math.max(...stairspaceListings.map(l => l.id)) : 0) + 1,
            };
            setStairspaceListings(prev => [newListing, ...prev]);
            toast({ title: "Listing added." });
        }
    };

    const handleDelete = (id: number) => {
        setStairspaceListings(prev => prev.filter(l => l.id !== id));
        toast({ title: "Listing removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>StairSpace Listings</CardTitle>
                    <CardDescription>Manage micro-retail and storage space listings.</CardDescription>
                </div>
                <AddEditStairspaceDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Space</Button>
                </AddEditStairspaceDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={5}>
                                        <Skeleton className="h-12 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            stairspaceListings.map(listing => (
                                <TableRow key={listing.id}>
                                    <TableCell>
                                        <Image src={listing.imageUrl} alt={listing.title} width={80} height={60} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{listing.title}</TableCell>
                                    <TableCell>{listing.location}</TableCell>
                                    <TableCell>{listing.price}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditStairspaceDialog listing={listing} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditStairspaceDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{listing.title}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(listing.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
