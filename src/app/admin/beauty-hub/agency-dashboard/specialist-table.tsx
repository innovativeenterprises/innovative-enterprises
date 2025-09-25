
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
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { Skeleton } from '@/components/ui/skeleton';
import type { BeautySpecialist } from "@/lib/beauty-specialists.schema";
import { useGlobalStore } from "@/lib/global-store.tsx";

const SpecialistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialty: z.string().min(3, "Specialty is required"),
  photo: z.string().url("A valid photo URL is required"),
});
type SpecialistValues = z.infer<typeof SpecialistSchema>;

const AddEditSpecialistDialog = ({ 
    specialist, 
    onSave,
    agencyId,
    children
}: { 
    specialist?: BeautySpecialist, 
    onSave: (values: SpecialistValues, id?: string) => void,
    agencyId: string,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const form = useForm<SpecialistValues>({
        resolver: zodResolver(SpecialistSchema),
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset(specialist || { name: '', specialty: '', photo: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}` });
        }
    }, [specialist, form, isOpen]);

    const onSubmit: SubmitHandler<SpecialistValues> = (data) => {
        onSave(data, specialist?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{specialist ? "Edit" : "Add"} Specialist</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="specialty" render={({ field }) => (
                            <FormItem><FormLabel>Specialty</FormLabel><FormControl><Input placeholder="e.g., Hair Stylist, Nail Technician" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="photo" render={({ field }) => (
                            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         {form.watch('photo') && (
                            <Image src={form.watch('photo')} alt="Photo Preview" width={80} height={80} className="rounded-full object-cover" />
                         )}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Specialist</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function SpecialistTable({ agencyId, specialists, setSpecialists }: { 
    agencyId: string, 
    specialists: BeautySpecialist[], 
    setSpecialists: (updater: (prev: BeautySpecialist[]) => BeautySpecialist[]) => void 
}) {
    const isClient = useGlobalStore(s => s.isClient);
    const { toast } = useToast();

    const handleSave = (values: SpecialistValues, id?: string) => {
        if (id) {
            setSpecialists(prev => prev.map(s => s.id === id ? { ...s, ...values, agencyId } : s));
            toast({ title: "Specialist updated." });
        } else {
            const newSpecialist: BeautySpecialist = { ...values, id: `spec_${Date.now()}`, agencyId };
            setSpecialists(prev => [...prev, newSpecialist]);
            toast({ title: "Specialist added." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Manage your team of specialists.</CardDescription>
                </div>
                <AddEditSpecialistDialog onSave={handleSave} agencyId={agencyId}>
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Specialist</Button>
                </AddEditSpecialistDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Specialist</TableHead>
                            <TableHead>Specialty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow><TableCell colSpan={2}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                        ) : specialists.length === 0 ? (
                            <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground h-24">No specialists added yet.</TableCell></TableRow>
                        ) : (
                            specialists.map(specialist => (
                                <TableRow key={specialist.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={specialist.photo} alt={specialist.name} width={40} height={40} className="rounded-full object-cover" />
                                            <p className="font-medium">{specialist.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{specialist.specialty}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
