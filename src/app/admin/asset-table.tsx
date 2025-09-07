
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
import type { Asset } from "@/lib/assets";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Upload, Image as ImageIcon, Search } from "lucide-react";
import Image from 'next/image';
import { store } from "@/lib/global-store";
import { Skeleton } from "@/components/ui/skeleton";

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const useAssetsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        assets: data.assets,
        setAssets: (updater: (assets: Asset[]) => Asset[]) => {
            const currentAssets = store.get().assets;
            const newAssets = updater(currentAssets);
            store.set(state => ({ ...state, assets: newAssets }));
        }
    };
};


const AssetSchema = z.object({
  name: z.string().min(3, "Asset name is required"),
  type: z.enum(['Heavy Machinery', 'Power Tools', 'Vehicles', 'Scaffolding', 'Server', 'Laptop', 'Workstation', 'Networking', 'Storage', 'Peripheral']),
  specs: z.string().min(5, "Specifications are required"),
  monthlyPrice: z.coerce.number().min(1, "Monthly price is required"),
  status: z.enum(['Available', 'Rented', 'Maintenance']),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
  aiHint: z.string().min(2, "AI hint is required"),
}).refine(data => data.imageUrl || (data.imageFile && data.imageFile.length > 0), {
    message: "Either an Image URL or an Image File is required.",
    path: ["imageUrl"], // Point error to imageUrl field
});

type AssetValues = z.infer<typeof AssetSchema> & { image: string };


const AddEditAssetDialog = ({ 
    asset, 
    onSave,
    children,
}: { 
    asset?: Asset, 
    onSave: (values: AssetValues, id?: string) => void,
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(asset?.image || null);

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            name: asset?.name || "",
            type: asset?.type || 'Laptop',
            specs: asset?.specs || "",
            monthlyPrice: asset?.monthlyPrice || 0,
            status: asset?.status || 'Available',
            aiHint: asset?.aiHint || "",
            imageUrl: asset?.image || "",
        },
    });
    
     const watchImageUrl = form.watch('imageUrl');
     const watchImageFile = form.watch('imageFile');

    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            fileToDataURI(watchImageFile[0]).then(setImagePreview);
        } else if (watchImageUrl) {
            setImagePreview(watchImageUrl);
        } else {
             setImagePreview(asset?.image || null);
        }
    }, [watchImageUrl, watchImageFile, asset?.image]);

     useEffect(() => {
        if(isOpen) {
           form.reset({ 
                name: asset?.name || "",
                type: asset?.type || 'Laptop',
                specs: asset?.specs || "",
                monthlyPrice: asset?.monthlyPrice || 0,
                status: asset?.status || 'Available',
                aiHint: asset?.aiHint || "",
                imageUrl: asset?.image || "",
                imageFile: undefined,
            });
            setImagePreview(asset?.image || null);
        }
    }, [asset, form, isOpen]);
    
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
        form.reset();
        setImagePreview(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

const CsvImportSchema = z.object({
  csvFile: z.any().refine(file => file?.length == 1, 'A CSV file is required.'),
});
type CsvImportValues = z.infer<typeof CsvImportSchema>;

const ImportAssetsDialog = ({ onImport, children }: { onImport: (assets: Asset[]) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<CsvImportValues>({ resolver: zodResolver(CsvImportSchema) });
    const { toast } = useToast();

    const handleFileParse = (file: File): Promise<Asset[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const rows = text.split('\n').slice(1); // remove header
                const newAssets: Asset[] = rows.map((row, index) => {
                    const columns = row.split(',');
                    if (columns.length !== 7) {
                        console.warn(`Skipping malformed row ${index + 2}: ${row}`);
                        return null;
                    }
                    return {
                        id: `asset_bulk_${columns[0]?.trim()?.replace(/\s+/g, '_')}_${index}`,
                        name: columns[0]?.trim(),
                        type: columns[1]?.trim() as any,
                        specs: columns[2]?.trim(),
                        monthlyPrice: parseFloat(columns[3]?.trim()) || 0,
                        status: columns[4]?.trim() as any,
                        image: columns[5]?.trim(),
                        aiHint: columns[6]?.trim(),
                    };
                }).filter((p): p is Asset => p !== null && p.name !== '');
                resolve(newAssets);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    const onSubmit: SubmitHandler<CsvImportValues> = async (data) => {
        try {
            const newAssets = await handleFileParse(data.csvFile[0]);
            onImport(newAssets);
            toast({ title: "Import Successful", description: `${newAssets.length} assets have been added.` });
            setIsOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: "Import Failed", description: "Could not parse the CSV file. Please check the format.", variant: 'destructive' });
        }
    };
    
    const handleDownloadTemplate = () => {
        const headers = ["name", "type", "specs", "monthlyPrice", "status", "image", "aiHint"];
        const csvContent = headers.join(",") + "\n";
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "asset_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Assets from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to add multiple assets at once. Ensure the file has the correct columns.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="outline" onClick={handleDownloadTemplate}>Download Template</Button>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="csvFile" render={({ field }) => (
                            <FormItem><FormLabel>CSV File</FormLabel><FormControl><Input type="file" accept=".csv" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Import Assets</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function AssetTable({
    assets,
    setAssets,
}: {
    assets: Asset[],
    setAssets: (updater: (assets: Asset[]) => void) => void,
}) {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const handleSave = (values: AssetValues, id?: string) => {
        if (id) {
            setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, ...values } : asset));
            toast({ title: "Asset updated successfully." });
        } else {
            const newAsset: Asset = {
                ...values,
                id: `asset_${values.name.replace(/\s+/g, '_').toLowerCase()}`,
            };
            setAssets(prev => [newAsset, ...prev]);
            toast({ title: "Asset added successfully." });
        }
    };
    
    const handleBulkImport = (newAssets: Asset[]) => {
        setAssets(prev => [...newAssets, ...prev]);
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
        return assets.filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.specs.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [assets, searchTerm]);


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
                     <AddEditAssetDialog onSave={handleSave}>
                        <Button className="shrink-0"><PlusCircle /> Add Asset</Button>
                    </AddEditAssetDialog>
                </div>
            </CardHeader>
            <CardContent>
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
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Skeleton className="w-full h-10" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAssets.map(asset => (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                         <AddEditAssetDialog asset={asset} onSave={handleSave}>
                                            <div className="p-1 -m-1 rounded-md hover:bg-muted w-fit cursor-pointer">
                                                <Image src={asset.image} alt={asset.name} width={60} height={45} className="rounded-md object-cover" />
                                            </div>
                                        </AddEditAssetDialog>
                                    </TableCell>
                                    <TableCell>
                                        <AddEditAssetDialog asset={asset} onSave={handleSave}>
                                            <div className="p-2 -m-2 rounded-md hover:bg-muted cursor-pointer">
                                                <p className="font-medium">{asset.name}</p>
                                                <p className="text-sm text-muted-foreground truncate max-w-xs">{asset.specs}</p>
                                            </div>
                                        </AddEditAssetDialog>
                                    </TableCell>
                                    <TableCell>{asset.type}</TableCell>
                                    <TableCell>OMR {asset.monthlyPrice.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
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

