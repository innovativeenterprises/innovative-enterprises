
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
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { useStairspaceData } from "@/hooks/use-global-store-data";
import { type StairspaceListing, StairspaceListingSchema } from "@/lib/stairspace.schema";

const FormSchema = StairspaceListingSchema.pick({
    title: true,
    location: true,
    price: true,
    imageUrl: true,
    aiHint: true,
    tags: true,
}).extend({
    tags: z.string().describe("Comma-separated tags")
});

type StairspaceValues = z.infer<typeof FormSchema>;

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
        resolver: zodResolver(FormSchema),
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
                            <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., Retail, Pop-up, High Traffic" {...field} /></FormControl><FormMessage /></FormItem>
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

export default function StairspaceListingGrid({ stairspaceListings, setStairspaceListings, isClient }: { stairspaceListings: StairspaceListing[], setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => void, isClient: boolean }) {
    const { toast } = useToast();

    const handleSave = (values: StairspaceValues, id?: number) => {
        const listingData = {
            ...values,
            tags: values.tags.split(',').map(tag => tag.trim()),
        };

        if (id !== undefined) {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {!isClient ? (
                        Array.from({ length: 4 }).map((_, index) => (
                           <Skeleton key={index} className="h-64 w-full" />
                        ))
                    ) : (
                        stairspaceListings.map(listing => (
                           <Card key={listing.id}>
                               <div className="relative h-32 w-full">
                                   <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover rounded-t-lg" />
                               </div>
                               <CardHeader>
                                   <CardTitle className="text-base truncate">{listing.title}</CardTitle>
                                   <CardDescription className="text-xs">{listing.location}</CardDescription>
                               </CardHeader>
                               <CardContent className="text-sm font-semibold">{listing.price}</CardContent>
                               <CardFooter className="flex justify-end gap-2">
                                     <AddEditStairspaceDialog listing={listing} onSave={handleSave}>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </AddEditStairspaceDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{listing.title}".</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(listing.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                               </CardFooter>
                           </Card>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
