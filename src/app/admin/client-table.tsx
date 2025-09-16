
'use client';

import { useState, useMemo, useEffect } from "react";
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
import { fileToDataURI } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  avatarId: z.string().min(1, "Avatar ID is required"),
});
type TestimonialValues = z.infer<typeof TestimonialSchema>;


// Add/Edit Dialogs
const AddEditClientDialog = ({ 
    client, 
    onSave, 
    children, 
    isOpen, 
    onOpenChange 
}: { 
    client?: Client, 
    onSave: (v: ClientValues, id?: string) => void, 
    children: React.ReactNode, 
    isOpen: boolean, 
    onOpenChange: (open: boolean) => void 
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(client?.logo || null);

    const form = useForm<z.infer<typeof ClientSchema>>({
        resolver: zodResolver(ClientSchema),
    });

    const watchLogoFile = form.watch('logoFile');
    const watchLogoUrl = form.watch('logoUrl');

    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: client?.name || "",
                aiHint: client?.aiHint || "",
                logoUrl: client?.logo || "",
                logoFile: undefined,
            });
            setImagePreview(client?.logo || null);
        }
    }, [isOpen, client, form]);

    useEffect(() => {
        if (watchLogoFile && watchLogoFile.length > 0) {
            fileToDataURI(watchLogoFile[0]).then(setImagePreview);
        } else if (watchLogoUrl) {
            setImagePreview(watchLogoUrl);
        } else {
            setImagePreview(null);
        }
    }, [watchLogoUrl, watchLogoFile]);
    
    const onSubmit: SubmitHandler<z.infer<typeof ClientSchema>> = async (data) => {
        let logoValue = "";

        if (data.logoFile && data.logoFile[0]) {
            logoValue = await fileToDataURI(data.logoFile[0]);
        } else if (data.logoUrl) {
            logoValue = data.logoUrl;
        }

        onSave({ ...data, logo: logoValue }, client?.id);
        setImagePreview(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

const AddEditTestimonialDialog = ({ 
    testimonial, 
    onSave, 
    children,
    isOpen,
    onOpenChange,
}: { 
    testimonial?: Testimonial, 
    onSave: (v: TestimonialValues, id?: string) => void, 
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const form = useForm<TestimonialValues>({
        resolver: zodResolver(TestimonialSchema),
        defaultValues: testimonial || { quote: "", author: "", company: "", avatarId: "" },
    });
    
    useEffect(() => { 
        if(isOpen) {
            form.reset(testimonial || { quote: "", author: "", company: "", avatarId: "" });
        }
    }, [isOpen, testimonial, form]);

    const onSubmit: SubmitHandler<TestimonialValues> = (data) => {
        onSave(data, testimonial?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                         <FormField control={form.control} name="avatarId" render={({ field }) => (
                            <FormItem><FormLabel>Avatar ID</FormLabel><FormControl><Input placeholder="e.g., 'gov1' or 'corp2'" {...field} /></FormControl><FormMessage /></FormItem>
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
export default function ClientTable({ initialClients, initialTestimonials }: { initialClients: Client[], initialTestimonials: Testimonial[] }) { 
    const [clients, setClients] = useState(initialClients);
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('clients');
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
    
    const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>(undefined);

    const openClientDialog = (client?: Client) => {
        setSelectedClient(client);
        setIsClientDialogOpen(true);
    };

    const openTestimonialDialog = (testimonial?: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsTestimonialDialogOpen(true);
    };


    // Handlers
    const handleSaveClient = (values: ClientValues, id?: string) => {
        if (id) {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...values, id } : c));
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
            setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...values, id } : t));
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
        if(!isClient) return [];
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [clients, searchTerm, isClient]);
    
    const filteredTestimonials = useMemo(() => {
        if(!isClient) return [];
        return testimonials.filter(t =>
            t.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
                                <Button className="shrink-0" onClick={() => openClientDialog()}><PlusCircle /> Add Client</Button>
                            ) : (
                                <Button className="shrink-0" onClick={() => openTestimonialDialog()}><PlusCircle /> Add Testimonial</Button>
                            )}
                        </div>
                    </div>
                    <TabsContent value="clients">
                        <AddEditClientDialog 
                            isOpen={isClientDialogOpen} 
                            onOpenChange={setIsClientDialogOpen} 
                            client={selectedClient} 
                            onSave={handleSaveClient}
                        >
                            <div/>
                        </AddEditClientDialog>
                        <Table>
                             <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {!isClient ? (
                                    <TableRow><TableCell colSpan={3}><Skeleton className="h-12 w-full"/></TableCell></TableRow>
                                ) : (
                                    filteredClients.map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="p-2 rounded-md hover:bg-muted cursor-pointer" onClick={() => openClientDialog(client)}>
                                                <Image src={client.logo || "https://placehold.co/150x60.png"} alt={client.name} width={100} height={40} className="object-contain" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium cursor-pointer" onClick={() => openClientDialog(client)}>
                                                {client.name}
                                            </div>
                                        </TableCell>
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
                         <AddEditTestimonialDialog
                            isOpen={isTestimonialDialogOpen}
                            onOpenChange={setIsTestimonialDialogOpen}
                            testimonial={selectedTestimonial}
                            onSave={handleSaveTestimonial}
                         >
                            <div/>
                         </AddEditTestimonialDialog>
                         <Table>
                             <TableHeader><TableRow><TableHead>Quote</TableHead><TableHead>Author</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {!isClient ? (
                                     <TableRow><TableCell colSpan={3}><Skeleton className="h-12 w-full"/></TableCell></TableRow>
                                ) : (
                                    filteredTestimonials.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell className="italic max-w-md truncate">
                                                <div className="p-2 -m-2 rounded-md hover:bg-muted cursor-pointer" onClick={() => openTestimonialDialog(t)}>"{t.quote}"</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="cursor-pointer" onClick={() => openTestimonialDialog(t)}>{t.author}, <span className="text-muted-foreground">{t.company}</span></div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                     <Button variant="ghost" size="icon" onClick={() => openTestimonialDialog(t)}><Edit/></Button>
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
