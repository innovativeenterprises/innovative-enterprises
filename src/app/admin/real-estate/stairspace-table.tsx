
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import { PlusCircle, Edit, Trash2, Wand2, Loader2 } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { generateListingDescription } from '@/ai/flows/listing-description-generator';
import { useStairspaceListingsData } from "@/hooks/use-data-hooks";

const ListingSchema = z.object({
  title: z.string().min(3, "Title is required"),
  location: z.string().min(3, "Location is required"),
  price: z.string().min(3, "Price is required (e.g., OMR 25 / day)"),
  imageUrl: z.string().url("A valid image URL is required."),
  aiHint: z.string().min(2, "AI hint is required"),
  tags: z.string().min(2, "At least one tag is required (comma-separated)"),
  description: z.string().min(10, "Description is required"),
});
type ListingValues = z.infer<typeof ListingSchema>;

const AddEditListingDialog = ({ 
    listing, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    listing?: StairspaceListing, 
    onSave: (values: ListingValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const form = useForm<ListingValues>({ resolver: zodResolver(ListingSchema) });

    useEffect(() => {
        if(isOpen) {
            form.reset({
                ...listing,
                tags: listing?.tags.join(', ') || '',
                description: listing?.description || '',
            });
        }
    }, [listing, form, isOpen]);

    const handleGenerateDescription = async () => {
        const { title, location, tags } = form.getValues();
        if (!title || !location || !tags) {
            toast({ title: "Missing Details", description: "Please fill in Title, Location, and Tags first.", variant: 'destructive' });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateListingDescription({ title, location, tags });
            form.setValue('description', result.description);
            toast({ title: 'Description Generated!', description: 'The AI has written a description for you.' });
        } catch (e) {
            console.error(e);
            toast({ title: 'Error', description: 'Could not generate description.', variant: 'destructive' });
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit: SubmitHandler<ListingValues> = (data) => {
        onSave({ ...data }, listing?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{listing ? "Edit" : "Add"} StairSpace Listing</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="location" render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="price" render={({ field }) => <FormItem><FormLabel>Price</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="tags" render={({ field }) => <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><div className="relative"><FormControl><Textarea rows={4} {...field} /></FormControl><Button type="button" size="sm" variant="outline" className="absolute bottom-2 right-2" onClick={handleGenerateDescription} disabled={isGenerating}>{isGenerating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4"/>}</Button></div><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="aiHint" render={({ field }) => <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Listing</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function StairspaceTable({initialListings}: {initialListings: StairspaceListing[]}) {
    const { data: listings, setData: setListings, isClient } = useStairspaceListingsData(initialListings);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<StairspaceListing | undefined>(undefined);

    const handleOpenDialog = (listing?: StairspaceListing) => {
        setSelectedListing(listing);
        setIsDialogOpen(true);
    };

    const handleSave = (values: ListingValues, id?: string) => {
        const newListingData = { ...values, tags: values.tags.split(',').map(tag => tag.trim()) };
        if (id) {
            setListings(prev => prev.map(l => (l.id === id ? { ...l, ...newListingData } as StairspaceListing : l)));
            toast({ title: 'Listing updated.' });
        } else {
            const newListing = { ...newListingData, id: `stair_${Date.now()}` };
            setListings(prev => [newListing, ...prev]);
            toast({ title: 'Listing added.' });
        }
    };

    const handleDelete = (id: string) => {
        setListings(prev => prev.filter(l => l.id !== id));
        toast({ title: 'Listing removed.', variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>StairSpace Listings</CardTitle><CardDescription>Manage all micro-retail space listings.</CardDescription></div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4"/> Add Listing</Button>
            </CardHeader>
            <CardContent>
                 <AddEditListingDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    listing={selectedListing}
                    onSave={handleSave}
                >
                    <div />
                </AddEditListingDialog>
                <Table><TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Location</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>{!isClient ? <TableRow><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow> : (
                        listings.map(listing => <TableRow key={listing.id}><TableCell><Image src={listing.imageUrl} alt={listing.title} width={80} height={60} className="rounded-md object-cover" /></TableCell><TableCell className="font-medium">{listing.title}</TableCell><TableCell>{listing.location}</TableCell><TableCell>{listing.price}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(listing)}><Edit /></Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Listing?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{listing.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(listing.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></TableCell></TableRow>)
                    )}</TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
