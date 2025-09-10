

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
import type { Provider } from "@/lib/providers";
import { ProviderSchema } from "@/lib/providers.schema";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Link as LinkIcon, CalendarIcon, Upload, Star } from "lucide-react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useProvidersData } from "@/hooks/use-global-store-data";

type ProviderValues = z.infer<typeof ProviderSchema>;

const CsvImportSchema = z.object({
  csvFile: z.any().refine(file => file?.length == 1, 'A CSV file is required.'),
});
type CsvImportValues = z.infer<typeof CsvImportSchema>;

const AddEditProviderDialog = ({ 
    provider, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    provider?: Provider, 
    onSave: (values: ProviderValues & { subscriptionExpiry: string }, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const defaultExpiry = provider?.subscriptionExpiry ? new Date(provider.subscriptionExpiry) : undefined;
    
    const form = useForm<ProviderValues>({
        resolver: zodResolver(ProviderSchema),
        defaultValues: {
            ...provider,
            subscriptionExpiry: defaultExpiry,
        }
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
        onSave({
            ...data,
            subscriptionExpiry: data.subscriptionExpiry ? data.subscriptionExpiry.toISOString() : '',
        }, provider?.id);
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

const ImportProvidersDialog = ({ onImport, children }: { onImport: (providers: Provider[]) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<CsvImportValues>({ resolver: zodResolver(CsvImportSchema) });
    const { toast } = useToast();

    const handleFileParse = (file: File): Promise<Provider[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const rows = text.split('\n').slice(1); // remove header
                const newProviders: Provider[] = rows.map((row, index) => {
                    const columns = row.split(',');
                    if (columns.length !== 8) {
                        console.warn(`Skipping malformed row ${index + 2}: ${row}`);
                        return null;
                    }
                    return {
                        id: `prov_bulk_${new Date().getTime()}_${index}`,
                        name: columns[0]?.trim(),
                        email: columns[1]?.trim(),
                        services: columns[2]?.trim(),
                        status: columns[3]?.trim() as any,
                        portfolio: columns[4]?.trim(),
                        notes: columns[5]?.trim(),
                        subscriptionTier: columns[6]?.trim() as any,
                        subscriptionExpiry: columns[7]?.trim(),
                    };
                }).filter((p): p is Provider => p !== null && p.name !== '');
                resolve(newProviders);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    const onSubmit: SubmitHandler<CsvImportValues> = async (data) => {
        try {
            const newProviders = await handleFileParse(data.csvFile[0]);
            onImport(newProviders);
            toast({ title: "Import Successful", description: `${newProviders.length} providers have been added.` });
            setIsOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: "Import Failed", description: "Could not parse the CSV file. Please check the format.", variant: 'destructive' });
        }
    };
    
    const handleDownloadTemplate = () => {
        const headers = ["name", "email", "services", "status", "portfolio", "notes", "subscriptionTier", "subscriptionExpiry"];
        const csvContent = headers.join(",") + "\n";
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "provider_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Providers from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to add multiple providers at once. Ensure the file has the correct columns.
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
                            <Button type="submit">Import Providers</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const SubscriptionStatus = ({ tier, expiry }: { tier: string, expiry: string }) => {
    const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!expiry) {
            setDaysUntilExpiry(null);
            return;
        }
        const expiryDate = new Date(expiry);
        const now = new Date();
        const diffTime = expiryDate.getTime() - now.getTime();
        setDaysUntilExpiry(Math.ceil(diffTime / (1000 * 3600 * 24)));
    }, [expiry]);
    

    if (tier === 'None') {
        return <Badge variant="secondary">No Subscription</Badge>;
    }
    if (tier === 'Lifetime') {
        return <Badge className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30 flex items-center gap-1"><Star className="h-3 w-3"/>Lifetime</Badge>;
    }
    
    if (!isClient) {
        return <Badge variant="secondary">Loading...</Badge>;
    }

    if (daysUntilExpiry === null) {
         return <Badge variant="outline">{tier}</Badge>;
    }
    
    const totalDuration = tier === 'Yearly' ? 365 : 30;
    const progressValue = Math.max(0, (daysUntilExpiry / totalDuration) * 100);

    return (
        <div className="w-full min-w-[150px]">
            <div className="flex justify-between items-center mb-1">
                <Badge variant="outline">{tier}</Badge>
                <div className="text-xs text-muted-foreground">
                    {daysUntilExpiry > 0 ? `Expires in ${Math.ceil(daysUntilExpiry)} days` : 'Expired'}
                </div>
            </div>
            <Progress value={progressValue} className="h-2 [&>div]:bg-green-500" />
        </div>
    )
}

export default function ProviderTable({ 
    providers, 
    setProviders,
    isClient,
}: { 
    providers: Provider[], 
    setProviders: (updater: (providers: Provider[]) => void) => void,
    isClient: boolean,
}) {
    const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleOpenDialog = (provider?: Provider) => {
        setSelectedProvider(provider);
        setIsDialogOpen(true);
    }

    const handleSave = (values: ProviderValues & { subscriptionExpiry: string }, id?: string) => {
        if (id) {
            setProviders(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Provider updated successfully." });
        } else {
            const newProvider: Provider = {
                ...values,
                id: `prov_${values.name.replace(/\s+/g, '_').toLowerCase()}`,
            };
            setProviders(prev => [newProvider, ...prev]);
            toast({ title: "Provider added successfully." });
        }
    };
    
    const handleBulkImport = (newProviders: Provider[]) => {
        setProviders(prev => [...newProviders, ...prev]);
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
                    <ImportProvidersDialog onImport={handleBulkImport}>
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import from CSV</Button>
                    </ImportProvidersDialog>
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
                            <TableHead>Subscription</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24">
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            providers.map(p => (
                            <TableRow key={p.id} onClick={() => router.push(`/admin/network/${p.id}`)} className="cursor-pointer">
                                <TableCell className="font-medium">
                                    <p>{p.name}</p>
                                    <p className="text-sm text-muted-foreground">{p.email}</p>
                                </TableCell>
                                <TableCell>{p.services}</TableCell>
                                <TableCell>{getStatusBadge(p.status)}</TableCell>
                                <TableCell>
                                    <SubscriptionStatus tier={p.subscriptionTier} expiry={p.subscriptionExpiry} />
                                </TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(p)}><Edit className="h-4 w-4" /></Button>
                                        {p.portfolio && (
                                            <Button asChild variant="ghost" size="icon">
                                                <a href={p.portfolio} target="_blank" rel="noopener noreferrer"><LinkIcon /></a>
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this provider from your network.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
