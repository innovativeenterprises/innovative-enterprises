
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Pricing } from "@/lib/pricing.schema";
import { Edit } from "lucide-react";


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

export default function PricingTable({ pricing, setPricing }: { pricing: Pricing[], setPricing: Function }) { 
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pricing | undefined>(undefined);

    const handleSave = (values: PricingValues, id: string) => {
        setPricing((prev: Pricing[]) => prev.map(p => p.id === id ? { ...p, ...values } : p));
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
                         {pricing.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.type}</TableCell>
                                <TableCell className="text-muted-foreground">{item.group}</TableCell>
                                <TableCell>OMR {item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
