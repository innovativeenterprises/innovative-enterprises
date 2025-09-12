

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
import { useToast } from "@/hooks/use-toast";
import type { Client, Testimonial } from "@/lib/clients";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { fileToDataURI } from "@/lib/utils";
import { useClientsData } from "@/hooks/use-global-store-data";

// Schemas
const ClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  aiHint: z.string().min(2, "AI hint is required"),
  logoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  logoFile: z.any().optional(),
}).refine(data => data.logoUrl || (data.logoFile && data.logoFile.length > 0), {
    message: "Either a Logo URL or a Logo File is required.",
    path: ["logoUrl"],
});
type ClientValues = z.infer<typeof ClientSchema> & { logo: string };


const TestimonialSchema = z.object({
  quote: z.string().min(10, "Quote is required"),
  author: z.string().min(2, "Author is required"),
  company: z.string().min(2, "Company/Title is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;


// Add/Edit Dialogs
const AddEditClientDialog = ({ client, onSave, children }: { client?: Client, onSave: (v: ClientValues, id?: string) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(client?.logo || null);

    const form = useForm<z.infer<typeof ClientSchema>>({
        defaultValues: {
            name: client?.name || "",
            aiHint: client?.aiHint || "",
            logoUrl: client?.logo || "",
            logoFile: undefined,
        },
    });

    const watchLogoUrl = form.watch('logoUrl');
    const watchLogoFile = form.watch('logoFile');

    useEffect(() => {
        if (watchLogoFile && watchLogoFile.length > 0) {
            fileToDataURI(watchLogoFile[0]).then(setImagePreview);
        } else if (watchLogoUrl) {
            setImagePreview(watchLogoUrl);
        } else {
             setImagePreview(client?.logo || null);
        }
    }, [watchLogoUrl, watchLogoFile, client?.logo]);
    
    useEffect(() => { 
        if(isOpen) {
            form.reset({ 
                name: client?.name || "", 
                aiHint: client?.aiHint || "",
                logoUrl: client?.logo || "",
                logoFile: undefined,
            });
             setImagePreview(client?.logo || null);
        }
    }, [client, form, isOpen]);
    
    const onSubmit: SubmitHandler<z.infer<typeof ClientSchema>> = async (data) => {
        let logoValue = "";

        if (data.logoFile && data.logoFile[0]) {
            logoValue = await fileToDataURI(data.logoFile[0]);
        } else if (data.logoUrl) {
            logoValue = data.logoUrl;
        }

        onSave({ ...data, logo: logoValue }, client?.id);
        setImagePreview(null);
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

                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-sm font-medium">Client Logo</h4>
                                {imagePreview && (
                                    <div className="relative h-24 w-full rounded-md overflow-hidden border flex items-center justify-center bg-muted">
                                        <Image src={imagePreview} alt="Image Preview" fill className="object-contain p-2"/>
                                    </div>
                                )}
                                <FormField control={form.control} name="logoUrl" render={({ field }) => (
                                    <FormItem><FormLabel>Logo Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                
                                <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                                </div>

                                <FormField control={form.control} name="logoFile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Logo File</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

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
export default function ClientTable() { 
    const { clients, setClients, testimonials, setTestimonials, isClient } = useClientsData();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('clients');

    // Handlers
    const handleSaveClient = (values: ClientValues, id?: string) => {
        if (id) {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
            toast({ title: "Client updated." });
        } else {
            const newClient: Client = { ...values, id: `client_${values.name.toLowerCase().replace(/\s+/g, '_')}` };
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
            const newTestimonial: Testimonial = { ...values, id: `test_${values.author.toLowerCase().replace(/\s+/g, '_')}` };
            setTestimonials(prev => [newTestimonial, ...prev]);
            toast({ title: "Testimonial added." });
        }
    };

    const handleDeleteTestimonial = (id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast({ title: "Testimonial removed.", variant: "destructive" });
    };

    const filteredClients = useMemo(() => {
        if (!isClient) return [];
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm, isClient]);

    const filteredTestimonials = useMemo(() => {
         if (!isClient) return [];
        return testimonials.filter(t =>
            t.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [testimonials, searchTerm, isClient]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Client & Testimonial Management</CardTitle>
                <CardDescription>Manage the logos and testimonials on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="clients">Client Logos</TabsTrigger>
                            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                        </TabsList>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {activeTab === 'clients' ? (
                                <AddEditClientDialog onSave={handleSaveClient}>
                                    <Button className="shrink-0"><PlusCircle /> Add Client</Button>
                                </AddEditClientDialog>
                            ) : (
                                <AddEditTestimonialDialog onSave={handleSaveTestimonial}>
                                    <Button className="shrink-0"><PlusCircle /> Add Testimonial</Button>
                                </AddEditTestimonialDialog>
                            )}
                        </div>
                    </div>
                    <TabsContent value="clients">
                        <Table>
                             <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {!isClient ? (
                                     Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-12 w-full"/></TableCell></TableRow>
                                    ))
                                ) : (
                                filteredClients.map(client => (
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
                                )))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="testimonials">
                         <Table>
                             <TableHeader><TableRow><TableHead>Quote</TableHead><TableHead>Author</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {!isClient ? (
                                      Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-12 w-full"/></TableCell></TableRow>
                                    ))
                                ) : (
                                filteredTestimonials.map(t => (
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
                                )))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
