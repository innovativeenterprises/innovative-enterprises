
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Asset } from "@/lib/assets";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";
import { store } from "@/lib/global-store";

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
  type: z.enum(['Server', 'Laptop', 'Workstation', 'Networking', 'Storage']),
  specs: z.string().min(5, "Specifications are required"),
  monthlyPrice: z.coerce.number().min(1, "Monthly price is required"),
  status: z.enum(['Available', 'Rented', 'Maintenance']),
  image: z.string().min(1, "An image is required"),
  aiHint: z.string().min(2, "AI hint is required"),
});
type AssetValues = z.infer<typeof AssetSchema>;


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
    const form = useForm({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            name: asset?.name || "",
            type: asset?.type || 'Laptop',
            specs: asset?.specs || "",
            monthlyPrice: asset?.monthlyPrice || 0,
            status: asset?.status || 'Available',
            aiHint: asset?.aiHint || "",
            imageFile: undefined,
            imageUrl: asset?.image.startsWith('http') || asset?.image.startsWith('data:') ? asset.image : "",
            useUrl: asset?.image.startsWith('http') || asset?.image.startsWith('data:') || false,
        },
    });

     useEffect(() => {
        if(isOpen) {
           const isUrl = asset?.image?.startsWith('http') || asset?.image.startsWith('data:') || false;
           form.reset({ 
                name: asset?.name || "",
                type: asset?.type || 'Laptop',
                specs: asset?.specs || "",
                monthlyPrice: asset?.monthlyPrice || 0,
                status: asset?.status || 'Available',
                aiHint: asset?.aiHint || "",
                imageFile: undefined,
                imageUrl: isUrl ? asset.image : "",
                useUrl: isUrl,
            });
        }
    }, [asset, form, isOpen]);
    
    const watchUseUrl = form.watch('useUrl');

    const onSubmit: SubmitHandler<any> = async (data) => {
        let imageValue = asset?.image || "";
        
        if(data.useUrl) {
            if(data.imageUrl) imageValue = data.imageUrl;
        } else {
            if (data.imageFile && data.imageFile.length > 0) {
                const file = data.imageFile[0];
                imageValue = await fileToDataURI(file);
            }
        }
        
        if (!imageValue) {
            form.setError('imageUrl', { message: 'Please provide either an image file or a URL.' });
            return;
        }

        onSave({ 
            ...data,
            image: imageValue,
        }, asset?.id);
        form.reset();
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
                                <FormItem><FormLabel>Asset Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Server">Server</SelectItem><SelectItem value="Laptop">Laptop</SelectItem><SelectItem value="Workstation">Workstation</SelectItem><SelectItem value="Networking">Networking</SelectItem><SelectItem value="Storage">Storage</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="Rented">Rented</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="monthlyPrice" render={({ field }) => (
                                <FormItem><FormLabel>Price/Month (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                         <FormField control={form.control} name="useUrl" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Use Image URL</FormLabel>
                                </div>
                            </FormItem>
                        )}/>

                        <div className="grid grid-cols-2 gap-4">
                           {watchUseUrl ? (
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                           ) : (
                                <FormField control={form.control} name="imageFile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                           )}
                           
                            <FormField control={form.control} name="aiHint" render={({ field }) => (
                                <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g., server rack" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
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

export default function AssetTable({
    assets,
    setAssets,
}: {
    assets: Asset[],
    setAssets: (updater: (assets: Asset[]) => Asset[]) => void,
}) {
    const { toast } = useToast();
    
    const handleSave = (values: AssetValues, id?: string) => {
        if (id) {
            setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, ...values } : asset));
            toast({ title: "Asset updated successfully." });
        } else {
            const newAsset: Asset = {
                ...values,
                id: `asset_${Date.now()}`,
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


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>InfraRent Asset Management</CardTitle>
                    <CardDescription>Manage IT hardware and infrastructure available for rent.</CardDescription>
                </div>
                 <AddEditAssetDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Asset</Button>
                </AddEditAssetDialog>
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
                        {assets.map(asset => (
                            <TableRow key={asset.id} className="cursor-pointer">
                                <TableCell>
                                     <AddEditAssetDialog asset={asset} onSave={handleSave}>
                                        <div className="p-1 -m-1 rounded-md hover:bg-muted w-fit">
                                            <Image src={asset.image} alt={asset.name} width={60} height={45} className="rounded-md object-cover" />
                                        </div>
                                    </AddEditAssetDialog>
                                </TableCell>
                                <TableCell>
                                    <AddEditAssetDialog asset={asset} onSave={handleSave}>
                                        <div className="p-2 -m-2 rounded-md hover:bg-muted">
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
