'use client';

import { useState, useEffect, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Provider } from "@/lib/providers";
import { ProviderSchema } from "@/lib/providers.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Link as LinkIcon, CalendarIcon, Upload, Image as ImageIcon, Search } from "lucide-react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, fileToDataURI } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { DueDateDisplay } from "@/components/due-date-display";
import { useProvidersData, useAssetsData } from '@/hooks/use-global-store-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Asset } from "@/lib/assets.schema";
import Image from 'next/image';

type ProviderValues = z.infer<typeof ProviderSchema>;

const AddEditProviderDialog = ({ 
    provider, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    provider?: Provider, 
    onSave: (values: ProviderValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    
    const form = useForm<ProviderValues>({
        resolver: zodResolver(ProviderSchema),
    });

    useEffect(() => {
         if (isOpen) {
            form.reset({
                ...provider,
                subscriptionExpiry: provider?.subscriptionExpiry ? new Date(provider.subscriptionExpiry) : undefined,
            });
         }
    }, [provider, form, isOpen]);

    const onSubmit: SubmitHandler<ProviderValues> = (data) => {
        onSave(data, provider?.id);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{provider ? "Edit" : "Add"} Provider</DialogTitle>
                    <DialogDescription>
                        {provider ? "Update the details for this provider." : "Enter the details for the new provider."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="services" render={({ field }) => (
                            <FormItem><FormLabel>Services Offered</FormLabel><FormControl><Input placeholder="e.g., Web Development, Graphic Design" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="portfolio" render={({ field }) => (
                            <FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Vetted">Vetted</SelectItem>
                                        <SelectItem value="Pending Review">Pending Review</SelectItem>
                                        <SelectItem value="On Hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subscriptionTier" render={({ field }) => (
                                <FormItem><FormLabel>Subscription Tier</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="None">None</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                        <SelectItem value="Lifetime">Lifetime</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField
                            control={form.control}
                            name="subscriptionExpiry"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Subscription Expiry</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Internal Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Provider</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function ProviderTable() {
    const { providers, setProviders, isClient } = useProvidersData();
    const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    const handleOpenDialog = (provider?: Provider) => {
        setSelectedProvider(provider);
        setIsDialogOpen(true);
    }
    
     const handleRowClick = (providerId?: string) => {
        if (providerId) {
            router.push(`/admin/network/${providerId}`);
        }
    };

    const handleSave = (values: ProviderValues, id?: string) => {
        const providerData = {
            ...values,
            subscriptionExpiry: values.subscriptionExpiry,
        };

        if (id) {
            setProviders(prev => prev.map(p => p.id === id ? { ...p, ...providerData } : p));
            toast({ title: "Provider updated successfully." });
        } else {
            const newProvider: Provider = {
                ...providerData,
                id: `prov_${values.name.replace(/\s+/g, '_').toLowerCase()}`,
            };
            setProviders(prev => [newProvider, ...prev]);
            toast({ title: "Provider added successfully." });
        }
    };
    
    const handleDelete = (id: string) => {
        setProviders(prev => prev.filter(p => p.id !== id));
        toast({ title: "Provider removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Vetted": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Vetted</Badge>;
            case "Pending Review": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending Review</Badge>;
            case "On Hold": return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">On Hold</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Provider Management</CardTitle>
                    <CardDescription>Manage freelancers, subcontractors, and service providers.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleOpenDialog()}><PlusCircle /> Add Provider</Button>
                </div>
            </CardHeader>
            <CardContent>
                <AddEditProviderDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    provider={selectedProvider}
                    onSave={handleSave}
                >
                    <div />
                </AddEditProviderDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscription Expiry</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={5}>
                                    <Skeleton className="h-12 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            providers.map(p => (
                            <TableRow key={p.id} onClick={() => handleRowClick(p.id)} className="cursor-pointer">
                                <TableCell className="font-medium">
                                    <p>{p.name}</p>
                                    <p className="text-sm text-muted-foreground">{p.email}</p>
                                </TableCell>
                                <TableCell>{p.services}</TableCell>
                                <TableCell>{getStatusBadge(p.status)}</TableCell>
                                <TableCell>
                                    {p.subscriptionExpiry && <DueDateDisplay date={new Date(p.subscriptionExpiry).toISOString()} prefix="Expires:" warnDays={30} />}
                                </TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(p)} aria-label={`Edit ${"'" + p.name + "'"}`}><Edit className="h-4 w-4" /></Button>
                                        {p.portfolio && (
                                            <Button asChild variant="ghost" size="icon" aria-label={`View ${"'" + p.name + "'s portfolio"}`}>
                                                <a href={p.portfolio} target="_blank" rel="noopener noreferrer"><LinkIcon /></a>
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`}><Trash2 className="text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this provider from your network.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id!)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

const AssetSchema = z.object({
  name: z.string().min(3, "Asset name is required"),
  type: z.enum(['Heavy Machinery', 'Power Tools', 'Vehicles', 'Scaffolding', 'Server', 'Laptop', 'Workstation', 'Networking', 'Storage', 'Peripheral']),
  specs: z.string().min(5, "Specifications are required"),
  monthlyPrice: z.coerce.number().min(1, "Monthly price is required"),
  purchasePrice: z.coerce.number().optional(),
  status: z.enum(['Available', 'Rented', 'Maintenance']),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
  aiHint: z.string().min(2, "AI hint is required"),
}).refine(data => data.imageUrl || (data.imageFile && data.imageFile.length > 0), {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"],
});

type AssetValues = z.infer<typeof AssetSchema> & { image: string };


const AddEditAssetDialog = ({ 
    asset, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    asset?: Asset, 
    onSave: (values: AssetValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(asset?.image || null);

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
    });
    
     const watchImageUrl = form.watch('imageUrl');
     const watchImageFile = form.watch('imageFile');

    useEffect(() => {
        if (!isOpen) return;
        
        form.reset({
            name: asset?.name || "",
            type: asset?.type || 'Laptop',
            specs: asset?.specs || "",
            monthlyPrice: asset?.monthlyPrice || 0,
            purchasePrice: asset?.purchasePrice || 0,
            status: asset?.status || 'Available',
            aiHint: asset?.aiHint || "",
            imageUrl: asset?.image || "",
            imageFile: undefined,
        });
        setImagePreview(asset?.image || null);
    }, [isOpen, asset, form]);
    
    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            fileToDataURI(watchImageFile[0]).then(setImagePreview);
        } else if (watchImageUrl) {
            setImagePreview(watchImageUrl);
        } else {
             setImagePreview(null);
        }
    }, [watchImageUrl, watchImageFile]);
    
    const onSubmit: SubmitHandler<z.infer<typeof AssetSchema>> = async (data) => {
        let imageValue = "";
        
        if (data.imageFile && data.imageFile.length > 0) {
            imageValue = await fileToDataURI(data.imageFile[0]);
        } else if (data.imageUrl) {
            imageValue = data.imageUrl;
        }

        onSave({ 
            ...data,
            image: imageValue,
        }, asset?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{asset ? "Edit" : "Add"} Asset</DialogTitle>
                    <DialogDescription>
                        {asset ? "Update the details for this rental asset." : "Enter the details for a new rental asset."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="specs" render={({ field }) => (
                            <FormItem><FormLabel>Specifications</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                             <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Asset Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem>
                                    <SelectItem value="Power Tools">Power Tools</SelectItem>
                                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                                    <SelectItem value="Scaffolding">Scaffolding</SelectItem>
                                    <SelectItem value="Server">Server</SelectItem>
                                    <SelectItem value="Laptop">Laptop</SelectItem>
                                    <SelectItem value="Workstation">Workstation</SelectItem>
                                    <SelectItem value="Networking">Networking</SelectItem>
                                    <SelectItem value="Storage">Storage</SelectItem>
                                    <SelectItem value="Peripheral">Peripheral</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="Rented">Rented</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="monthlyPrice" render={({ field }) => (
                                <FormItem><FormLabel>Price/Month (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Asset Image</h4>
                                {imagePreview && (
                                    <div className="relative h-40 w-full rounded-md overflow-hidden border">
                                        <Image src={imagePreview} alt="Image Preview" fill className="object-contain"/>
                                    </div>
                                )}
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


                        <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g., server rack" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Asset</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function AssetTable() {
    const { assets, setAssets, isClient } = useAssetsData();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);

    const handleOpenDialog = (asset?: Asset) => {
        setSelectedAsset(asset);
        setIsDialogOpen(true);
    };

    
    const handleSave = (values: AssetValues, id?: string) => {
        if (id) {
            setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, ...values, image: values.image } : asset));
            toast({ title: "Asset updated successfully." });
        } else {
            const newAsset: Asset = {
                ...values,
                id: `asset_${values.name.replace(/\s+/g, '_').toLowerCase()}`,
                image: values.image,
            };
            setAssets(prev => [newAsset, ...prev]);
            toast({ title: "Asset added successfully." });
        }
    };
    
    const handleDelete = (id: string) => {
        setAssets(prev => prev.filter(asset => asset.id !== id));
        toast({ title: "Asset removed.", variant: "destructive" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
            case "Rented": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
            case "Maintenance": return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">Maintenance</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    const filteredAssets = useMemo(() => {
        if (!isClient) return [];
        return assets.filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.specs.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [assets, searchTerm, isClient]);


    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle>Asset Rental Management</CardTitle>
                    <CardDescription>Manage construction and IT hardware available for rent.</CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button className="shrink-0" onClick={() => handleOpenDialog()}><PlusCircle /> Add Asset</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <AddEditAssetDialog 
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    asset={selectedAsset}
                    onSave={handleSave}
                  >
                    <div />
                </AddEditAssetDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price/Month</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6}><Skeleton className="w-full h-12" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            filteredAssets.map(asset => (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                        <div className="p-1 -m-1 rounded-md">
                                            <Image src={asset.image} alt={asset.name} width={60} height={45} className="rounded-md object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="p-2 -m-2 rounded-md">
                                            <p className="font-medium">{asset.name}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-xs">{asset.specs}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{asset.type}</TableCell>
                                    <TableCell>OMR {asset.monthlyPrice.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(asset)}><Edit /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this asset.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(asset.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
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


export default function AdminNetworkPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Network Management</h1>
            <p className="text-muted-foreground">
                Manage your external network of providers and rental assets.
            </p>
        </div>

        <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="providers">Service Providers</TabsTrigger>
                <TabsTrigger value="assets">Rental Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="providers" className="mt-6">
                <ProviderTable />
            </TabsContent>
            <TabsContent value="assets" className="mt-6">
                <AssetTable />
            </TabsContent>
        </Tabs>

    </div>
  );
}