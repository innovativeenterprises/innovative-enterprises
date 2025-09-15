
'use client';

import { useState, useEffect, useMemo } from "react";
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
import type { Pricing, PricingGroup } from "@/lib/pricing";
import { Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePricingData } from "@/hooks/use-global-store-data";
import { setPricing } from "@/hooks/use-global-store-data";

const PricingSchema = z.object({
  price: z.coerce.number().min(0, "Price must be a positive number"),
});
type PricingValues = z.infer<typeof PricingSchema>;

const EditPriceDialog = ({ 
    item, 
    onSave,
    children 
}: { 
    item: Pricing, 
    onSave: (values: PricingValues, id: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<PricingValues>({
        resolver: zodResolver(PricingSchema),
        defaultValues: { price: item.price },
    });

    useEffect(() => {
        if(isOpen) {
            form.reset({ price: item.price });
        }
    }, [item, form, isOpen]);

    const onSubmit: SubmitHandler<PricingValues> = (data) => {
        onSave(data, item.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

export default function PricingTable() { 
    const { pricing, isClient } = usePricingData();
    const { toast } = useToast();

    const handleSave = (values: PricingValues, id: string) => {
        setPricing(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
        toast({ title: "Price updated successfully." });
    };

    const pricingByGroup = useMemo(() => {
        if (!isClient) return {};
        return pricing.reduce((acc, item) => {
            const groupName = item.group || 'Uncategorized';
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(item);
            return acc;
        }, {} as Record<string, Pricing[]>);
    }, [pricing, isClient]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Translation Pricing Management</CardTitle>
                <CardDescription>Manage the per-page price for document translation.</CardDescription>
            </CardHeader>
            <CardContent>
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
                             Object.entries(pricingByGroup).flatMap(([group, items]) => (
                                items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.type}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.group}</TableCell>
                                        <TableCell>OMR {item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <EditPriceDialog item={item} onSave={handleSave}>
                                                <Button variant="ghost" size="icon" aria-label={`Edit price for ${item.type}`}><Edit /></Button>
                                            </EditPriceDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
