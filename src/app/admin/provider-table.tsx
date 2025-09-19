
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
import { useToast } from "@/components/ui/use-toast";
import type { Provider } from "@/lib/providers";
import { ProviderSchema } from "@/lib/providers.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Link as LinkIcon, CalendarIcon } from "lucide-react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { DueDateDisplay } from "@/components/due-date-display";
import { useProvidersData } from '@/hooks/use-global-store-data';

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

export default function ProviderTable() {
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
                                    {p.subscriptionExpiry && <DueDateDisplay date={new Date(p.subscriptionExpiry).toISOString()} prefix="Expires:" />}
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
