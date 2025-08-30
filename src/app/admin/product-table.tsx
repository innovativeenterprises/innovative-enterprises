

'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { ProjectStage } from "@/lib/stages";
import { useProjectStagesData } from "./stage-table";
import { PlusCircle, Edit, Trash2, GripVertical } from "lucide-react";
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { store } from "@/lib/global-store";
import { AddEditProductDialog, type ProductValues } from "./product-form-dialog";

// This hook now connects to the global store.
export const useProductsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            const currentProducts = store.get().products;
            const newProducts = updater(currentProducts);
            store.set(state => ({ ...state, products: newProducts }));
        }
    };
};

const SortableProductRow = ({ product, stages, handleSave, handleDelete, handleToggle, handleOpenDialog }: { 
    product: Product, 
    stages: ProjectStage[], 
    handleSave: (values: ProductValues, id?: number) => void, 
    handleDelete: (id: number) => void, 
    handleToggle: (id: number) => void,
    handleOpenDialog: (product: Product) => void,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

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
            <TableCell>
                 <div className="p-1 -m-1 rounded-md hover:bg-muted cursor-pointer w-fit" onClick={() => handleOpenDialog(product)}>
                    <Image src={product.image} alt={product.name} width={60} height={45} className="rounded-md object-cover" />
                </div>
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell><Badge variant="outline">{product.stage || 'N/A'}</Badge></TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                    <Switch
                        checked={product.enabled}
                        onCheckedChange={() => handleToggle(product.id)}
                        aria-label={`Enable/disable ${product.name}`}
                    />
                    <Badge variant={product.enabled ? "default" : "secondary"}>
                        {product.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}><Edit /></Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the product "{product.name}".</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default function ProductTable({ products, setProducts }: { products: Product[], setProducts: (updater: (products: Product[]) => void) => void }) {
    const { toast } = useToast();
    const { stages } = useProjectStagesData();
    const [isMounted, setIsMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleOpenDialog = (product?: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    }

    const handleSave = (values: ProductValues, id?: number) => {
        if (id) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast({ title: "Product updated successfully." });
        } else {
            const newProduct: Product = {
                ...values,
                id: (products.length > 0 ? Math.max(...products.map(p => p.id)) : 0) + 1,
            };
            setProducts(prev => [newProduct, ...prev]);
            toast({ title: "Product added successfully." });
        }
    };
    
    const handleToggle = (id: number) => {
        setProducts(
            products.map(p =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            )
        );
        toast({ title: "Product status updated." });
    };

    const handleDelete = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: "Product removed.", variant: "destructive" });
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setProducts((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            toast({ title: "Product order updated." });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Digital Product Management</CardTitle>
                    <CardDescription>Manage the projects and SaaS platforms displayed on your homepage.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle /> Add Product</Button>
            </CardHeader>
            <CardContent>
                <AddEditProductDialog 
                    isOpen={isDialogOpen} 
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct} 
                    onSave={handleSave} 
                    stages={stages}
                >
                    <div/>
                </AddEditProductDialog>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {isMounted ? (
                            <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                <TableBody>
                                    {products.map(p => (
                                        <SortableProductRow
                                            key={p.id}
                                            product={p}
                                            stages={stages}
                                            handleSave={handleSave}
                                            handleDelete={handleDelete}
                                            handleToggle={handleToggle}
                                            handleOpenDialog={handleOpenDialog}
                                        />
                                    ))}
                                </TableBody>
                            </SortableContext>
                        ) : (
                            <TableBody>
                                {products.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                                        <TableCell><Image src={p.image} alt={p.name} width={60} height={45} className="rounded-md object-cover" /></TableCell>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell><Badge variant="outline">{p.stage}</Badge></TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <Switch checked={p.enabled} disabled/>
                                                <Badge variant={p.enabled ? "default" : "secondary"}>
                                                    {p.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" disabled><Edit /></Button>
                                                <Button variant="ghost" size="icon" disabled><Trash2 className="text-destructive" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}
