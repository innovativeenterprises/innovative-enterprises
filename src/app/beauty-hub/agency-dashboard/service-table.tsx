
'use client';

import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { type BeautyService } from '@/lib/beauty-services';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ServiceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Hair', 'Nails', 'Skincare', 'Massage', 'Makeup']),
  price: z.coerce.number().positive("Price must be a positive number"),
  duration: z.coerce.number().positive("Duration in minutes is required"),
});
type ServiceValues = z.infer<typeof ServiceSchema>;


const AddEditServiceDialog = ({ 
    service, 
    onSave,
    children,
}: { 
    service?: BeautyService, 
    onSave: (values: ServiceValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ServiceValues>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: service || { name: "", category: "Hair", price: 0, duration: 30 },
    });

    const onSubmit: SubmitHandler<ServiceValues> = (data) => {
        onSave(data, service?.id);
        setIsOpen(false);
        form.reset();
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
                            <FormItem><FormLabel>Service Name</FormLabel><FormControl><Input placeholder="e.g., Classic Manicure" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Hair">Hair</SelectItem>
                                    <SelectItem value="Nails">Nails</SelectItem>
                                    <SelectItem value="Skincare">Skincare</SelectItem>
                                    <SelectItem value="Massage">Massage</SelectItem>
                                    <SelectItem value="Makeup">Makeup</SelectItem>
                                </SelectContent></Select><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="duration" render={({ field }) => (
                            <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
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
    const { toast } = useToast();

    const handleSave = (values: ServiceValues, id?: string) => {
        if (id) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: "Service updated." });
        } else {
            const newService = { ...values, id: `service_${Date.now()}` };
            setServices(prev => [newService, ...prev]);
            toast({ title: "Service added." });
        }
    };

    const handleDelete = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
        toast({ title: "Service removed.", variant: "destructive" });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Services & Pricing</CardTitle>
                    <CardDescription>Manage the services your center offers.</CardDescription>
                </div>
                 <AddEditServiceDialog onSave={handleSave}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
                </AddEditServiceDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                                <TableCell>{service.duration} mins</TableCell>
                                <TableCell className="text-right font-mono">OMR {service.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <AddEditServiceDialog service={service} onSave={handleSave}>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </AddEditServiceDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

