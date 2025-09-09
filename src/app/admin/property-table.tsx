
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/lib/properties";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Wand2, Loader2 } from "lucide-react";
import Image from 'next/image';
import { extractPropertyDetailsFromUrl } from '@/ai/flows/property-extraction';
import { Skeleton } from "@/components/ui/skeleton";
import { usePropertiesData } from "@/hooks/use-global-store-data";

const PropertySchema = z.object({
  title: z.string().min(5, "Title is required."),
  listingType: z.enum(['For Sale', 'For Rent']),
  propertyType: z.enum(['Villa', 'Apartment', 'Townhouse']),
  location: z.string().min(3, "Location is required."),
  price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number().int(),
  areaSqM: z.coerce.number().positive(),
  description: z.string().min(10, "Description is required."),
  status: z.enum(['Available', 'Sold', 'Rented']),
  buildingAge: z.string(),
  imageUrl: z.string().url("A valid image URL is required."),
  urlToScrape: z.string().url("A valid URL is required.").optional().or(z.literal('')),
});
type PropertyValues = z.infer<typeof PropertySchema>;

const AddEditPropertyDialog = ({ 
    property, 
    onSave,
    children,
}: { 
    property?: Property, 
    onSave: (values: PropertyValues, id?: string) => void,
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();

    const form = useForm<PropertyValues>({
        resolver: zodResolver(PropertySchema),
        defaultValues: property || {
            title: "",
            listingType: "For Sale",
            propertyType: "Villa",
            location: "",
            price: 0,
            bedrooms: 3,
            bathrooms: 4,
            areaSqM: 300,
            description: "",
            status: "Available",
            buildingAge: "New",
            imageUrl: "https://picsum.photos/seed/newprop/600/400",
        },
    });

    useEffect(() => {
        if(isOpen) {
           form.reset(property || { title: "", listingType: "For Sale", propertyType: "Villa", location: "", price: 0, bedrooms: 3, bathrooms: 4, areaSqM: 300, description: "", status: "Available", buildingAge: "New", imageUrl: "https://picsum.photos/seed/newprop/600/400" });
        }
    }, [property, form, isOpen]);

    const handleAnalyzeUrl = async () => {
        const url = form.getValues('urlToScrape');
        if (!url) {
            toast({ title: "Please enter a URL to analyze.", variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing URL...', description: 'Rami is scraping the page now. This may take a moment.' });

        try {
            const result = await extractPropertyDetailsFromUrl({ url });
            form.setValue('title', result.title || '');
            form.setValue('listingType', result.listingType as any || 'For Sale');
            form.setValue('propertyType', result.propertyType as any || 'Villa');
            form.setValue('location', result.location || '');
            form.setValue('price', result.price || 0);
            form.setValue('bedrooms', result.bedrooms || 0);
            form.setValue('bathrooms', result.bathrooms || 0);
            form.setValue('areaSqM', result.areaSqM || 0);
            form.setValue('description', result.description || '');
            toast({ title: "Analysis Complete", description: "Property details have been pre-filled from the URL." });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not extract details from the URL.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const onSubmit: SubmitHandler<PropertyValues> = async (data) => {
        onSave(data, property?.id);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>{property ? "Edit" : "Add"} Property Listing</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="bg-muted/50">
                             <CardContent className="p-4 pt-6 space-y-4">
                                 <FormField control={form.control} name="urlToScrape" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Import from URL</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input placeholder="https://www.example.com/property-listing" {...field} /></FormControl>
                                            <Button type="button" variant="secondary" onClick={handleAnalyzeUrl} disabled={isAnalyzing}>
                                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                Analyze & Pre-fill
                                            </Button>
                                        </div>
                                        <FormDescription>Paste a URL to a property listing page and let the AI extract the details.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>

                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormField control={form.control} name="listingType" render={({ field }) => (
                                <FormItem><FormLabel>Listing Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="For Sale">For Sale</SelectItem><SelectItem value="For Rent">For Rent</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="propertyType" render={({ field }) => (
                                <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Villa">Villa</SelectItem><SelectItem value="Apartment">Apartment</SelectItem><SelectItem value="Townhouse">Townhouse</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="Sold">Sold</SelectItem><SelectItem value="Rented">Rented</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="buildingAge" render={({ field }) => (
                                <FormItem><FormLabel>Building Age</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                             <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="areaSqM" render={({ field }) => (
                                <FormItem><FormLabel>Area (sq. m)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="bedrooms" render={({ field }) => (
                                <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="bathrooms" render={({ field }) => (
                                <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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

export default function PropertyTable({ properties, setProperties, isClient }: { properties: Property[], setProperties: (updater: (properties: Property[]) => void) => void, isClient: boolean }) {
    const { toast } = useToast();

    const handleSave = (values: PropertyValues, id?: string) => {
        const { urlToScrape, ...propertyData } = values; // Exclude scraper URL from save data
        if (id) {
            setProperties(prev => prev.map(p => p.id === id ? { ...p, ...propertyData } : p));
            toast({ title: "Property updated." });
        } else {
            const newProperty: Property = {
                ...propertyData,
                id: `prop_${Date.now()}`,
            };
            setProperties(prev => [newProperty, ...prev]);
            toast({ title: "Property added." });
        }
    };

    const handleDelete = (id: string) => {
        setProperties(prev => prev.filter(p => p.id !== id));
        toast({ title: "Property removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
            case "Sold": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Sold</Badge>;
            case "Rented": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Property Listings Management</CardTitle>
                    <CardDescription>Manage all property listings for the Smart Listing platform.</CardDescription>
                </div>
                <AddEditPropertyDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Property</Button>
                </AddEditPropertyDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price (OMR)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={6}>
                                        <Skeleton className="h-12 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            properties.map(prop => (
                                <TableRow key={prop.id}>
                                    <TableCell>
                                        <Image src={prop.imageUrl} alt={prop.title} width={80} height={60} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{prop.title}</p>
                                        <p className="text-sm text-muted-foreground">{prop.propertyType}</p>
                                    </TableCell>
                                    <TableCell>{prop.location}</TableCell>
                                    <TableCell className="font-mono">{prop.price.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(prop.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditPropertyDialog property={prop} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditPropertyDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{prop.title}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(prop.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
