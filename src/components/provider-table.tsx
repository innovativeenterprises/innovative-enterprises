
'use client';

import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
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
import type { Provider } from "@/lib/providers.schema";
import { ProviderSchema } from "@/lib/providers.schema";
import { getStatusBadge } from "@/components/status-badges";
import { PlusCircle, Edit, Trash2, ArrowRight } from "lucide-react";
import { DueDateDisplay } from "@/components/due-date-display";
import { useProvidersData } from "@/hooks/use-data-hooks";
import { z } from 'zod';

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
        defaultValues: provider || {
            name: "",
            email: "",
            services: "",
            status: "Pending Review",
            subscriptionTier: 'None',
        },
    });

    React.useEffect(() => {
        if(isOpen) {
           form.reset(provider || {
                name: "",
                email: "",
                services: "",
                status: "Pending Review",
                subscriptionTier: 'None',
           });
        }
    }, [provider, form, isOpen]);

    const onSubmit: SubmitHandler<ProviderValues> = async (data) => {
        onSave(data, provider?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{provider ? "Edit" : "Add"} Provider</DialogTitle>
                    <DialogDescription>Manage the details for this service provider or partner.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="services" render={({ field }) => (
                            <FormItem><FormLabel>Services Offered</FormLabel><FormControl><Input placeholder="e.g., Web Development, UI/UX Design" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Vetted">Vetted</SelectItem><SelectItem value="Pending Review">Pending Review</SelectItem><SelectItem value="On Hold">On Hold</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
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
    );
}

export default function ProviderTable() {
    const { data: providers, setData: setProviders } = useProvidersData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(undefined);

    const openDialog = (provider?: Provider) => {
        setSelectedProvider(provider);
        setIsDialogOpen(true);
    }
    
    const handleSave = (values: ProviderValues, id?: string) => {
        if (id) {
            setProviders(prev => prev.map(p => (p.id === id ? { ...p, ...values } as Provider : p)));
            toast({ title: "Provider updated successfully." });
        } else {
            const newProvider: Provider = { ...values, id: `prov_${Date.now()}` };
            setProviders(prev => [newProvider, ...prev]);
            toast({ title: "Provider added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setProviders(prev => prev.filter(p => p.id !== id));
        toast({ title: "Provider removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Providers & Partners</CardTitle>
                    <CardDescription>Manage all external service providers in your network.</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Provider
                </Button>
            </CardHeader>
            <CardContent>
                <AddEditProviderDialog 
                    isOpen={isDialogOpen} 
                    onOpenChange={setIsDialogOpen} 
                    provider={selectedProvider} 
                    onSave={handleSave}
                >
                    <div/>
                </AddEditProviderDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscription</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {providers.map(provider => (
                            <TableRow key={provider.id}>
                                <TableCell className="font-medium">{provider.name}</TableCell>
                                <TableCell>{provider.services}</TableCell>
                                <TableCell>{getStatusBadge(provider.status)}</TableCell>
                                <TableCell>
                                    <DueDateDisplay date={provider.subscriptionExpiry?.toString()} prefix="Expires:" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/network/${provider.id}`} legacyBehavior><ArrowRight /></Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(provider)}><Edit /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Provider?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{provider.name}" and all associated data.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(provider.id!)}>Delete</AlertDialogAction></AlertDialogFooter>
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
