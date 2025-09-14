
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { BeautyService, Specialist } from '@/lib/beauty-services';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { setBeautyServices } from '@/hooks/use-global-store-data';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const ServiceSchema = z.object({
    name: z.string().min(2, "Service name is required"),
    category: z.enum(['Hair', 'Nails', 'Skincare', 'Massage', 'Grooming']),
    duration: z.coerce.number().positive("Duration must be positive"),
    price: z.coerce.number().positive("Price must be positive"),
    description: z.string().min(10, "Description is required"),
    specialistIds: z.array(z.string()).min(1, "At least one specialist must be assigned."),
});
type ServiceValues = z.infer<typeof ServiceSchema>;

const AddEditServiceDialog = ({ 
    service, 
    onSave, 
    agencyId, 
    specialists, 
    children 
}: { 
    service?: BeautyService, 
    onSave: (values: ServiceValues, id?: string) => void, 
    agencyId: string, 
    specialists: Specialist[], 
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ServiceValues>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: service || { category: 'Hair', duration: 60 },
    });

    const onSubmit: SubmitHandler<ServiceValues> = (data) => {
        onSave(data, service?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader><DialogTitle>{service ? "Edit" : "Add"} Service</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Service Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Hair">Hair</SelectItem>
                                    <SelectItem value="Nails">Nails</SelectItem>
                                    <SelectItem value="Skincare">Skincare</SelectItem>
                                    <SelectItem value="Massage">Massage</SelectItem>
                                    <SelectItem value="Grooming">Grooming</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem><FormLabel>Duration (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="specialistIds" render={() => (
                            <FormItem>
                                <FormLabel>Assign Specialists</FormLabel>
                                {specialists.map(item => (
                                    <FormField key={item.id} control={form.control} name="specialistIds" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...field.value, item.id])
                                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.name} ({item.specialty})</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Service</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


export function ServiceTable({ services, specialists, agencyId }: { services: BeautyService[], specialists: Specialist[], agencyId: string }) {
    const { toast } = useToast();

    const handleSave = (values: ServiceValues, id?: string) => {
        const newService = { ...values, centerId: agencyId };
        if (id) {
            setBeautyServices(prev => prev.map(s => s.id === id ? { ...s, ...newService } : s));
            toast({ title: "Service Updated" });
        } else {
            setBeautyServices(prev => [...prev, { ...newService, id: `serv_${Date.now()}` }]);
            toast({ title: "Service Added" });
        }
    };
    
    const handleDelete = (id: string) => {
        setBeautyServices(prev => prev.filter(s => s.id !== id));
        toast({ title: "Service Removed", variant: 'destructive' });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Service Menu Management</CardTitle>
                    <CardDescription>Manage the services offered by your center.</CardDescription>
                </div>
                 <AddEditServiceDialog onSave={handleSave} specialists={specialists} agencyId={agencyId}>
                    <Button><PlusCircle /> Add Service</Button>
                </AddEditServiceDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Duration</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell>{service.category}</TableCell>
                                <TableCell className="text-right">{service.duration} min</TableCell>
                                <TableCell className="text-right font-mono">OMR {service.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                     <div className="flex justify-end gap-2">
                                        <AddEditServiceDialog service={service} onSave={handleSave} specialists={specialists} agencyId={agencyId}>
                                            <Button variant="ghost" size="icon"><Edit/></Button>
                                        </AddEditServiceDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action will permanently delete the "{service.name}" service.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(service.id)}>Delete</AlertDialogAction>
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
