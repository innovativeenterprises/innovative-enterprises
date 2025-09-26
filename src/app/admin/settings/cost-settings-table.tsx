'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import type { CostRate } from "@/lib/cost-settings.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useCostSettingsData } from "@/hooks/use-data-hooks";


const CostRateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Item name is required"),
  category: z.enum(['Material', 'Labor', 'Equipment', 'Travel']),
  unit: z.string().min(1, "Unit is required"),
  rate: z.coerce.number().min(0, "Rate must be non-negative"),
});
type CostRateValues = z.infer<typeof CostRateSchema>;

const AddEditCostRateDialog = ({ 
    rate, 
    onSave,
    children,
    isOpen,
    onOpenChange,
}: { 
    rate?: CostRate, 
    onSave: (values: CostRateValues, id?: string) => void,
    children: React.ReactNode,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
}) => {
    const form = useForm<CostRateValues>({
        resolver: zodResolver(CostRateSchema),
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(rate || { name: "", category: 'Material', unit: "", rate: 0 });
        }
    }, [rate, form, isOpen]);

    const onSubmit: SubmitHandler<CostRateValues> = (data) => {
        onSave(data, rate?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{rate ? "Edit" : "Add"} Market Rate</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Material">Material</SelectItem>
                                    <SelectItem value="Labor">Labor</SelectItem>
                                    <SelectItem value="Equipment">Equipment</SelectItem>
                                    <SelectItem value="Travel">Travel</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="rate" render={({ field }) => (
                                <FormItem><FormLabel>Rate (OMR)</FormLabel><FormControl><Input type="number" step="0.001" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="unit" render={({ field }) => (
                            <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., per m², per hour, per km" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Rate</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default function CostSettingsTable() {
    const { data: costSettings, setData: setCostSettings, isClient } = useCostSettingsData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState<CostRate | undefined>(undefined);

    const handleOpenDialog = (rate?: CostRate) => {
        setSelectedRate(rate);
        setIsDialogOpen(true);
    };

    const handleSave = (values: CostRateValues, id?: string) => {
        if (id) {
            setCostSettings(prev => prev.map(r => (r.id === id ? { ...r, ...values } as CostRate : r)));
            toast({ title: "Rate updated." });
        } else {
            const newRate: CostRate = { ...values, id: `cost_${Date.now()}` };
            setCostSettings(prev => [newRate, ...prev]);
            toast({ title: "Rate added." });
        }
    };

    const handleDelete = (id: string) => {
        setCostSettings(prev => prev.filter(r => r.id !== id));
        toast({ title: "Rate removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Market Rates for Cost Estimation</CardTitle>
                    <CardDescription>These rates are used by the AI to estimate project costs.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Rate</Button>
            </CardHeader>
            <CardContent>
                <AddEditCostRateDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    rate={selectedRate}
                    onSave={handleSave}
                >
                    <div />
                </AddEditCostRateDialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Rate (OMR)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                        ) : (
                            costSettings.map(rate => (
                                <TableRow key={rate.id}>
                                    <TableCell className="font-medium">{rate.name}</TableCell>
                                    <TableCell>{rate.category}</TableCell>
                                    <TableCell>{rate.unit}</TableCell>
                                    <TableCell className="text-right font-mono">{rate.rate.toFixed(3)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(rate)}>
                                                <Edit />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete Rate?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{rate.name}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(rate.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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