
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { BeautyService } from "@/lib/beauty-services.schema";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Hair', 'Nails', 'Skincare', 'Massage', 'Makeup']),
  price: z.coerce.number().positive("Price must be a positive number"),
  duration: z.coerce.number().int().positive("Duration must be a positive number of minutes"),
});
type ServiceValues = z.infer<typeof ServiceSchema>;

const AddEditServiceDialog = ({ 
    service, 
    onSave,
    agencyId,
    children
}: { 
    service?: BeautyService, 
    onSave: (values: ServiceValues, id?: string) => void,
    agencyId: string,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const form = useForm<ServiceValues>({
        resolver: zodResolver(ServiceSchema),
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset(service || { name: '', category: 'Hair', price: 0, duration: 30 });
        }
    }, [service, form, isOpen]);

    const onSubmit: SubmitHandler<ServiceValues> = (data) => {
        onSave(data, service?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{service ? "Edit" : "Add"} Service</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Service Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Hair">Hair</SelectItem>
                                    <SelectItem value="Nails">Nails</SelectItem>
                                    <SelectItem value="Skincare">Skincare</SelectItem>
                                    <SelectItem value="Massage">Massage</SelectItem>
                                    <SelectItem value="Makeup">Makeup</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem><FormLabel>Duration (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Service</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function ServiceTable({ services, setServices }: { services: BeautyService[], setServices: (updater: (prev: BeautyService[]) => BeautyService[]) => void }) {
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSave = (values: ServiceValues, id?: string) => {
        if (id) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...values, agencyId: s.agencyId } : s));
            toast({ title: "Service updated." });
        } else {
            const newService: BeautyService = { ...values, id: `svc_${Date.now()}`, agencyId: services[0]?.agencyId || '' };
            setServices(prev => [...prev, newService]);
            toast({ title: "Service added." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Service Menu</CardTitle>
                    <CardDescription>Manage the services offered by your center.</CardDescription>
                </div>
                 <AddEditServiceDialog onSave={handleSave} agencyId={services[0]?.agencyId || ''}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Service</Button>
                </AddEditServiceDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                        ) : services.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground h-24">No services added yet.</TableCell></TableRow>
                        ) : (
                            services.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.category}</TableCell>
                                    <TableCell>{service.duration} min</TableCell>
                                    <TableCell className="text-right font-mono">OMR {service.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

