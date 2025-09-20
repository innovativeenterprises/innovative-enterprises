
'use client';

import { useState, useEffect } from "react";
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
import type { Property } from "@/lib/properties.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Wand2, Loader2, ArrowRight, BarChart } from "lucide-react";
import Image from 'next/image';
import { extractPropertyDetailsFromUrl } from '@/ai/flows/property-extraction';
import { Skeleton } from "@/components/ui/skeleton";
import { generateListingDescription } from '@/ai/flows/listing-description-generator';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

// --- Property Table Logic ---
const PropertySchema = z.object({
  title: z.string().min(5, "Title is required."),
  listingType: z.enum(['For Sale', 'For Rent']),
  propertyType: z.enum(['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Industrial']),
  location: z.string().min(3, "Location is required."),
  price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number().int(),
  areaSqM: z.coerce.number().positive(),
  description: z.string().min(10, "Description is required."),
  status: z.enum(['Available', 'Sold', 'Rented']),
  buildingAge: z.string(),
  imageUrl: z.string().url("A valid image URL is required."),
});
type PropertyFormValues = z.infer<typeof PropertySchema>;

const AddEditPropertyDialog = ({ 
    property, 
    onSave,
    children 
}: { 
    property?: Property, 
    onSave: (values: PropertyFormValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();
    const [urlToScrape, setUrlToScrape] = useState('');

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(PropertySchema),
    });

    useEffect(() => {
        if(isOpen) {
           form.reset(property || { title: "", listingType: "For Sale", propertyType: "Villa", location: "", price: 0, bedrooms: 3, bathrooms: 4, areaSqM: 300, description: "", status: "Available", buildingAge: "New", imageUrl: "https://picsum.photos/seed/newprop/600/400" });
        }
    }, [property, form, isOpen]);

    const handleAnalyzeUrl = async () => {
        if (!urlToScrape) {
            toast({ title: "Please enter a URL to analyze.", variant: 'destructive' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing URL...', description: 'Rami is scraping the page now. This may take a moment.' });

        try {
            const result = await extractPropertyDetailsFromUrl({ url: urlToScrape });
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

    const onSubmit: SubmitHandler<PropertyFormValues> = async (data) => {
        onSave(data, property?.id);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader><DialogTitle>{property ? "Edit" : "Add"} Property Listing</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="bg-muted/50">
                             <CardContent className="p-4 pt-6 space-y-4">
                                 <div className="space-y-2">
                                    <FormLabel htmlFor="urlToScrape">Import from URL</FormLabel>
                                    <div className="flex gap-2">
                                        <Input id="urlToScrape" placeholder="https://www.example.com/property-listing" value={urlToScrape} onChange={(e) => setUrlToScrape(e.target.value)} />
                                        <Button type="button" variant="secondary" onClick={handleAnalyzeUrl} disabled={isAnalyzing}>
                                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                            Analyze & Pre-fill
                                        </Button>
                                    </div>
                                    <CardDescription>Paste a URL to a property listing page and let the AI extract the details.</CardDescription>
                                 </div>
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

function PropertyTable({ initialProperties }: { initialProperties: Property[] }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProp, setSelectedProp] = useState<Property | undefined>(undefined);
    const [properties, setProperties] = useState(initialProperties);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleOpenDialog = (prop?: Property) => {
      setSelectedProp(prop);
      setIsOpen(true);
    }

    const handleSave = (values: PropertyFormValues, id?: string) => {
        toast({ title: 'Action not implemented in prototype.' });
    };

    const handleDelete = (id: string) => {
        toast({ title: 'Action not implemented in prototype.', variant: 'destructive' });
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
                <AddEditPropertyDialog onSave={handleSave}><Button><PlusCircle /> Add Property</Button></AddEditPropertyDialog>
            </CardHeader>
            <CardContent>
                <AddEditPropertyDialog isOpen={isOpen} onOpenChange={setIsOpen} property={selectedProp} onSave={handleSave}><div/></AddEditPropertyDialog>
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
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}><TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                            ))
                        ) : (
                            properties.map(prop => (
                                <TableRow key={prop.id}>
                                    <TableCell><Image src={prop.imageUrl} alt={prop.title} width={80} height={60} className="rounded-md object-cover" data-ai-hint={prop.aiHint} /></TableCell>
                                    <TableCell><p className="font-medium">{prop.title}</p><p className="text-sm text-muted-foreground">{prop.propertyType}</p></TableCell>
                                    <TableCell>{prop.location}</TableCell>
                                    <TableCell className="font-mono">{prop.price.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(prop.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(prop)}><Edit /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{prop.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(prop.id!)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
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

// --- Stairspace Table Logic ---
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
}: { 
    listing?: StairspaceListing, 
    onSave: (values: ListingValues, id?: string) => void,
    children: React.ReactNode,
}) => {
    const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

function StairspaceTable({initialStairspaceListings}: {initialStairspaceListings: StairspaceListing[]}) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<StairspaceListing | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const openDialog = (listing?: StairspaceListing) => {
        setSelectedListing(listing);
        setIsOpen(true);
    };

    const handleSave = (values: ListingValues, id?: string) => {
        toast({ title: "Action not implemented in prototype." });
    };

    const handleDelete = (id: string) => {
        toast({ title: "Action not implemented in prototype.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>StairSpace Listings</CardTitle><CardDescription>Manage all micro-retail space listings.</CardDescription></div>
                <AddEditListingDialog onSave={handleSave}><Button><PlusCircle className="mr-2 h-4 w-4"/> Add Listing</Button></AddEditListingDialog>
            </CardHeader>
            <CardContent>
                <AddEditListingDialog isOpen={isOpen} onOpenChange={setIsOpen} listing={selectedListing} onSave={handleSave}><div/></AddEditListingDialog>
                <Table><TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Location</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>{!isClient ? <TableRow><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow> : (
                        initialStairspaceListings.map(listing => <TableRow key={listing.id}><TableCell><Image src={listing.imageUrl} alt={listing.title} width={80} height={60} className="rounded-md object-cover" /></TableCell><TableCell className="font-medium">{listing.title}</TableCell><TableCell>{listing.location}</TableCell><TableCell>{listing.price}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => openDialog(listing)}><Edit /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Listing?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{listing.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(listing.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></TableCell></TableRow>)
                    )}</TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---
export default function AdminRealEstatePage({ initialProperties, initialStairspaceListings }: { initialProperties: Property[], initialStairspaceListings: StairspaceListing[] }) {

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Real Estate Management</h1>
            <p className="text-muted-foreground">
                Manage property listings and utilize real estate AI tools.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>StairSpace Management</CardTitle>
                    <CardDescription>
                        Review new booking requests for your StairSpace listings.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/real-estate/stairspace">Manage Booking Requests <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>AI Property Valuator</CardTitle>
                    <CardDescription>
                       Use the AI-powered tool to get instant market valuations for properties.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/real-estate/property-valuator">Launch Valuator <BarChart className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties">Property Listings</TabsTrigger>
                <TabsTrigger value="stairspace">StairSpace Listings</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="mt-6">
                <PropertyTable initialProperties={initialProperties} />
            </TabsContent>
            <TabsContent value="stairspace" className="mt-6">
                <StairspaceTable initialStairspaceListings={initialStairspaceListings} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
