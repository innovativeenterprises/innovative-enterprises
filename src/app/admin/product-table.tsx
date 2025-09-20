
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import type { Product } from "@/lib/products.schema";
import { PlusCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddEditProductDialog, type ProductValues } from '@/app/admin/product-form-dialog';
import type { ProjectStage } from "@/lib/stages";

export default function ProductTable({ initialProducts, initialStages }: { initialProducts: Product[], initialStages: ProjectStage[] }) {
    const [products, setProducts] = useState<Product[]>([]);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const handleToggle = (id: number) => {
        // In a real app, this would be a server action.
        toast({ title: "Action not implemented in prototype." });
    };

    const openDialog = (product?: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    }

    const handleSave = (values: ProductValues, id?: number) => {
        // In a real app, this would be a server action.
        toast({ title: "Action not implemented in prototype." });
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
                    stages={initialStages}
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
                        {products.map((product) => (
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
