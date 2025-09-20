
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import type { Client, Testimonial } from "@/lib/clients.schema";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { useClientsData, useTestimonialsData } from "@/hooks/use-global-store-data";

const ClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logo: z.string().url("A valid logo URL is required"),
  aiHint: z.string().min(2, "AI hint is required"),
});
type ClientValues = z.infer<typeof ClientSchema>;

const TestimonialSchema = z.object({
  quote: z.string().min(10, "Quote is required"),
  author: z.string().min(2, "Author is required"),
  company: z.string().min(2, "Company is required"),
  avatarId: z.string().min(1, "Avatar ID is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;

const AddEditClientDialog = ({ client, onSave, children }: { client?: Client, onSave: (values: ClientValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ClientValues>({
        resolver: zodResolver(ClientSchema),
    });

    useEffect(() => {
        if(isOpen) form.reset(client);
    }, [isOpen, client, form]);

    const onSubmit: SubmitHandler<ClientValues> = (data) => {
        onSave(data, client?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{client ? "Edit" : "Add"} Client</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="logo" render={({ field }) => (
                        <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="aiHint" render={({ field }) => (
                        <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Client</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

const AddEditTestimonialDialog = ({ testimonial, onSave, children }: { testimonial?: Testimonial, onSave: (values: TestimonialValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TestimonialValues>({
        resolver: zodResolver(TestimonialSchema),
    });
     useEffect(() => {
        if(isOpen) form.reset(testimonial);
    }, [isOpen, testimonial, form]);
    
    const onSubmit: SubmitHandler<TestimonialValues> = (data) => {
        onSave(data, testimonial?.id);
        setIsOpen(false);
    };

     return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{testimonial ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
                <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField control={form.control} name="quote" render={({ field }) => (
                        <FormItem><FormLabel>Quote</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="author" render={({ field }) => (
                        <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="avatarId" render={({ field }) => (
                        <FormItem><FormLabel>Avatar ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button type="submit">Save Testimonial</Button></DialogFooter>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
};

export default function ClientTable({ initialClients, initialTestimonials }: { initialClients: Client[], initialTestimonials: Testimonial[] }) {
    const { toast } = useToast();
    const { clients, setClients, isClient: isClientsClient } = useClientsData();
    const { testimonials, setTestimonials, isClient: isTestimonialsClient } = useTestimonialsData();
    const isClient = isClientsClient && isTestimonialsClient;
    
    useEffect(() => {
        setClients(() => initialClients);
        setTestimonials(() => initialTestimonials);
    }, [initialClients, initialTestimonials, setClients, setTestimonials]);


    const handleClientSave = (values: ClientValues, id?: string) => {
        if (id) {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
        } else {
            setClients(prev => [{ ...values, id: `client_${Date.now()}` }, ...prev]);
        }
        toast({ title: `Client ${id ? 'updated' : 'added'}.` });
    };

    const handleClientDelete = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        toast({ title: 'Client removed.', variant: 'destructive' });
    };

    const handleTestimonialSave = (values: TestimonialValues, id?: string) => {
        if (id) {
            setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...values } : t));
        } else {
            setTestimonials(prev => [{ ...values, id: `test_${Date.now()}` }, ...prev]);
        }
        toast({ title: `Testimonial ${id ? 'updated' : 'added'}.` });
    };
    
    const handleTestimonialDelete = (id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Testimonial removed.', variant: 'destructive' });
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Clients</CardTitle>
                    <AddEditClientDialog onSave={handleClientSave}>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add Client</Button>
                    </AddEditClientDialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {!isClient ? <TableRow><TableCell colSpan={3}><Skeleton className="w-full h-12" /></TableCell></TableRow> : (
                                clients.map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell><Image src={client.logo} alt={client.name} width={100} height={40} className="object-contain"/></TableCell>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell className="text-right">
                                            <AddEditClientDialog client={client} onSave={handleClientSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditClientDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Client?</AlertDialogTitle><AlertDialogDescription>This will remove "{client.name}" from your client list.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleClientDelete(client.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Testimonials</CardTitle>
                     <AddEditTestimonialDialog onSave={handleTestimonialSave}>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add Testimonial</Button>
                    </AddEditTestimonialDialog>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Author</TableHead><TableHead>Quote</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                             {!isClient ? <TableRow><TableCell colSpan={3}><Skeleton className="w-full h-12" /></TableCell></TableRow> : (
                                testimonials.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <p className="font-medium">{t.author}</p>
                                            <p className="text-sm text-muted-foreground">{t.company}</p>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground italic">"{t.quote}"</TableCell>
                                        <TableCell className="text-right">
                                            <AddEditTestimonialDialog testimonial={t} onSave={handleTestimonialSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditTestimonialDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Testimonial?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleTestimonialDelete(t.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
