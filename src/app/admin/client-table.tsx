
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
import { useToast } from "@/hooks/use-toast";
import type { Client, Testimonial } from "@/lib/clients";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Schemas
const ClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logo: z.string().min(1, "A logo is required"),
  aiHint: z.string().min(2, "AI hint is required"),
});
type ClientValues = z.infer<typeof ClientSchema>;

const TestimonialSchema = z.object({
  quote: z.string().min(10, "Quote is required"),
  author: z.string().min(2, "Author is required"),
  company: z.string().min(2, "Company/Title is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;


// This hook now connects to the global store.
export const useClientsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        clients: data.clients,
        setClients: (updater: (clients: Client[]) => Client[]) => {
            const currentClients = store.get().clients;
            const newClients = updater(currentClients);
            store.set(state => ({ ...state, clients: newClients }));
        },
        testimonials: data.testimonials,
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
             const currentTestimonials = store.get().testimonials;
            const newTestimonials = updater(currentTestimonials);
            store.set(state => ({ ...state, testimonials: newTestimonials }));
        }
    };
};


// Add/Edit Dialogs
const AddEditClientDialog = ({ client, onSave, children }: { client?: Client, onSave: (v: ClientValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const form = useForm({
        defaultValues: {
            name: client?.name || "",
            aiHint: client?.aiHint || "",
            logoFile: undefined,
            logoUrl: client?.logo.startsWith('http') || client?.logo.startsWith('data:') ? client.logo : "",
            useUrl: client?.logo.startsWith('http') || client?.logo.startsWith('data:') || false,
        },
    });
    
    useEffect(() => { 
        if(isOpen) {
            const isUrl = client?.logo?.startsWith('http') || client?.logo.startsWith('data:') || false;
            form.reset({ 
                name: client?.name || "", 
                aiHint: client?.aiHint || "",
                logoFile: undefined,
                logoUrl: isUrl ? client.logo : "",
                useUrl: isUrl,
            });
        }
    }, [client, form, isOpen]);
    
    const watchUseUrl = form.watch('useUrl');

    const onSubmit: SubmitHandler<any> = async (data) => {
        let logoValue = client?.logo || "";
        
        if(data.useUrl) {
            if (data.logoUrl) {
                logoValue = data.logoUrl;
            }
        } else {
            if (data.logoFile && data.logoFile[0]) {
                const file = data.logoFile[0];
                logoValue = await fileToDataURI(file);
            }
        }

        if (!logoValue) {
            form.setError('logoUrl', { message: 'Please provide either a logo file or a URL.' });
            return;
        }

        onSave({ name: data.name, aiHint: data.aiHint, logo: logoValue }, client?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{client ? "Edit" : "Add"} Client Logo</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

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

                        {watchUseUrl ? (
                            <FormField control={form.control} name="logoUrl" render={({ field }) => (
                                <FormItem><FormLabel>Logo Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        ) : (
                             <FormField control={form.control} name="logoFile" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        <FormField control={form.control} name="aiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Client</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const AddEditTestimonialDialog = ({ testimonial, onSave, children }: { testimonial?: Testimonial, onSave: (v: TestimonialValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TestimonialValues>({
        resolver: zodResolver(TestimonialSchema),
        defaultValues: testimonial || { quote: "", author: "", company: "" },
    });
    useEffect(() => { if(isOpen) {form.reset(testimonial || { quote: "", author: "", company: "" })} }, [testimonial, form, isOpen]);

    const onSubmit: SubmitHandler<TestimonialValues> = (data) => {
        onSave(data, testimonial?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{testimonial ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="quote" render={({ field }) => (
                            <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="author" render={({ field }) => (
                            <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="company" render={({ field }) => (
                            <FormItem><FormLabel>Author's Company / Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Testimonial</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


// Main Component
export default function ClientTable({ 
    clients, 
    setClients, 
    testimonials, 
    setTestimonials 
}: { 
    clients: Client[], 
    setClients: (updater: (clients: Client[]) => Client[]) => void, 
    testimonials: Testimonial[], 
    setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => void 
}) {
    const { toast } = useToast();

    // Handlers
    const handleSaveClient = (values: ClientValues, id?: string) => {
        if (id) {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
            toast({ title: "Client updated." });
        } else {
            const newClient: Client = { ...values, id: `client_${Date.now()}` };
            setClients(prev => [newClient, ...prev]);
            toast({ title: "Client added." });
        }
    };

    const handleDeleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        toast({ title: "Client removed.", variant: "destructive" });
    };
    
    const handleSaveTestimonial = (values: TestimonialValues, id?: string) => {
        if (id) {
            setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...values } : t));
            toast({ title: "Testimonial updated." });
        } else {
            const newTestimonial: Testimonial = { ...values, id: `test_${Date.now()}` };
            setTestimonials(prev => [newTestimonial, ...prev]);
            toast({ title: "Testimonial added." });
        }
    };

    const handleDeleteTestimonial = (id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast({ title: "Testimonial removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Client & Testimonial Management</CardTitle>
                <CardDescription>Manage the logos and testimonials on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="clients">
                    <div className="flex justify-between items-end">
                        <TabsList>
                            <TabsTrigger value="clients">Client Logos</TabsTrigger>
                            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                        </TabsList>
                        <TabsContent value="clients" className="m-0 p-0">
                            <AddEditClientDialog onSave={handleSaveClient}>
                                <Button><PlusCircle /> Add Client</Button>
                            </AddEditClientDialog>
                        </TabsContent>
                         <TabsContent value="testimonials" className="m-0 p-0">
                            <AddEditTestimonialDialog onSave={handleSaveTestimonial}>
                                <Button><PlusCircle /> Add Testimonial</Button>
                            </AddEditTestimonialDialog>
                        </TabsContent>
                    </div>
                    <TabsContent value="clients">
                        <Table>
                             <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {clients.map(client => (
                                    <TableRow key={client.id} className="cursor-pointer">
                                        <TableCell>
                                            <AddEditClientDialog client={client} onSave={handleSaveClient}>
                                                <div className="p-2 rounded-md hover:bg-muted">
                                                    <Image src={client.logo || "https://placehold.co/150x60.png"} alt={client.name} width={100} height={40} className="object-contain" />
                                                </div>
                                            </AddEditClientDialog>
                                        </TableCell>
                                        <TableCell><AddEditClientDialog client={client} onSave={handleSaveClient}><div>{client.name}</div></AddEditClientDialog></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete Client?</AlertDialogTitle><AlertDialogDescription>This will remove the client "{client.name}" from your homepage.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteClient(client.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="testimonials">
                         <Table>
                             <TableHeader><TableRow><TableHead>Quote</TableHead><TableHead>Author</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {testimonials.map(t => (
                                    <TableRow key={t.id} className="cursor-pointer">
                                        <TableCell className="italic max-w-md truncate">
                                            <AddEditTestimonialDialog testimonial={t} onSave={handleSaveTestimonial}>
                                                <div className="p-2 -m-2 rounded-md hover:bg-muted">"{t.quote}"</div>
                                            </AddEditTestimonialDialog>
                                        </TableCell>
                                        <TableCell>
                                            <AddEditTestimonialDialog testimonial={t} onSave={handleSaveTestimonial}>
                                                <div>{t.author}, <span className="text-muted-foreground">{t.company}</span></div>
                                            </AddEditTestimonialDialog>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete Testimonial?</AlertDialogTitle><AlertDialogDescription>This will remove the testimonial by {t.author}.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTestimonial(t.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    