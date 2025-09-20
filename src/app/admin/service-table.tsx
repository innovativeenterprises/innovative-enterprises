'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { Client, Testimonial } from "@/lib/clients.schema";
import { PlusCircle, Edit, Trash2, GripVertical } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { useClientsData, useTestimonialsData, useServicesData, useProductsData, usePricingData, usePosProductsData } from "@/hooks/use-global-store-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AddEditProductDialog, type ProductValues } from '@/app/admin/product-form-dialog';
import { initialStages } from "@/lib/stages";
import type { ProjectStage } from "@/lib/stages";
import type { Service } from "@/lib/services.schema";
import type { Product } from "@/lib/products.schema";
import type { Pricing } from "@/lib/pricing.schema";
import type { PosProduct } from "@/lib/pos-data.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- ServiceTable Logic ---
const SortableServiceRow = ({ service, handleToggle }: { service: Service, handleToggle: (title: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.title });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                 <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                    <Switch
                        checked={service.enabled}
                        onCheckedChange={() => handleToggle(service.title)}
                        aria-label={`Enable/disable ${service.title}`}
                    />
                    <Badge variant={service.enabled ? "default" : "secondary"}>
                        {service.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </TableCell>
        </TableRow>
    );
};

function ServiceTable() {
    const { services, setServices, isClient } = useServicesData();
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleToggle = (title: string) => {
        setServices(prev =>
            prev.map(service =>
                service.title === title ? { ...service, enabled: !service.enabled } : service
            )
        );
        toast({ title: "Service status updated." });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setServices((items) => {
                const oldIndex = items.findIndex(item => item.title === active.id);
                const newIndex = items.findIndex(item => item.title === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            toast({ title: "Service order updated." });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Enable or disable public-facing services from the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead className="w-[250px]">Service</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isClient ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Skeleton className="h-20 w-full" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext items={services.map(s => s.title)} strategy={verticalListSortingStrategy}>
                                    {services.map(service => (
                                        <SortableServiceRow
                                            key={service.title}
                                            service={service}
                                            handleToggle={handleToggle}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}

// --- ProductTable Logic ---
function ProductTable() {
    const { products, setProducts, isClient } = useProductsData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    
    const stages: ProjectStage[] = initialStages; // This is small and can remain static

    const handleToggle = (id: number) => {
        setProducts(prev =>
            prev.map(product =>
                product.id === id ? { ...product, enabled: !product.enabled } : product
            )
        );
        toast({ title: "Product status updated." });
    };

    const openDialog = (product?: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    }

    const handleSave = (values: ProductValues, id?: number) => {
        if (id !== undefined) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values, id } : p));
            toast({ title: "Product updated successfully." });
        } else {
            const newProduct: Product = {
                ...values,
                id: (products.length > 0 ? Math.max(...products.map(p => p.id || 0)) : 0) + 1,
            };
            setProducts(prev => [newProduct, ...prev]);
            toast({ title: "Product added successfully." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Enable or disable products shown on your homepage showcase.</CardDescription>
                </div>
                 <Button onClick={() => openDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </CardHeader>
            <CardContent>
                <AddEditProductDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct}
                    onSave={handleSave}
                    stages={stages}
                >
                    <div />
                </AddEditProductDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price (OMR)</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}>
                                        <Skeleton className="h-10 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell>{product.price > 0 ? `OMR ${product.price.toFixed(2)}` : 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={product.enabled}
                                            onCheckedChange={() => handleToggle(product.id!)}
                                            aria-label={`Enable/disable ${product.name}`}
                                        />
                                    </TableCell>
                                     <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(product)}>
                                            <Edit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- ClientTable Logic ---
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

function ClientTable() {
    const { toast } = useToast();
    const { clients, setClients, isClient: isClientsClient } = useClientsData();
    const { testimonials, setTestimonials, isClient: isTestimonialsClient } = useTestimonialsData();
    const isClient = isClientsClient && isTestimonialsClient;

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

// --- PricingTable Logic ---
const PricingFormSchema = z.object({
  price: z.coerce.number().min(0, "Price must be a positive number"),
});
type PricingValues = z.infer<typeof PricingFormSchema>;

const EditPriceDialog = ({ 
    item, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    item: Pricing, 
    onSave: (values: PricingValues, id: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<PricingValues>({
        resolver: zodResolver(PricingFormSchema),
    });

    useEffect(() => {
        if(isOpen) {
            form.reset({ price: item.price });
        }
    }, [item, form, isOpen]);

    const onSubmit: SubmitHandler<PricingValues> = (data) => {
        onSave(data, item.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Price</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <p className="font-medium text-sm">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.group}</p>
                        </div>
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price per page (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Price</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function PricingTable() { 
    const { pricing, setPricing, isClient } = usePricingData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pricing | undefined>(undefined);

    const handleSave = (values: PricingValues, id: string) => {
        setPricing(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
        toast({ title: "Price updated successfully." });
    };
    
    const handleOpenDialog = (item: Pricing) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Translation Pricing Management</CardTitle>
                <CardDescription>Manage the per-page price for document translation.</CardDescription>
            </CardHeader>
            <CardContent>
                {selectedItem && (
                    <EditPriceDialog
                      isOpen={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      item={selectedItem}
                      onSave={handleSave}
                    >
                      <div />
                    </EditPriceDialog>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price (OMR)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             <TableRow>
                                <TableCell colSpan={4}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                             pricing.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.type}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.group}</TableCell>
                                    <TableCell>OMR {item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- PosProductTable Logic ---
const PosProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(['Hot Drinks', 'Cold Drinks', 'Sandwiches', 'Snacks', 'Pastries']),
  price: z.coerce.number().positive("Price must be a positive number"),
  imageUrl: z.string().url("A valid image URL is required"),
});
type PosProductValues = z.infer<typeof PosProductSchema>;

const AddEditPosProductDialog = ({ 
    product, 
    onSave,
    isOpen,
    onOpenChange,
    children 
}: { 
    product?: PosProduct, 
    onSave: (values: PosProductValues, id?: string) => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode 
}) => {
    const form = useForm<PosProductValues>({
        resolver: zodResolver(PosProductSchema),
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(product || { name: "", category: "Snacks", price: 0, imageUrl: "https://images.unsplash.com/photo-1599405452230-74f00454a83a?q=80&w=600&auto=format&fit=crop" });
        }
    }, [product, form, isOpen]);

    const onSubmit: SubmitHandler<PosProductValues> = (data) => {
        onSave(data, product?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Edit" : "Add"} POS Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., Cappuccino" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Hot Drinks">Hot Drinks</SelectItem>
                                        <SelectItem value="Cold Drinks">Cold Drinks</SelectItem>
                                        <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                        <SelectItem value="Pastries">Pastries</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price (OMR)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         {form.watch("imageUrl") && (
                             <Image src={form.watch("imageUrl")} alt="Preview" width={100} height={100} className="rounded-md object-cover" />
                         )}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

function PosProductTable() {
    const { posProducts, setPosProducts, isClient } = usePosProductsData();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<PosProduct | undefined>(undefined);

    const openDialog = (product?: PosProduct) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSave = (values: PosProductValues, id?: string) => {
        if (id) {
            setPosProducts(prev => prev.map(item => item.id === id ? { ...item, ...values } : item));
            toast({ title: "Product updated." });
        } else {
            const newItem: PosProduct = { ...values, id: `pos_${values.name.toLowerCase().replace(/\s+/g, '_')}` };
            setPosProducts(prev => [newItem, ...prev]);
            toast({ title: "Product added." });
        }
    };

    const handleDelete = (id: string) => {
        setPosProducts(prev => prev.filter(item => item.id !== id));
        toast({ title: "Product removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>AI-POS Product Management</CardTitle>
                    <CardDescription>Manage the products available in the canteen's point-of-sale system.</CardDescription>
                </div>
                 <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4"/> Add Product</Button>
            </CardHeader>
            <CardContent>
                <AddEditPosProductDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct}
                    onSave={handleSave}
                >
                    <div />
                </AddEditPosProductDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price (OMR)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Skeleton className="h-20 w-full" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            posProducts.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                                    <TableCell className="text-right font-mono">{item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog(item)}><Edit /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{item.name}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---
export default function AdminContentPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">
                    Manage your public-facing services, products, clients, and pricing.
                </p>
            </div>
            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                    <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                    <TabsTrigger value="pos">AI-POS Products</TabsTrigger>
                </TabsList>
                <TabsContent value="services" className="mt-6">
                    <ServiceTable />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                    <ProductTable />
                </TabsContent>
                <TabsContent value="clients" className="mt-6">
                    <ClientTable />
                </TabsContent>
                <TabsContent value="pricing" className="mt-6">
                    <PricingTable />
                </TabsContent>
                <TabsContent value="pos" className="mt-6">
                    <PosProductTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}