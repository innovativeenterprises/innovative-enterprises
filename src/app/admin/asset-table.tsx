
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import type { Asset } from "@/lib/assets.schema";
import { AssetSchema } from "@/lib/assets.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { useAssetsData } from "@/hooks/use-data-hooks";

const AddEditAssetDialog = ({ 
    asset, 
    onSave,
    children 
}: { 
    asset?: Asset, 
    onSave: (values: Asset, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<Asset>({
        resolver: zodResolver(AssetSchema),
    });

    useEffect(() => {
        if(isOpen) {
           form.reset(asset || { id: '', name: "", type: "Laptop", status: 'Available', specs: "", monthlyPrice: 0, image: "https://picsum.photos/seed/newasset/400/300", aiHint: "" });
        }
    }, [asset, form, isOpen]);

    const onSubmit: SubmitHandler<Asset> = async (data) => {
        onSave(data, asset?.id);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader><DialogTitle>{asset ? "Edit" : "Add"} Asset</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="specs" render={({ field }) => (
                            <FormItem><FormLabel>Specifications</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                             <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem><SelectItem value="Power Tools">Power Tools</SelectItem><SelectItem value="Vehicles">Vehicles</SelectItem><SelectItem value="Scaffolding">Scaffolding</SelectItem><SelectItem value="Server">Server</SelectItem><SelectItem value="Laptop">Laptop</SelectItem><SelectItem value="Workstation">Workstation</SelectItem><SelectItem value="Networking">Networking</SelectItem><SelectItem value="Storage">Storage</SelectItem><SelectItem value="Peripheral">Peripheral</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Available">Available</SelectItem><SelectItem value="Rented">Rented</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="monthlyPrice" render={({ field }) => (
                                <FormItem><FormLabel>Monthly Price (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                                <FormItem><FormLabel>Purchase Price (OMR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                       
                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input placeholder="e.g., construction crane" {...field} /></FormControl><FormMessage /></FormItem>
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

export default function AssetTable() {
    const { data: assets, setData: setAssets } = useAssetsData();
    const { toast } = useToast();

    const handleSave = (values: Asset, id?: string) => {
        if (id) {
            setAssets(prev => prev.map(p => (p.id === id ? { ...p, ...values } : p)));
            toast({ title: 'Asset updated.' });
        } else {
            const newAsset: Asset = { ...values, id: `asset_${Date.now()}` };
            setAssets(prev => [newAsset, ...prev]);
            toast({ title: 'Asset added.' });
        }
    };

    const handleDelete = (id: string) => {
        setAssets(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Asset removed.', variant: 'destructive' });
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
                    <CardTitle>Asset Management</CardTitle>
                    <CardDescription>Manage all rentable assets for the InfraRent platform.</CardDescription>
                </div>
                <AddEditAssetDialog onSave={handleSave}><Button><PlusCircle className="mr-2 h-4 w-4"/> Add Asset</Button></AddEditAssetDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price (OMR/mo)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.map(asset => (
                            <TableRow key={asset.id}>
                                <TableCell><Image src={asset.image} alt={asset.name} width={80} height={60} className="rounded-md object-cover" data-ai-hint={asset.aiHint} /></TableCell>
                                <TableCell><p className="font-medium">{asset.name}</p><p className="text-sm text-muted-foreground">{asset.specs}</p></TableCell>
                                <TableCell>{asset.type}</TableCell>
                                <TableCell className="font-mono">{asset.monthlyPrice.toLocaleString()}</TableCell>
                                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <AddEditAssetDialog asset={asset} onSave={handleSave}><Button variant="ghost" size="icon"><Edit /></Button></AddEditAssetDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{asset.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(asset.id!)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                        </div >
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
