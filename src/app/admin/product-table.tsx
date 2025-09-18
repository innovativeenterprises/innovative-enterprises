
'use client';

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { ProjectStage } from "@/lib/stages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEditProductDialog, type ProductValues } from '@/app/admin/product-form-dialog';

export default function ProductTable({ initialProducts, initialStages }: { initialProducts: Product[], initialStages: ProjectStage[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

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
                 <AddEditProductDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct}
                    onSave={handleSave}
                    stages={initialStages}
                >
                     <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </AddEditProductDialog>
            </CardHeader>
            <CardContent>
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
                                        <AddEditProductDialog
                                            product={product}
                                            onSave={handleSave}
                                            stages={initialStages}
                                            isOpen={isDialogOpen && selectedProduct?.id === product.id}
                                            onOpenChange={(open) => {
                                                if (!open) setSelectedProduct(undefined);
                                                setIsDialogOpen(open);
                                            }}
                                        >
                                            <Button variant="ghost" size="icon" onClick={() => openDialog(product)}>
                                                <Edit />
                                            </Button>
                                        </AddEditProductDialog>
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
